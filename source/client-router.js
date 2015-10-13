import React from 'react';
import ReactDOM from 'react-dom';
import Router, { match } from 'react-router';
import Tmpl from './tmpl';
import transit from 'transit-immutable-js';

import createBrowserHistory from 'history/lib/createBrowserHistory';


import ApplicationContext from './application-context';



const rAm = /&amp;/g;
const rLt = /&lt;/g;
const rGt = /&gt;/g;
const rAp = /&#39;/g;
const rQu = /&quot;/g;

function unescapeHTML(str) {
  return str
  .replace(rLt, '<')
  .replace(rGt, '>')
  .replace(rAp, "'")
  .replace(rQu, '"')
  .replace(rAm, '&');
}

export default class ClientRouter {
  constructor(appURL, dataId) {
    (async () => {
      let App = await System.import(appURL);
      let dataScript = document.querySelector(`script[id="${dataId}"]`);

      let data = transit.fromJSON(unescapeHTML(dataScript.innerHTML));
      let ctx = new ApplicationContext(data);

      let routes = new App(ctx).routes;

      match({ routes, location: window.location }, (error, redirectLocation, renderProps) => {
        ReactDOM.render(
          <Router
            routes={routes}
            history={createBrowserHistory()}
            onError={(err) => {
              ctx.emit('error', err);
            }}
            onUpdate={function () {
              let title = ctx.title;
              if(title) {
                title = Tmpl.format(title, this.state.params);
                document.title = title;
              }
              ctx.init = true;
            }}
          />
        , document.getElementById('viewport'));
      });

        /*
         *ReactDOM.render(
         *  <Router
         *    routes={routes}
         *    history={createBrowserHistory()}
         *    onError={(err) => {
         *      ctx.emit('error', err);
         *    }}
         *    onUpdate={function () {
         *      let title = ctx.title;
         *      if(title) {
         *        title = Tmpl.format(title, this.state.params);
         *        document.title = title;
         *      }
         *      ctx.init = true;
         *    }}
         *  />
         *, document.getElementById('viewport'));
         */

    })();
  }
}

/*
 *
 *export default class AppDriver {
 *  constructor(src, target, dataId) {
 *
 *
 *    let ctx = new AppContext();
 *    ctx[STATE] = data.context;
 *    driver.ctx = ctx;
 *
 *    let routes = (
 *      <Route handler={new AppLoader(AppRoot, ctx)}>
 *        {generateRoutes(driver.routeTable, ctx, data.baseURL)}
 *        <NotFoundRoute handler={NotFound} />
 *      </Route>
 *    );
 *
 *    let location = new Location(data.baseURL);
 *
 *    let r = Router.create({
 *      routes,
 *      location,
 *      onError: (err) => {
 *        debugger;
 *        ctx.emit('error', err);
 *      }
 *    });
 *    r.run((Root, state) => {
 *        //rehydrate stores
 *        if(ctx[APP_INIT]) {
 *          let title;
 *          if(ctx.title.length > 0) {
 *            title = ctx.title[ctx.title.length - 1](location.getCurrentPath());
 *          }
 *          if(title !== void 0) {
 *            title = Tmpl.format(title, state.params);
 *            document.title = title;
 *          }
 *        } else {
 *          ctx.stores.forEach(s => {
 *            s.rehydrate(data.stores.shift());
 *          });
 *          ctx[APP_INIT] = true;
 *        }
 *        React.render(<Root />, driver.target);
 *     });
 *
 *
 *  }
 *
 *}
 *
 *function traceRoutes(table, src) {
 *  if(!src) {
 *    src = this.appSrc;
 *  }
 *  table.appPath = src;
 *
 *  if(table.routes) {
 *    for(let p in table.routes) {
 *      if(table.routes[p].appPath) {
 *        this::traceRoutes(table.routes[p], url.resolve(src, table.routes[p].appPath));
 *      }
 *    }
 *  }
 *  return table;
 *}
 *
 *function generateRoutes(table, ctx, baseURL = '', currentPath = '') {
 *
 *  let children = [];
 *  if(table.routes) {
 *    for(let p in table.routes) {
 *      let handler = table.routes[p].appPath ?
 *        new AppLoader(
 *          table.routes[p].appPath,
 *          ctx,
 *          currentPath,
 *          baseURL
 *        ) :
 *        NullApp;
 *      if(p === '$default') {
 *        children.push(
 *          <DefaultRoute key={p} handler={handler}/>
 *        );
 *      } else if (p === '$notfound') {
 *        children.push(
 *          <NotFoundRoute key={p} handler={handler} />
 *        );
 *      } else {
 *        children.push(
 *          this::generateRoutes(
 *            table.routes[p],
 *            ctx,
 *            baseURL,
 *            currentPath === '' ? p : `${currentPath}/${p}`
 *          )
 *        );
 *      }
 *    }
 *  }
 *  let handler = table.appPath ?
 *    new AppLoader(table.appPath, ctx, currentPath, baseURL) :
 *    NullApp;
 *  return (
 *    <Route path={`/${currentPath}`} key={`/${currentPath}`} handler={handler}>
 *      {children}
 *    </Route>
 *  );
 *
 *}
 *
 */
