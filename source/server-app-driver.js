import Router, {Route, NotFoundRoute, DefaultRoute } from 'react-router';
import React from 'react';
import path from 'path';
import url from 'url';
import AppLoader from './app-loader';
import DefaultNotFoundHandler from './components/default-not-found-handler';
import AppContext from './app-context';
import Dispatcher from './dispatcher';



export default class AppDriver {
  constructor(config) {
    let appPath = path.resolve(config.dirname, config.appPath);
    this.config = config;
    this.routeTable = this::traceRoutes({
      appPath: config.appPath
    }, appPath);
    console.log('@', JSON.stringify(this.routeTable, null, 2));
  }
  get router() {

    let driver = this;


    return function * (next) {


      let ctx = new AppContext();


      //init stores
      //
      //
      yield new Promise((resolve, reject) => {
        let routes = (
          <Route>
            {driver::generateRoutes(driver.routeTable, ctx)}
            <NotFoundRoute handler={DefaultNotFoundHandler} />
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
            console.log('err', err);
          }
        });
        r.run((Root, state) => {

          this.body = React.renderToString(<Root />);
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

function generateRoutes(table, ctx) {

  let children = [];
  if(table.routes) {
    for(let p in table.routes) {
      if(p === '$default') {
        children.push(
          <DefaultRoute key={p} handler={new AppLoader(table.routes[p].App, ctx)}/>
        );
      } else if (p === '$notfound') {
        children.push(
          <NotFoundRoute key={p} handler={new AppLoader(table.routes[p].App, ctx)} />
        );
      } else {
        children.push(
          <Route name={p} key={p}>
            {this::generateRoutes(table.routes[p],  ctx)}
          </Route>
        );
      }
    }
  }
  return (
    <Route handler={new AppLoader(table.App, ctx)}>
      {children}
    </Route>
  );

}
