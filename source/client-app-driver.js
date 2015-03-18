import React from 'react';
import page from 'page';
import co from 'co';
import debug from 'debug';
import Dispatcher from './dispatcher';
import RouterStore from './stores/router-store';
import RouteTable from './stores/route-table';
import Navigate from './actions/navigate';
import SetComponents from './actions/set-components';
import { INIT_STORE, INIT } from './store-base';
import DetectIntl from './actions/detect-intl';
import LocaleStore from './stores/locale-store';
import LoadLocales from './actions/load-locales';
import {LOCALE_CACHE as LC} from './locale';

import url from 'url';

import foreach from 'greasebox/co-foreach';
import Tmpl from './tmpl';

const log = debug('app-driver');

const INIT_APP = Symbol();


/**
 * @default
 * @class ClientAppDriver
 * Drives application routing logic on the client-side.
 */
export default class ClientAppDriver {
  /**
   * @constructor
   * @param {string} src - path to the application module.
   * @param {string} target - selector to the target
   *                          element to mount the application.
   * @param {string} dataId - string id for extracting initial states.
   */
  constructor (src, target, dataId) {
    log(`application src: ${src}`);
    log(`target element: ${target}`);
    log(`dataId: ${dataId}`);

    let driver = this;
    driver.target = target;
    driver.appPath = src;


    driver.dispatcher = Dispatcher.getInstance();

    //find data
    let dataScript = document.querySelector(`script[id="${dataId}"]`);
    driver.data = JSON.parse(dataScript.innerText);

    log(`data: ${JSON.stringify(driver.data, null, 2)}`);

    co(function * () {
      var App = (yield System.import(src));
      driver.app = App;
      log('App: ', App);

      //initialize routerStore
      let rStore = RouterStore.getInstance();
      rStore[INIT_STORE]();
      driver.dispatcher.register(rStore);
      rStore.rehydrate(driver.data.shift());
      driver.rootUrl = RouterStore.rootUrl;

      let rTable = RouteTable.getInstance();
      rTable[INIT_STORE]();
      driver.dispatcher.register(rTable);
      rTable.rehydrate(driver.data.shift());


      let lStore = LocaleStore.getInstance();
      lStore[INIT_STORE]();
      driver.dispatcher.register(lStore);
      driver.lStore = lStore;
      lStore.rehydrate(driver.data.shift());

      yield new DetectIntl().exec();
      yield new LoadLocales({
        lStore: driver.lStore,
        LC
      }).exec();

      //compose client routing logic and repopulate RouterStores's components list
      driver.srcRoot = RouteTable.getInstance().getSrcRoot();
      let routeTable = RouteTable.getInstance().getRoutes();

      driver.bindRoutes(routeTable, '/');

      //start page.js
      page();

    }).catch(log);
  }
  /**
   * @function
   *  Renders the application to the target element to start the client-side application logic.
   */
  init() {
    this[INIT_APP] = true;
    let RootComponent = RouterStore.getInstance().getRootComponent();
    React.render(<RootComponent />, document.querySelector(this.target));
  }
  /**
   * @function
   * @param {object} route - routeTable for the current path
   * @param {string} urlPath - current urlPath for binding
   * @param {Array<Application>} parents - Array of parent applications of current route
   *  configures page.js with the routes defined in the routing table.
   */
  bindRoutes(route, urlPath, parents = []) {
    log('route: ', route, urlPath, parents);
    let driver = this;

    if(route.app) {
      //if current application has component, and its sub route table does not have current path
      if(route.hasComponent && !(route.routes && route.routes[urlPath])) {
        log(`binding ${urlPath}`, route.app);
        urlPath = driver.rootUrl + urlPath;
        page(urlPath, co.wrap(function * (ctx) {
          //if routed path is already the current path, do nothing
          if(driver[INIT_APP] && ctx.path === RouterStore.getInstance().getUrl()) {
            return;
          }
          log('routed to: ', urlPath, route, parents);

          //keep ordered list of the component hierarchy
          let compList = [];

          //check parents
          log('check p: ', parents);
          yield foreach(parents, function * (p) {
            //load the application from server is app is still the src path.
            if(typeof p.app === 'string') {
              //root application path is already loaded
              if(`${driver.srcRoot}/${p.app}`===driver.appPath) {
                p.app = driver.app;
              } else {
                let canonicalAppPath = url.resolve(driver.appPath, p.app);
                log(`fetching ${canonicalAppPath}`);
                p.app = ( yield System.import(canonicalAppPath) );
                yield new LoadLocales({
                  lStore: driver.lStore,
                  LC
                }).exec();
                log(`successfully fetched: `, p.app);
              }
            }
            if(p.app.component) {
              compList.push(p.app.component);
            }
            //initializes the stores used if they are not initialized.
            if(Array.isArray(p.app.stores)) {
              p.app.stores.forEach((s) => {
                let tmp = s.getInstance();
                if(!tmp[INIT]) {
                  tmp[INIT_STORE]();
                  driver.dispatcher.register(tmp);

                  //if this is the first load, load states from data
                  if(!driver[INIT]) {
                    tmp.rehydrate(driver.data.shift());
                  }
                }
              });
            }
          });
          //check self
          if(typeof route.app === 'string') {
            if(`${driver.srcRoot}/${route.app}`===driver.appPath) {
              route.app = driver.app;
            } else {
              let canonicalAppPath = url.resolve(driver.appPath, route.app);
              log(`fetching ${canonicalAppPath}`);
              route.app = ( yield System.import(canonicalAppPath) );
              yield new LoadLocales({
                lStore: driver.lStore,
                LC
              }).exec();
              log(`successfully fetched: `, route.app);
            }
          }
          if(route.app.component) {
            compList.push(route.app.component);
          }
          if(Array.isArray(route.app.stores)) {
            route.app.stores.forEach((s) => {
              let tmp  = s.getInstance();
              if(!tmp[INIT]) {
                tmp[INIT_STORE]();
                driver.dispatcher.register(tmp);
                if(!driver[INIT]) {
                  tmp.rehydrate(driver.data.shift());
                }
              }
            });
          }
          //module loaded

          if(driver[INIT_APP]) {
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
          }
          //run actions
          yield foreach(parents, function * (p) {
            if(!p.app[INIT_APP]) {
              if(driver[INIT_APP]) {
                if(Array.isArray(p.app.initialActions)) {
                  yield foreach(p.app.initialActions, (initialAction) => {
                    return new initialAction.action(initialAction.payload).exec();
                  });

                }
              }
              p.app[INIT_APP] = true;
            }
            if(driver[INIT_APP]) {
              if(Array.isArray(p.app.routeActions)) {
                yield foreach(p.app.routeActions, (routeAction) => {
                  return new routeAction.action(routeAction.payload).exec();
                });
              }
            }

          });
          if(!route.app[INIT_APP]) {
            if(driver[INIT_APP]) {
              if(Array.isArray(route.app.initialActions)) {
                yield foreach(route.app.initialActions, (initialAction) => {
                  return new initialAction.action(initialAction.payload).exec();
                });

              }
            }
            route.app[INIT_APP] = true;
          }
          if(driver[INIT_APP]) {
            if(Array.isArray(route.app.routeActions)) {
              yield foreach(route.app.routeActions, (routeAction) => {
                return new routeAction.action(routeAction.payload).exec();
              });

            }
          }

          if (!driver[INIT_APP]) {
            //fill back the component list to the router store
            //this information was lost when states are transfered from server to client
            //so it must be restored before initial render.
            yield new SetComponents(compList).exec();

            //starts the application
            driver.init();
          }

        }));
      }
      if(route.routes) {
        //recursively binds the sub route table
        for(let p in route.routes) {
          this.bindRoutes(route.routes[p], p, parents.concat(route));
        }
      }
    } else {
      //if the current route object doesn't contain an application
      //it uses the parent application
      if(route.hasComponent) {
        log(`binding ${urlPath}`, route);
        urlPath = driver.rootUrl + urlPath;

        page(urlPath, co.wrap(function * (ctx) {
          if(driver[INIT_APP] && ctx.path === RouterStore.getInstance().getUrl()) {
            return;
          }

          log('routed to: ', urlPath, route, parents);
          let compList = [];
          //check parents
          yield foreach(parents, function * (p) {
            if(typeof p.app === 'string') {
              if(`${driver.srcRoot}/${p.app}`===driver.appPath) {
                p.app = driver.app;
              } else {
                let canonicalAppPath = url.resolve(driver.appPath, p.app);
                log(`fetching ${canonicalAppPath}`);
                p.app = ( yield System.import(canonicalAppPath) );
                yield new LoadLocales({
                  lStore: driver.lStore,
                  LC
                }).exec();
                log(`successfully fetched: `, p.app);
              }
            }
            if(p.app.component) {
              compList.push(p.app.component);
            }
            if(Array.isArray(p.app.stores)) {
              p.app.stores.forEach((s) => {
                let tmp = s.getInstance();
                if(!tmp[INIT]) {
                  tmp[INIT_STORE]();
                  driver.dispatcher.register(tmp);
                  if(!driver[INIT]) {
                    tmp.rehydrate(driver.data.shift());
                  }
                }
              });
            }

          });

          //navigate
          if(driver[INIT_APP]) {
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
          }

          //run actions
          yield foreach(parents, function * (p) {
            if(!p.app[INIT_APP]) {
              if(driver[INIT_APP]) {
                if(Array.isArray(p.app.initialActions)) {
                  yield foreach(p.app.initialActions, (initialAction) => {
                    return new initialAction.action(initialAction.payload).exec();
                  });

                }
              }
              p.app[INIT_APP] = true;
            }
            if(driver[INIT_APP]) {
              if(Array.isArray(p.app.routeActions)) {
                yield foreach(p.app.routeActions, (routeAction) => {
                  return new routeAction.action(routeAction.payload).exec();
                });
              }
            }

          });

          if(!driver[INIT_APP]) {
            yield new SetComponents(compList).exec();
            driver.init();
          }

        }));
      }

    }
  }
}



