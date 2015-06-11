import Router, {Route, NotFoundRoute, DefaultRoute, HistoryLocation } from 'react-router';
import React from 'react';
import path from 'path';
import url from 'url';
import AppLoader from './app-loader';
import NotFound from './components/not-found';
import AppContext, { APP_INIT } from './app-context';
import Dispatcher from './dispatcher';
import Tmpl from './tmpl';
import Location from './location';
import AppRoot from './app-root';


export default class AppDriver {
  constructor(src, target, dataId) {
    let driver = this;
    driver.target = target;
    driver.appSrc = src;



    let dataScript = document.querySelector(`script[id="${dataId}"]`);
    let data = JSON.parse(dataScript.innerHTML);

    driver.routeTable = driver::traceRoutes(data.table);


    let ctx = new AppContext();
    driver.ctx = ctx;

    let routes = (
      <Route handler={new AppLoader(AppRoot, ctx)}>
        {generateRoutes(driver.routeTable, ctx, data.root)}
        <NotFoundRoute handler={NotFound} />
      </Route>
    );

    let r = Router.create({
      routes,
      location: new Location(data.root),
      onAbort: (redirect) => {
        if(typeof redirect === 'string') {
          //aborted
          resolve();
        }
        else if(redirect) {
          resolve();
        }
      },
      onError: (err) => {
        console.log('err', err, err.stack);
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
        React.render(<Root />, document.querySelector(driver.target));



    //      let appHtml = React.renderToString(<Root />);

    //      let Html = driver.config.htmlComponent || HtmlPage;
    //      let View = driver.config.viewportComponent || Viewport;


    //      let body = React.renderToStaticMarkup(<Html
    //        scripts={[
    //            driver::bootstrap('#viewport', data)
    //        ]}
    //        body={<View
    //          innerHTML={appHtml}
    //        />}
    //        title={title}
    //      />);

    //      this.body = DOCTYPE + body;
    //      this.status = 200;
    //      this.type = 'text/html';
    //      resolve();
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

function generateRoutes(table, ctx, root = '', currentPath = '') {

  console.log('root: ', root, 'currentPath: ', currentPath);
  let children = [];
  if(table.routes) {
    for(let p in table.routes) {
      if(p === '$default') {
        children.push(
          <DefaultRoute key={p} handler={new AppLoader(table.routes[p].appPath, ctx, currentPath, root)}/>
        );
      } else if (p === '$notfound') {
        children.push(
          <NotFoundRoute key={p} handler={new AppLoader(table.routes[p].appPath, ctx, currentPath, root)} />
        );
      } else {
        children.push(this::generateRoutes(table.routes[p],  ctx, root, currentPath === '' ? p : `${currentPath}/${p}`));
      }
    }
  }
  return (
    <Route path={`/${currentPath}`} key={`/${currentPath}`} handler={new AppLoader(table.appPath, ctx, currentPath, root)}>
      {children}
    </Route>
  );

}
