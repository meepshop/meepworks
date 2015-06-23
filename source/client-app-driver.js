import Router, {Route, NotFoundRoute, DefaultRoute, HistoryLocation } from 'react-router';
import React from 'react';
import path from 'path';
import url from 'url';
import AppLoader from './app-loader';
import NotFound from './components/not-found';
import AppContext, { APP_INIT, STATE } from './app-context';
import Dispatcher from './dispatcher';
import Tmpl from './tmpl';
import Location from './location';
import AppRoot from './app-root';
import * as errors from './errors';


export default class AppDriver {
  constructor(src, target, dataId) {
    let driver = this;
    driver.target = document.querySelector(target);
    driver.appSrc = src;



    let dataScript = document.querySelector(`script[id="${dataId}"]`);
    let data = JSON.parse(atob(dataScript.innerHTML));

    driver.routeTable = driver::traceRoutes(data.table);


    let ctx = new AppContext();
    ctx[STATE] = data.context;
    driver.ctx = ctx;

    let routes = (
      <Route handler={new AppLoader(AppRoot, ctx)}>
        {generateRoutes(driver.routeTable, ctx, data.baseURL)}
        <NotFoundRoute handler={NotFound} />
      </Route>
    );

    let location = new Location(data.baseURL);

    let r = Router.create({
      routes,
      location,
      onError: (err) => {
        ctx.emit('error', err);
      }
    });
    r.run((Root, state) => {
        //rehydrate stores
        if(ctx[APP_INIT]) {
          let title = ctx.title[ctx.title.length - 1];
          if(title !== void 0) {
            title = Tmpl.format(title, state.params);
            document.title = title;
          }
        } else {
          ctx.stores.forEach(s => {
            s.rehydrate(data.stores.shift());
          });
          ctx[APP_INIT] = true;
        }
        React.render(<Root />, driver.target);
     });


  }

}

function traceRoutes(table, src) {
  if(!src) {
    src = this.appSrc;
  }
  table.appPath = src;

  if(table.routes) {
    for(let p in table.routes) {
      this::traceRoutes(table.routes[p], url.resolve(src, table.routes[p].appPath));
    }
  }
  return table;
}

function generateRoutes(table, ctx, baseURL = '', currentPath = '') {

  let children = [];
  if(table.routes) {
    for(let p in table.routes) {
      if(p === '$default') {
        children.push(
          <DefaultRoute key={p} handler={new AppLoader(table.routes[p].appPath, ctx, currentPath, baseURL)}/>
        );
      } else if (p === '$notfound') {
        children.push(
          <NotFoundRoute key={p} handler={new AppLoader(table.routes[p].appPath, ctx, currentPath, baseURL)} />
        );
      } else {
        children.push(this::generateRoutes(table.routes[p],  ctx, baseURL, currentPath === '' ? p : `${currentPath}/${p}`));
      }
    }
  }
  return (
    <Route path={`/${currentPath}`} key={`/${currentPath}`} handler={new AppLoader(table.appPath, ctx, currentPath, baseURL)}>
      {children}
    </Route>
  );

}
