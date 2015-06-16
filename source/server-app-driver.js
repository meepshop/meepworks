import Router, {Route, NotFoundRoute, DefaultRoute } from 'react-router';
import React from 'react';
import path from 'path';
import url from 'url';
import AppRoot from './app-root';
import AppLoader from './app-loader';
import NotFound from './components/not-found';
import AppContext, { APP_INIT, STATE } from './app-context';
import Dispatcher from './dispatcher';
import Tmpl from './tmpl';
import HtmlPage from './components/html-page';
import Viewport from './components/viewport';
import bootstrap from './bootstrap';

const DOCTYPE = '<!DOCTYPE html>';

export default class AppDriver {
  constructor(config) {
    let appPath = path.resolve(config.dirname, config.appPath);
    this.config = config;
    this.routeTable = this::traceRoutes({
      appPath: config.appPath
    }, appPath);
  }
  get router() {

    let driver = this;


    return function * (next) {


      let ctx = new AppContext(this);
      ctx[APP_INIT] = true;


      yield new Promise((resolve, reject) => {
        console.time('generateRoutes');
        let routes = (
          <Route handler={new AppLoader(AppRoot, ctx)}>
            {driver::generateRoutes(driver.routeTable, ctx, '', path.resolve(driver.config.dirname, driver.config.appPath))}
            <NotFoundRoute handler={NotFound} />
          </Route>
        );
        console.timeEnd('generateRoutes');

        console.time('createRouter');
        let r = Router.create({
          routes,
          location: this.req.url,
          onAbort: (redirect) => {
            if(typeof redirect === 'string') {
              //aborted
              this.redirect(driver.config.abortPath || '/');
              resolve();
            }
            else if(redirect) {
              this.redirect(redirect.to);
              resolve();
            }
          },
          onError: (err) => {
            console.log('err', err, err.stack);
          }
        });
        console.timeEnd('createRouter');
        console.time('RouterRun');
        r.run((Root, state) => {
          console.timeEnd('RouterRun');
          let title = ctx.title[ctx.title.length - 1];
          if(title !== void 0) {
            title = Tmpl.format(title, state.params);
          }


          //gather route table and dehydrate stores
          let data = {
            table: driver.routeTable,
            stores: [],
            root: driver.config.root || '',
            context: ctx[STATE]
          };
          ctx.stores.forEach(s => {
            data.stores.push(s.dehydrate());
          });



          let appHtml = React.renderToString(<Root />);

          let Html = driver.config.htmlComponent || HtmlPage;
          let View = driver.config.viewportComponent || Viewport;


          let body = React.renderToStaticMarkup(<Html
            scripts={[
                driver::bootstrap('#viewport', data)
            ]}
            body={<View
              innerHTML={appHtml}
            />}
            title={title}
          />);

          this.body = DOCTYPE + body;
          this.status = 200;
          this.type = 'text/html';
          resolve();
        });

      });

    }
  }
}



function traceRoutes(table, appPath) {
  let App = require(appPath);
  let routes = App.routes;

  table.App = App;
  table.routes = routes;

  for(let p in routes) {
    if(routes[p].appPath) {
      this::traceRoutes(routes[p], path.resolve(path.dirname(appPath), routes[p].appPath));
    }
  }
  return table;
}

function generateRoutes(table, ctx, currentPath, appPath) {

  let children = [];
  if(table.routes) {
    for(let p in table.routes) {
      if(p === '$default') {
        children.push(
          <DefaultRoute
            key={p}
            handler={ new AppLoader(
              table.routes[p].App,
              ctx,
              currentPath,
              this.config.root,
              path.resolve(path.dirname(appPath, table.routes[p].appPath))
            )}/>
        );
      } else if (p === '$notfound') {
        children.push(
          <NotFoundRoute
            key={p}
            handler={ new AppLoader(
              table.routes[p].App,
              ctx,
              currentPath,
              this.config.root,
              this.config.dirname,
              path.resolve(path.dirname(appPath, table.routes[p].appPath))
            )} />
        );
      } else {
        children.push(
          this::generateRoutes(
            table.routes[p],
            ctx,
            currentPath === '' ? p : `${currentPath}/${p}`,
            path.resolve(path.dirname(appPath, table.routes[p].appPath))
          )
        );
      }
    }
  }
  return (
    <Route path={`/${currentPath}`} key={`/${currentPath}`} handler={new AppLoader(table.App, ctx, currentPath, this.config.root, appPath)}>
      {children}
    </Route>
  );

}

