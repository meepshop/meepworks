import React from 'react';
import Emitter from 'component-emitter';
import createLocation from 'history/lib/createLocation';
import { RoutingContext, match } from 'react-router';
import { renderToStaticMarkup } from 'react-dom/server';
import path from 'path';
import HtmlPage from './html-page';

import Tmpl from './tmpl';

import ApplicationContext from './application-context';
import bootstrap from './bootstrap';
import url from 'url';

const doctype = '<!DOCTYPE html>';

const _ErrorTransport = Symbol();
const _Underscore = /_/;


export default class ServerRouter {
  constructor({
    app,
    jspmPath = 'jspm_packages',
      jspmConfig = 'jspm_config.js',
      version,
    dirname,
    fileURL,
    meepdev = false,
    defaultLocale = 'en_US'
  }) {
    this.app = app;
    this.dirname = dirname;
    this.defaultLocale = defaultLocale;
    this.meepdev = meepdev === true;
    this.version = version;
    this.jspmPath = jspmPath;
    this.jspmConfig = jspmConfig;
    this.fileURL = fileURL;


    this[_ErrorTransport] = (err) => {
      this.emit('error', err);
    };



  }
  get routes() {
    let router = this;
    let App = require(path.resolve( router.dirname, router.app ));

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
      let locale = this.locale;
      if(!locale) {
        locale = acceptLanguage[0];
      }

      let ctx = new ApplicationContext(locale, acceptLanguage);
      ctx.on('error', router[_ErrorTransport]);

      match({ routes: new App(ctx).routes, location }, (error, redirectLocation, renderProps) => {
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
            localeMapping: ctx.localeMapping
          };

          ctx.stores.forEach(s => {
            data.stores.push(s.dehydrate());
          });


/*
 *                let data = {
 *                  table: driver.routeTable,
 *                  stores: [],
 *                  context: ctx[STATE]
 *                };
 *                ctx.stores.forEach(s => {
 *                  data.stores.push(s.dehydrate());
 *                });
 */



            this.body = doctype + renderToStaticMarkup(
              <HtmlPage
                title={title}
                scripts={[
                  router::bootstrap(url.resolve(router.fileURL, router.app), data)
                ]}
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




/*
 *
 *
 *    export default class AppDriver {
 *      constructor(config) {
 *
 *        //get canonical appPath
 *        let appPath = path.join(config.dirname, config.appPath);
 *        this.config = config;
 *        //console.time('traceTable');
 *        //tracing css is async, so wrap traceRoutes with async so
 *        //requests could wait for this to complete before starting
 *        this.ready = (async () => {
 *          this.routeTable = await this::traceRoutes({
 *            appPath: config.appPath
 *          }, appPath);
 *          //console.timeEnd('traceTable');
 *        })();
 *      }
 *      get router() {
 *
 *        let driver = this;
 *
 *
 *        return function * (next) {
 *
 *          //wait for driver to be ready
 *          yield driver.ready;
 *
 *          //create new application context per request;
 *          let ctx = new AppContext(this);
 *          //APP_INIT controls whether willTransitionTo will be triggered
 *          ctx[APP_INIT] = true;
 *
 *
 *          //detect locale settings of the browser
 *          let list = this.get('accept-language');
 *          if(list) {
 *            list = list.split(',').map((l) => {
 *              return normalizeLocaleCode(l.split(';').shift());
 *            });
 *          } else {
 *            list = [];
 *          }
 *          if(list.length === 0) {
 *            list.push('en-US');
 *          }
 *          let locale = this.locale;
 *          if(!locale) {
 *            locale = list[0];
 *          }
 *          //set the detected locale settings to application context;
 *          ctx[LOCALE] = locale;
 *          ctx[ACCEPTLANG] = list;
 *
 *          //wraps routing in promise because it's asynchronous
 *          yield new Promise((resolve, reject) => {
 *            //console.time('generateRoutes');
 *            let routes = (
 *              <Route handler={new AppLoader(AppRoot, ctx)}>
 *                {driver::generateRoutes(driver.routeTable, ctx, '', path.join(driver.config.dirname, driver.config.appPath))}
 *                <NotFoundRoute handler={NotFound} />
 *              </Route>
 *            );
 *            //console.timeEnd('generateRoutes');
 *
 *            //console.time('createRouter');
 *            let r = Router.create({
 *              routes,
 *              location: this.req.url,
 *              onAbort: (redirect) => {
 *                if(typeof redirect === 'string') {
 *                  //aborted
 *                  this.redirect(driver.config.abortPath || '/');
 *                  resolve();
 *                }
 *                else if(redirect) {
 *                  this.redirect(redirect.to);
 *                  resolve();
 *                }
 *              },
 *              onError: (err) => {
 *                console.log(err, err.stack);
 *              }
 *            });
 *            //console.timeEnd('createRouter');
 *            //console.time('RouterRun');
 *            r.run(async (Root, state) => {
 *              //console.timeEnd('RouterRun');
 *
 *              //get document title from context
 *              try {
 *                let title;
 *                if(ctx.title.length > 0) {
 *                  title = ctx.title[ctx.title.length - 1](this.req.url);
 *                }
 *                if(title !== void 0) {
 *                  title = Tmpl.format(title, state.params);
 *                }
 *
 *
 *                //gather route table and dehydrate stores
 *                let data = {
 *                  table: driver.routeTable,
 *                  stores: [],
 *                  baseURL: driver.config.baseURL || '',
 *                  context: ctx[STATE]
 *                };
 *                ctx.stores.forEach(s => {
 *                  data.stores.push(s.dehydrate());
 *                });
 *
 *
 *                //render application to string
 *                let appHtml = React.renderToString(<Root />);
 *
 *                let cssPreloads = [];
 *                //console.time('traceCss');
 *                //trace files for imported css files
 *                for(let src of ctx.files) {
 *                  let preloads = await driver::traceCss(src);
 *                  cssPreloads.push(preloads.map(css => {
 *                    return <link rel="stylesheet" href={css} />;
 *                  }));
 *
 *                }
 *
 *                let Html = driver.config.htmlComponent || HtmlPage;
 *                let View = driver.config.viewportComponent || Viewport;
 *
 *
 *                let body = React.renderToStaticMarkup(<Html
 *                  scripts={[
 *                    driver::bootstrap('#viewport', data)
 *                  ]}
 *                  styles={cssPreloads}
 *                  body={<View
 *                    innerHTML={appHtml}
 *                  />}
 *                  title={title}
 *                />);
 *
 *                this.body = DOCTYPE + body;
 *                this.status = 200;
 *                this.type = 'text/html';
 *                resolve();
 *
 *              } catch (err) {
 *                reject(err);
 *              }
 *            });
 *
 *          });
 *
 *        }
 *      }
 *    }
 *
 *
 *
 *
 *
 *    async function traceCss(appPath) {
 *      let src = path.relative(this.config.root, appPath);
 *
 *      let css;
 *      if(!CssCache.has(src)) {
 *        //trace app for all module imports
 *        let builder = new Builder();
 *        await builder.loadConfig(this.config.jspm.config);
 *
 *
 *        var trace = await builder.trace(src);
 *
 *        let result = Object.keys(trace).filter((item) => {
 *          //filter imports to only css entries
 *          return /\.css/i.test(trace[item].address);
 *        }).map((item)=> {
 *          //normalize server-side address to client side relative address
 *          if(trace[item].address.indexOf(this.config.jspm.path) > -1) {
 *            return '/' + path.relative(path.dirname(this.config.jspm.path), trace[item].address.replace(/file:/i, '')).replace(/\\\\/g, '/');
 *          } else {
 *            item = item.split('!')[0].replace(this.config.buildPath, this.config.buildURL);
 *
 *            let ver =  this.config.version ? `?${ this.config.version }` : '';
 *            return `/${item}${ver}`;
 *          }
 *        });
 *
 *        CssCache.set(src, result);
 *        builder.reset();
 *
 *      }
 *      return CssCache.get(src);
 *    }
 *
 *    const _Underscore = /_/;
 *    function normalizeLocaleCode(code) {
 *      code = code.replace(_Underscore, '-');
 *      code = code.split('-');
 *      code[0] = code[0].toLowerCase();
 *      if(code.length > 1) {
 *        code[1] = code[1].toUpperCase();
 *      }
 *      return code.join('-');
 *    }
 */
