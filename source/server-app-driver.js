import koa from 'koa';
import router from 'koa-router';

import React from 'react';
import HtmlPage from './components/html-page';
import Viewport from './components/viewport';


import Builder from 'systemjs-builder';
import path from 'path';
import url from 'url';
import foreach from 'greasebox/co-foreach';
import map from 'greasebox/co-map';
import Tmpl from './tmpl';

import appLoader from './app-loader';
import {PROMOTE, DEMOTE} from './instance';
import Navigate from './actions/navigate';
import {SET_KEY} from './action-base';
import Dispatcher from './dispatcher';
import { INIT_STORE, INIT } from './store-base';
import RouterStore from './stores/router-store';
import RouteTable from './stores/route-table';
import SetRoutes from './actions/set-routes';
import ExposeContext from './actions/expose-context';


import debug from 'debug';

var log = debug('app-driver');
var bindLog = debug('bind-url');

const OK = Symbol();
const CSS_PRELOAD = Symbol();
let _CssCache = {};
const DOCTYPE = '<!DOCTYPE html>';

/**
 * @exports default
 * @class AppDriver
 *  Wraps around koa and router as an application driver.
 */
export default class AppDriver {
  /**
   * @constructor
   * @param {Object} App - The application manifest object.
   * @param {String} appPath - The relative path to the ClientApp
   *  from the server's position.
   */
  constructor(App, config) {
    var driver = this;
    driver.koa = new koa();
    driver.app = App;
    driver.config = config;
    driver.routeTable = {
      app: driver.config.appPath,
      title: App.title
    };
    //triggers for all requests
    driver.koa.use(function * (next) {
      var ctx = this;
      //create request specific dispatcher and stores
      //let dispatcher = Dispatcher.getInstance(ctx);
      //let stores = [];

      //create instance specific dispatcher and store set
      ctx.dispatcher = Dispatcher.getInstance(ctx);
      ctx.stores = new Set([RouterStore, RouteTable]);

      //init router store
      let rStore = RouterStore.getInstance(ctx);
      rStore[INIT_STORE]();
      ctx.dispatcher.register(rStore);

      //init route table store
      let rTable = RouteTable.getInstance(ctx);
      rTable[INIT_STORE]();
      ctx.dispatcher.register(rTable);


      //yields routing logic
      yield next;

      if(ctx[OK]) {
        //promote dispatcher and stores
        ctx.dispatcher[PROMOTE]();
        let stores = [];
        ctx.stores.forEach((s) => {
          let tmp = s.getInstance(ctx);
          tmp[PROMOTE]();
          stores.push(tmp);
        });

        //render app to string
        let RootComponent = RouterStore.getInstance(ctx).getRootComponent();
        let appString = React.renderToString(<RootComponent />);

        //dehydrate stores
        let data = stores.map((s) =>  {
          return s.dehydrate();
        });

        //generate css preload list
        let cssPreloads = [];
        if(ctx[CSS_PRELOAD]) {
          for(let css of ctx[CSS_PRELOAD]) {
            cssPreloads.push(<link rel="stylesheet" href={css} />);
          }
        }

        let transpilerRuntime;
        if(config.transpiler === 'traceur') {
          transpilerRuntime = [
            <script key="traceur-runtime" src={ `/${config.jspm.path}/traceur-runtime.js` }></script>
          ];
        } else {
          transpilerRuntime = [
            <script key="babel-runtime" src={`/${config.jspm.path}/babel-polyfill.js`}></script>
          ];
        }
        //generate html container
        let htmlOut = React.renderToStaticMarkup(<HtmlPage
          scripts={[
            transpilerRuntime,
            <script key="sys" src={ `/${config.jspm.path}/system.js` }></script>,
            <script key="config" src={ `/${config.jspm.config}` }></script>,
            cssPreloads,
            yield appLoader(config, '#viewport', data)
          ]}
          body={<Viewport
            innerHTML={appString}
          />}
        />);

        ctx.body = DOCTYPE + htmlOut;
        ctx.status = 200;
        ctx.type = 'text/html';
        stores.forEach((s) => {
          s[DEMOTE]();
        });
        ctx.dispatcher[DEMOTE]();
      }

    });

    //add routing to the driver
    driver.koa.use(router(driver.koa));


    //start binding routes
    driver.bindRoutes(driver.routeTable, '/');

    //return the actual koa instance instead of this AppDriver instance
    return driver.koa;
  }
  /**
   * @function
   * @param {Object} route - route description
   * @param {String} urlPath - current url path path
   * @param {String} filePath - canonical server side file path of the module
   * @param {Array<String>} files - list of client side paths to all the parent module paths
   * @param {Array<Object>} parents - array of parent app manifests
   *    Bind all the routing logic to the application driver.
   */
  bindRoutes(route, urlPath, filePath, files, table, parents = []) {
    bindLog('route: ', route);
    let driver = this;

    if(!table) {
      table = route;
    }

    if(route.app) {
      let App = route.app;

      if(!filePath) {
        //assume appPath for root application
        filePath = path.resolve(this.config.fileRoot, this.config.appPath);
        App = require(filePath);
      }
      if(!files) {
        // traceCss uses url style path
        files = [this.config.distPath.internal + '/' + this.config.appPath];
      }

      if(typeof App === 'string') {
        //locate the App file path
        filePath = path.resolve(filePath, '..', App);

        let parentUrl = files[files.length - 1];
        files = files.concat(url.resolve(parentUrl, App));

        //Set app to the actual manifest
        App = require(filePath);
      }

      //client driver needs to know if App contains component before actually loading them.
      if(App.component) {
        table.hasComponent = true;
      }
      //if component is defined, and the urlPath is not delegated to child application
      if(App.component && !(App.routes&&App.routes[urlPath])) {

        bindLog(urlPath);

        this.koa.get(urlPath, function * (next) {
          var ctx = this;
          //populate components list
          let compList = [];
          parents.forEach((p) => {
            if(p.component) {
              compList.push(p.component);
            }
            //init stores
            if(Array.isArray(p.stores)) {
              p.stores.forEach((s) => {
                ctx.stores.add(s);
                let tmp = s.getInstance(ctx);
                if(!tmp[INIT]) {
                  tmp[INIT_STORE]();
                  ctx.dispatcher.register(tmp);
                }
              });
            }
          });
          compList.push(App.component);
          if(Array.isArray(App.stores)) {
              App.stores.forEach((s) => {
                ctx.stores.add(s);
                let tmp = s.getInstance(ctx);
                if(!tmp[INIT]) {
                  tmp[INIT_STORE]();
                  ctx.dispatcher.register(tmp);
                }
              });

          }

          yield new ExposeContext(ctx).exec(ctx);

          //set routing information
          yield new SetRoutes({
            srcRoot: driver.config.distPath.external,
            routes: driver.routeTable
          })[SET_KEY](ctx).exec();

          //trigger navigate action
          yield new Navigate({
            params: ctx.params,
            title: Tmpl.format(route.title, ctx.params) || route.app.name || '',
            route: urlPath,
            url: ctx.req.url,
            components: compList
          })[SET_KEY](ctx).exec();

          //exec parent Apps' initial actions & routeActions
          yield driver.execParentActions(parents, ctx);

          //exec ctx App's initial actions
          if(Array.isArray(App.initialActions)) {
            yield foreach(App.initialActions, (initialAction) => {
              return new initialAction.action(initialAction.payload)[SET_KEY](ctx).exec();
            });
          }

          //trace css
          ctx[CSS_PRELOAD] = new Set();

          (yield map(files, (f)=> {
            return driver.traceCss(f);
          })).forEach((list) => {
            list.forEach((css) => {
              ctx[CSS_PRELOAD].add(css);
            });
          });

          ctx[OK] = true;
        });
      }
      if(App.routes) {
        table.routes = App.routes;
        for( let p in App.routes) {
          this.bindRoutes(App.routes[p], p, filePath, files, table.routes[p], parents.concat(App));
        }
      }
    } else {
      //if app is not defined, then use the current app
      bindLog('check: ', route);
      let App = parents[parents.length - 1];
      bindLog(App);
      if(App.component) {
        table.hasComponent = true;
      }
      //if component is defined
      if(App.component) {

        bindLog(urlPath);

        this.koa.get(urlPath, function * (next) {
          var ctx = this;
          //populate components list
          let compList = [];
          parents.forEach((p) => {
            if(p.component) {
              compList.push(p.component);
            }
            //init stores
            if(Array.isArray(p.stores)) {
              p.stores.forEach((s) => {
                ctx.stores.add(s);
                let tmp = s.getInstance(ctx);
                if(!tmp[INIT]) {
                  tmp[INIT_STORE]();
                  ctx.dispatcher.register(tmp);
                }
              });
            }
          });

          yield new ExposeContext(ctx).exec(ctx);
          //set routing information
          yield new SetRoutes({
            srcRoot: driver.config.distPath.external,
            routes: driver.routeTable
          })[SET_KEY](ctx).exec();

          //trigger navigate action
          yield new Navigate({
            params: ctx.params,
            title: Tmpl.format(route.title, ctx.params) || '',
            route: urlPath,
            url: ctx.req.url,
            components: compList
          })[SET_KEY](ctx).exec();

          //exec parent Apps' initial actions
          yield driver.execParentActions(parents, ctx);

          //trace css
          ctx[CSS_PRELOAD] = new Set();

          (yield map(files, (f)=> {
            return driver.traceCss(f);
          })).forEach((list) => {
            list.forEach((css) => {
              ctx[CSS_PRELOAD].add(css);
            });
          });

          ctx[OK] = true;
        });
      }
    }
  }
  *execParentActions(parents, ctx) {
    yield foreach(parents, function * (Mod) {
      if(Array.isArray(Mod.initialActions)) {
        yield foreach(Mod.initialActions, function * (initialAction) {
          yield new initialAction.action(initialAction.payload)[SET_KEY](ctx).exec();
        });
      }
      if(Array.isArray(Mod.routeActions)) {
        yield foreach(Mod.routeActions, function * (routeAction) {
          yield new routeAction.action(routeAction.payload)[SET_KEY](ctx).exec();
        });
      }
    });

  }
  *traceCss(src, jspm) {
    var css;
    if(!_CssCache[src]) {
      //trace app for all module imports
      let builder = new Builder();
      yield builder.loadConfig(this.config.jspm.config);


      var trace = yield builder.trace(src);

      _CssCache[src] = Object.keys(trace.tree).filter((item) => {
        //filter imports to only css entries
        return /\.css/i.test(trace.tree[item].address);
      }).map((item)=> {
        //normalize server-side address to client side relative address
        return '/' + path.relative(path.dirname(this.config.jspm.path), trace.tree[item].address.replace(/file:/i, '')).replace(/\\\\/g, '/');
      });
      builder.reset();

    }
    return _CssCache[src];
  }
}



function traceStores(App) {
  let res = new Set([RouterStore, RouteTable]);
  if(Array.isArray(App.stores)) {
    App.stores.forEach((s)=> {
      res.add(s);
    });
  }
  return res;
}
