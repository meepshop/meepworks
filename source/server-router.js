import React from 'react';
import Emitter from 'component-emitter';
import createLocation from 'history/lib/createLocation';
import { RoutingContext, match } from 'react-router';
import { renderToStaticMarkup } from 'react-dom/server';
import path from 'path';
import HtmlPage from './html-page';

const doctype = '<!DOCTYPE html>';


export default class ServerRouter {
  constructor({
    app,
    //jspm_path = 'jspm_packages',
    //jspm_config = 'jspm_config.js',
    dirname,
    //root,
    //buildPath,
    //buildURL,
    //abortPath = '/',
    //baseURL = '',
    meepdev = false
  }) {
    this.app = app;
    this.dirname = dirname;



  }
  get routes() {
    let router = this;
    let App = require(path.resolve( router.dirname, router.app ));

    return function * (next) {

      let location = createLocation(this.req.url);

      let ctx;

      match({ routes: new App(ctx).routes, location }, (error, redirectLocation, renderProps) => {
        if(redirectLocation) {
          this.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if(error) {
          this.status = 500;
          console.log(err.stack);
        }

        if(renderProps) {
          try {
            this.body = doctype + renderToStaticMarkup(
              <HtmlPage>
                <RoutingContext {...renderProps} />
              </HtmlPage>
            );
          } catch(err) {
            this.status = 500;
            console.log('@renderError', err.stack);
          }
        }

      });
    };
  }
}

/*****************************
 * react-router example
 *****************************
 *
 *      import createLocation from 'history/lib/createLocation'
 *      import { RoutingContext, match } from 'react-router'
 *      import routes from './routes'
 *      import { renderToString } from 'react-dom/server'
 *
 *      serve((req, res) => {
 *        let location = createLocation(req.url)
 *
 *        match({ routes, location }, (error, redirectLocation, renderProps) => {
 *          if (redirectLocation)
 *            res.redirect(301, redirectLocation.pathname + redirectLocation.search)
 *          else if (error)
 *            res.send(500, error.message)
 *          else if (renderProps == null)
 *            res.send(404, 'Not found')
 *          else
 *            res.send(renderToString(<RoutingContext {...renderProps}/>))
 *        })
 *      })
 */



/*
 *    import Router, {Route, NotFoundRoute, DefaultRoute } from 'react-router';
 *    import React from 'react';
 *    import path from 'path';
 *    import url from 'url';
 *    import AppRoot from './app-root';
 *    import AppLoader from './app-loader';
 *    import NotFound from './components/not-found';
 *    import AppContext, { APP_INIT, STATE } from './app-context';
 *    import Dispatcher from './dispatcher';
 *    import Tmpl from './tmpl';
 *    import HtmlPage from './components/html-page';
 *    import Viewport from './components/viewport';
 *    import bootstrap from './bootstrap';
 *    import Builder from 'systemjs-builder';
 *    import { LOCALE, ACCEPTLANG } from './locale';
 *    import * as errors from './errors';
 *    import NullApp from './extend.jscomponents/null-app';
 *
 *
 *    const DOCTYPE = '<!DOCTYPE html>';
 *
 *    const CssCache = new Map();
 *
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
 *    async function traceRoutes(table, appPath) {
 *      if(appPath !== void 0) {
 *        let App = require(appPath);
 *        let routes = App.routes;
 *
 *        //pre trace the css files imported in apps
 *        await this::traceCss(appPath);
 *
 *        table.App = App;
 *        table.routes = routes;
 *
 *        for(let p in routes) {
 *          if(routes[p].appPath) {
 *            await this::traceRoutes(routes[p], path.join(path.dirname(appPath), routes[p].appPath));
 *          }
 *        }
 *      }
 *      return table;
 *    }
 *
 *    function generateRoutes(table, ctx, currentPath, appPath) {
 *
 *      let children = [];
 *      if(table.routes) {
 *        for(let p in table.routes) {
 *          let handler = table.routes[p].App ?
 *            new AppLoader(
 *              table.routes[p].App,
 *              ctx,
 *              currentPath,
 *              this.config.baseURL,
 *              path.join(
 *                path.dirname(appPath),
 *                table.routes[p].appPath
 *              )
 *            ) :
 *            NullApp;
 *          if(p === '$default') {
 *            children.push(
 *              <DefaultRoute
 *                key={p}
 *                handler={ handler }/>
 *            );
 *          } else if (p === '$notfound') {
 *            children.push(
 *              <NotFoundRoute
 *                key={p}
 *                handler={ handler } />
 *            );
 *          } else {
 *            children.push(
 *              this::generateRoutes(
 *                table.routes[p],
 *                ctx,
 *                currentPath === '' ? p : `${currentPath}/${p}`,
 *                table.routes[p].appPath != null && path.join(path.dirname(appPath), table.routes[p].appPath)
 *              )
 *            );
 *          }
 *        }
 *      }
 *      let handler = table.App ?
 *        new AppLoader(
 *          table.App,
 *          ctx,
 *          currentPath,
 *          this.config.baseURL,
 *          appPath
 *        ) :
 *        NullApp;
 *      return (
 *        <Route path={`/${currentPath}`} key={`/${currentPath}`} handler={handler}>
 *          {children}
 *        </Route>
 *      );
 *
 *    }
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
 *    const UNDERSCORE = /_/;
 *    function normalizeLocaleCode(code) {
 *      code = code.replace(UNDERSCORE, '-');
 *      code = code.split('-');
 *      code[0] = code[0].toLowerCase();
 *      if(code.length > 1) {
 *        code[1] = code[1].toUpperCase();
 *      }
 *      return code.join('-');
 *    }
 */
