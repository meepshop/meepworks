import React from 'react';
import page from 'page';
import co from 'co';
import debug from 'debug';
import Dispatcher from './dispatcher';
import RouterStore from './stores/router-store';
import RouteTable from './stores/route-table';
import Navigate from './actions/navigate';
import SetApproot from './actions/set-approot';
import { INIT_STORE, INIT } from './store-base';
import {LOCALE_CACHE as LC} from './locale';
import LocaleStore from './stores/locale-store';
import DetectIntl from './actions/detect-intl';
import DetectBrowserLanguage from './actions/detect-browser-language';
import LoadLocales from './actions/load-locales';

import url from 'url';

import foreach from 'greasebox/co-foreach';
import Tmpl from './tmpl';

const INIT_APP = Symbol();

export default class StandAloneDriver {
  constructor(src, appRoot = '', srcRoot = '/') {
    let driver = this;

    driver.dispatcher = Dispatcher.getInstance();
    driver.appSrc = src;
    if(appRoot[appRoot.length - 1] === '/') {
      appRoot = appRoot.substr(0, appRoot.length - 1);
    }
    driver.appRoot = appRoot;

    //get App
    co(function * () {
      let App = (yield System.import(src));
      driver.app = App;

      let rStore = RouterStore.getInstance();
      rStore[INIT_STORE]();
      driver.dispatcher.register(rStore);
      yield new SetApproot(appRoot).exec();

      let lStore = LocaleStore.getInstance();
      lStore[INIT_STORE]();
      driver.dispatcher.register(lStore);

      driver.srcRoot = srcRoot;
      yield driver.bindRoutes({
        app: driver.app,
        title: App.title
      }, '/');

      yield new DetectBrowserLanguage().exec();

      yield new DetectIntl().exec();
      yield new LoadLocales({
        lStore,
        LC
      }).exec();

      page();
    });
  }
  init() {
    this[INIT_APP] = true;
    let RootComponent = RouterStore.rootComponent;
    React.render(<RootComponent />, document.body);
  }
  *bindRoutes(route, urlPath, fileUrl, parents = []) {

    let driver = this;


    if(route.app) {
      if(!fileUrl) {
        fileUrl = driver.appSrc;
      }
      //import app if there's only the reference path
      if(typeof route.app === 'string') {
        fileUrl = url.resolve(fileUrl, route.app);
        route.app = yield System.import(fileUrl);
      }

      //if app has component and current urlPath is not defined under app's routes
      if(route.app.component && !(route.app.routes && route.app.routes[urlPath])) {

        urlPath = driver.appRoot + urlPath;
        page(urlPath, co.wrap(function * (ctx) {
          //if routed path is already the current path, do nothing
          if(driver[INIT_APP] && ctx.path === RouterStore.url) {
            return;
          }
          let compList = [];

          //check parents
          yield foreach(parents, function * (p) {

            if(p.component) {
              compList.push(p.component);
            }
            //initializes the stores used if they are not initialized.
            if(Array.isArray(p.stores)) {
              p.stores.forEach((s) => {
                let tmp = s.getInstance();
                if(!tmp[INIT]) {
                  tmp[INIT_STORE]();
                  driver.dispatcher.register(tmp);
                }
              });
            }
          });
          //check self
          if(route.app.component) {
            compList.push(route.app.component);
          }
          if(Array.isArray(route.app.stores)) {
            route.app.stores.forEach((s) => {
              let tmp  = s.getInstance();
              if(!tmp[INIT]) {
                tmp[INIT_STORE]();
                driver.dispatcher.register(tmp);
              }
            });
          }
          //module loaded

          //trigger navigate action, if not the first load
          let title = Tmpl.format(route.title, ctx.params) || route.app.name || '';
          yield new Navigate({
            params: ctx.params,
            title: title,
            route: urlPath,
            url: ctx.path,
            components: compList
          }).exec();
          if(typeof document !== 'undefined') {
            document.title = title;
          }

          //run actions
          yield foreach(parents, function * (p) {
            if(!p[INIT_APP]) {
              if(Array.isArray(p.initialActions)) {
                yield foreach(p.initialActions, (initialAction) => {
                  return new initialAction.action(initialAction.payload).exec();
                });

              }
              p[INIT_APP] = true;
            }
            if(Array.isArray(p.routeActions)) {
              yield foreach(p.routeActions, (routeAction) => {
                return new routeAction.action(routeAction.payload).exec();
              });
            }

          });

          if(!route.app[INIT_APP]) {
            if(Array.isArray(route.app.initialActions)) {
              yield foreach(route.app.initialActions, (initialAction) => {
                return new initialAction.action(initialAction.payload).exec();
              });
            }
            route.app[INIT_APP] = true;
          }

          if(Array.isArray(route.app.routeActions)) {
            yield foreach(route.app.routeActions, (routeAction) => {
              return new routeAction.action(routeAction.payload).exec();
            });

          }

          if (!driver[INIT_APP]) {
            //starts the application
            driver.init();
          }

        }));

      }
      if(route.app.routes) {
        for( let p in route.app.routes) {
          yield this.bindRoutes(route.app.routes[p], p, fileUrl, parents.concat(route.app));
        }
      }
    } else {

        urlPath = driver.appRoot + urlPath;
        page(urlPath, co.wrap(function * (ctx) {
          if(driver[INIT_APP] && ctx.path === RouterStore.getInstance().getUrl()) {
            return;
          }

          let compList = [];
          //check parents
          yield foreach(parents, function * (p) {
            if(p.component) {
              compList.push(p.component);
            }
            if(Array.isArray(p.stores)) {
              p.stores.forEach((s) => {
                let tmp = s.getInstance();
                if(!tmp[INIT]) {
                  tmp[INIT_STORE]();
                  driver.dispatcher.register(tmp);
                }
              });
            }

          });

          //trigger navigate action
          let title = Tmpl.format(route.title, ctx.params) || '';
          yield new Navigate({
            params: ctx.params,
            title: title,
            route: urlPath,
            url: ctx.path,
            components: compList
          }).exec();
          if(typeof document !== 'undefined') {
            document.title = title;
          }

          //run actions
          yield foreach(parents, function * (p) {
            if(!p[INIT_APP]) {
              if(Array.isArray(p.initialActions)) {
                yield foreach(p.initialActions, (initialAction) => {
                  return new initialAction.action(initialAction.payload).exec();
                });

              }
              p[INIT_APP] = true;
            }
            if(Array.isArray(p.routeActions)) {
              yield foreach(p.routeActions, (routeAction) => {
                return new routeAction.action(routeAction.payload).exec();
              });
            }

          });

          if(!driver[INIT_APP]) {
            driver.init();
          }

        }));
    }

  }
}
