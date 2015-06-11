import Router, {Route, NotFoundRoute, DefaultRoute } from 'react-router';
import React from 'react';
import path from 'path';
import url from 'url';
import AppRoot from './app-root';
import AppLoader from './app-loader';
import NotFound from './components/not-found';
import AppContext, { APP_INIT } from './app-context';
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


      let ctx = new AppContext();
      ctx[APP_INIT] = true;


      yield new Promise((resolve, reject) => {
        let routes = (
          <Route handler={new AppLoader(AppRoot, ctx)}>
            {driver::generateRoutes(driver.routeTable, ctx)}
            <NotFoundRoute handler={NotFound} />
          </Route>
        )

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
        r.run((Root, state) => {

          let title = ctx.title[ctx.title.length - 1];
          if(title !== void 0) {
            title = Tmpl.format(title, state.params);
          }


          //gather route table and dehydrate stores
          let data = {
            table: driver.routeTable,
            stores: [],
            root: driver.config.root || ''
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

function generateRoutes(table, ctx, currentPath = '') {

  let children = [];
  if(table.routes) {
    for(let p in table.routes) {
      if(p === '$default') {
        children.push(
          <DefaultRoute key={p} handler={new AppLoader(table.routes[p].App, ctx, currentPath, this.config.root)}/>
        );
      } else if (p === '$notfound') {
        children.push(
          <NotFoundRoute key={p} handler={new AppLoader(table.routes[p].App, ctx, currentPath, this.config.root)} />
        );
      } else {
        children.push(this::generateRoutes(table.routes[p],  ctx, currentPath === '' ? p : `${currentPath}/${p}`));
      }
    }
  }
  return (
    <Route path={`/${currentPath}`} key={`/${currentPath}`} handler={new AppLoader(table.App, ctx, currentPath, this.config.root)}>
      {children}
    </Route>
  );

}

