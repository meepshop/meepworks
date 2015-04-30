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
import Dispatcher from './dispatcher';
import { INIT_STORE, INIT } from './store-base';
import RouterStore from './stores/router-store';
import RouteTable from './stores/route-table';
import SetRoutes from './actions/set-routes';
import ExposeContext from './actions/expose-context';
import SetApproot from './actions/set-approot';
import DetectIntl from './actions/detect-intl';
import LocaleStore from './stores/locale-store';
import LoadLocales from './actions/load-locales';
import { LOCALE_CACHE as LC } from './locale';


const OK = Symbol();
const CSS_PRELOAD = Symbol();
const DOCTYPE = '<!DOCTYPE html>';


let _CssCache = {};

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
    driver.rootUrl = config.rootUrl || '/';
    driver.routeTable = {
      app: driver.config.appPath,
      title: App.title
    };

    //let glStore = LocaleStore.getInstance();
    //if(!glStore[INIT]) {
    //  glStore[INIT_STORE]();
    //  Dispatcher.getInstance().register(glStore);
    //}





    //server logic entry point
    driver.koa.use(function * (next) {

      var ctx = this;
      //create instance specific dispatcher and store set
      ctx.dispatcher = Dispatcher.getInstance(ctx);
      ctx.stores = new Set([RouterStore, RouteTable, LocaleStore]);

      //init router store
      let rStore = RouterStore.getInstance(ctx);
      rStore[INIT_STORE]();
      ctx.dispatcher.register(rStore);
      {
        let sa = new SetApproot(driver.rootUrl);
        sa.ctx = ctx;
        yield sa.exec();
      }

      //init route table store
      let rTable = RouteTable.getInstance(ctx);
      rTable[INIT_STORE]();
      ctx.dispatcher.register(rTable);


      let lStore = LocaleStore.getInstance(ctx);
      lStore[INIT_STORE]();
      ctx.dispatcher.register(lStore);

      //yields routing logic
      yield next;




      //application init is done, ready to render
      if(ctx[OK]) {

        {
          let di = new DetectIntl();
          di.ctx = ctx;
          yield di.exec();
        }
        {
          let ll = new LoadLocales();
          ll.ctx = ctx;
          yield ll.exec();
        }


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
        //this scans for css imports and loads them in html's head tag
        //which allows the server-side render result to be properly styled.
        //If this is not done, some styles will only appear after client applicaiton loads.
        let cssPreloads = [];
        if(ctx[CSS_PRELOAD]) {
          for(let css of ctx[CSS_PRELOAD]) {
            cssPreloads.push(<link rel="stylesheet" href={css} />);
          }
        }
        let jsVer = config.version ? `?${config.version}` : '';

        let transpilerRuntime;
        if(config.transpiler === 'traceur') {
          transpilerRuntime = [
            <script key="traceur-runtime" src={ `/${config.jspm.path}/traceur-runtime.js${jsVer}` }></script>
          ];
        } else {
          transpilerRuntime = [
            //<script key="babel-runtime" src={`/${config.jspm.path}/babel-polyfill.js${jsVer}`}></script>
          ];
        }

        let Html = driver.config.htmlComponent || HtmlPage;
        let View = driver.config.viewportComponent || Viewport;
        //generate html container
        let htmlOut = React.renderToStaticMarkup(<Html
          scripts={[
            transpilerRuntime,
            <script key="sys" src={ `/${config.jspm.path}/system.js${jsVer}` }></script>,
            <script key="config" src={ `/${config.jspm.config}${jsVer}` }></script>,
              cssPreloads,
            yield appLoader(config, '#viewport', data)
          ]}
          body={<View
            innerHTML={appString}
          />}
        />);

        ctx.body = DOCTYPE + htmlOut;
        ctx.status = 200;
        ctx.type = 'text/html';

        //demote stores and dispatcher from global status
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
    //driver.localeLoaded = new LoadLocales(glStore).exec();

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
          //expose the context
          //this helps to allow middlewares to pass information into the stores
          //for the root application
          {
            let ec = new ExposeContext(ctx);
            ec.ctx = ctx;
            yield ec.exec();
          }

          //set routing information
          {
            let sr = new SetRoutes({
            srcRoot: driver.config.distPath.external,
            routes: driver.routeTable
            });
            sr.ctx = ctx;
            yield sr.exec();
          }

          //trigger navigate action
          {
            let title = () => {
              let t = route.title || driver.app.title || '';
              if('function' === typeof t) {
                t = t();
              }
              return Tmpl.format(t);
            };
            let n = new Navigate({
            params: ctx.params,
            title,
            route: urlPath,
            url: ctx.req.url,
            components: compList
            });
            n.ctx = ctx;
            yield n.exec();
          }

          //exec parent Apps' initial actions & routeActions
          yield driver.execParentActions(parents, ctx);

          //exec ctx App's initial actions
          if(Array.isArray(App.initialActions)) {
            yield foreach(App.initialActions, function * (initialAction) {
              let ia = new initialAction.action(initialAction.payload);
              ia.ctx = ctx;
              yield ia.exec();
            });
          }

          if(Array.isArray(App.routeActions)) {
            yield foreach(App.routeActions, function * (routeAction) {
              let ra = new routeAction.action(routeAction.payload);
              ra.ctx = ctx;
              yield ra.exec();
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
          if(urlPath === '/') {
            urlPath = '';
          }
          this.bindRoutes(App.routes[p], urlPath + p, filePath, files, table.routes[p], parents.concat(App));
        }
      }
    } else {
      //if app is not defined, then use the current app
      let App = parents[parents.length - 1];
      if(App.component) {
        table.hasComponent = true;
      }
      //if component is defined
      if(App.component) {


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

          {
            let ec = new ExposeContext(ctx);
            ec.ctx = ctx;
            yield ec.exec();
          }
          //set routing information
          {
            let sr = new SetRoutes({
            srcRoot: driver.config.distPath.external,
            routes: driver.routeTable
            });
            sr.ctx = ctx;
            yield sr.exec();
          }

          //trigger navigate action
          {
            let title = () => {
              let t = route.title || driver.app.title || '';
              if('function' === typeof t) {
                t = t();
              }
              return Tmpl.format(t);
            };
            let n = new Navigate({
            params: ctx.params,
            title,
            route: urlPath,
            url: ctx.req.url,
            components: compList
            });
            n.ctx = ctx;
            yield n.exec();
          }

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
          let ia = new initialAction.action(initialAction.payload);
          ia.ctx = ctx;
          yield ia.exec();
        });
      }
      if(Array.isArray(Mod.routeActions)) {
        yield foreach(Mod.routeActions, function * (routeAction) {
          let ra = new routeAction.action(routeAction.payload);
          ra.ctx = ctx;
          yield ra.exec();
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

      _CssCache[src] = Object.keys(trace).filter((item) => {
        //filter imports to only css entries
        return /\.css/i.test(trace[item].address);
      }).map((item)=> {
        //normalize server-side address to client side relative address
        if(trace[item].address.indexOf(this.config.jspm.path) > -1) {
          return '/' + path.relative(path.dirname(this.config.jspm.path), trace[item].address.replace(/file:/i, '')).replace(/\\\\/g, '/');
        } else {
          let ver =  this.config.version ? `?${ this.config.version }` : '';
          return `/${item.split('!')[0]}${ver}`;
        }
      });

      builder.reset();

    }
    return _CssCache[src];
  }

}

