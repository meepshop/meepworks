import React from 'react';
import Emitter from 'component-emitter';
import createLocation from 'history/lib/createLocation';
import { RoutingContext, match } from 'react-router';
import { renderToStaticMarkup } from 'react-dom/server';
import Builder from 'systemjs-builder';
import path from 'path';
import HtmlPage from './html-page';

import Tmpl from './tmpl';

import ApplicationContext from './application-context';
import bootstrap from './bootstrap';
import url from 'url';

const doctype = '<!DOCTYPE html>';

const _ErrorTransport = Symbol();
const _Underscore = /_/;
const CssCache = new Map();


export default class ServerRouter {
  constructor({
    appPath,
    publicPath,
    publicUrl,
    jspmPath = 'jspm_packages',
    jspmConfig = 'jspm_config.js',
    version,
    meepdev = false
  }) {
    this.appPath = appPath;
    this.publicPath = publicPath;
    this.publicUrl = publicUrl;
    this.meepdev = meepdev === true;
    this.version = version;
    this.jspmPath = jspmPath;
    this.jspmConfig = jspmConfig;



    this[_ErrorTransport] = (err) => {
      this.emit('error', err);
    };

  }
  get routes() {
    let router = this;
    //let appPath = path.resolve( router.dirname, router.app );
    let App = require(router.appPath);


    return function * (next) {

      let location = createLocation(this.req.url);

      //process locale list from browser
      let acceptLanguage = this.get('accept-language');
      if(acceptLanguage) {
        acceptLanguage = acceptLanguage.split(',').map((l) => {
          return normalizeLocaleCode(l.split(';').shift());
        });
      } else {
        acceptLanguage = [];
      }
      if(acceptLanguage.length === 0) {
        acceptLanguage.push(router.defaultLocale);
      }
      let locale = acceptLanguage[0];

      let ctx = new ApplicationContext({
        locale,
        acceptLanguage,
        initialData: this.initialData
      });
      ctx.files.add(router.appPath);
      ctx.init = true;
      ctx.on('error', router[_ErrorTransport]);

      yield new Promise(resolve => {

        match({ routes: new App(ctx).routes, location }, async (error, redirectLocation, renderProps) => {
          if(redirectLocation) {
            this.redirect(redirectLocation.pathname + redirectLocation.search);
          } else if(error) {
            this.status = 500;
            router.emit('error', error);
          }

          if(renderProps) {
            try {
              let title = ctx.title;
              if(title) {
                title = Tmpl.format(title, this.params);
              }
              let data = {
                stores: [],
                acceptLanguage: ctx.acceptLanguage,
                locale: ctx.locale,
                localeMapping: ctx.localeMapping,
                initialData: ctx.initialData,
              };

              ctx.stores.forEach(s => {
                data.stores.push(s.dehydrate());
              });

              let cssPreloads = [];
              //trace files for imported css files
              for(let src of ctx.files) {
                let preloads = await router::traceCss(src);
                cssPreloads.push(
                  preloads.map(css => (
                    <link rel="stylesheet" href={css} />
                  ))
                );

              }

              this.body = doctype + renderToStaticMarkup(
                <HtmlPage
                  title={title}
                  scripts={[
                    router::bootstrap(data)
                  ]}
                  styles={cssPreloads}
                  >
                  <RoutingContext {...renderProps} />
                </HtmlPage>
              );
            } catch(err) {
              this.status = 500;
              router.emit('error', err);
            }
          }
          ctx.off('error', router[_ErrorTransport]);
          resolve();

        });
      });
    };
  }
}

Emitter(ServerRouter.prototype);


function normalizeLocaleCode(code) {
  code = code.replace(_Underscore, '-');
  code = code.split('-');
  code[0] = code[0].toLowerCase();
  if(code.length > 1) {
    code[1] = code[1].toUpperCase();
  }
  return code.join('-');
}

const cssCheck = /\.css$/i;

async function traceCss(appPath) {

  if(!CssCache.has(appPath)) {
    let builder = new Builder();
    await builder.loadConfig(this.jspmConfig);

    let trace = await builder.trace(appPath);
    let preloads = Object.keys(trace)
    .filter(item => cssCheck.test(trace[item].path))
    .map(item => {

      let p =  trace[item].path;
      if(p.indexOf(this.jspmPath) > -1) {
        return '/' + p;
      } else {
        return '/' +
          path.resolve(p).replace(this.publicPath, this.publicUrl) +
          (this.version ? `?${this.version}` : '');
      }
    });
    CssCache.set(appPath, preloads);
    builder.reset();
  }
  return CssCache.get(appPath);
}
