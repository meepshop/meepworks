import React, {  PropTypes } from 'react';
import Component from './component';
import Locale from './locale';
import {APP_INIT} from './app-context';
import path from 'path';
import url from 'url';
import AppRoot from './app-root';

const LOADED = Symbol();


export default class AppLoader {
  constructor(App, appCtx, currentPath, root = '', resolvedPath) {
    const loader = this;
    this.App = App;
    this.context = {
      appCtx,
      root: resolveRoot(root, currentPath)
    };
    this.resolvedPath = resolvedPath;

    return class K extends Component {
        static get contextTypes() {
          return {
            router: PropTypes.func,
            appCtx: PropTypes.object,
            root: PropTypes.string,
            currentPath: PropTypes.string,
            locale: PropTypes.func
          };
        }
        getChildContext() {
          let res = {
            appCtx,
            root: loader.context.root
          };
          if(loader.context.locale !== void 0) {
            res.locale = loader.context.locale;
          }
          return res;
        }
        static willTransitionTo(transition, params, query, cb) {
          //provide similar context interface
          loader.context.currentPath = transition.path;


          loader::loaded().then(() => {
            //if app has title defined, push to title stack
            let title = loader::loader.App.title();
            if(title !== void 0) {
              appCtx.title.push(title);
            }
            if(appCtx[APP_INIT] && typeof loader.App.willTransitionTo === 'function') {
              loader::(loader.App.willTransitionTo)(transition, params, query, cb);
              if(loader.App.willTransitionTo.length < 4) {
                cb();
              }
            } else {
               cb();
            }

          }).catch((err) => {
            transition.abort();
            cb(err);
          });
        }
        static willTransitionFrom(transition, component, cb) {

          //provide similar context interface
          loader.context.currentPath = transition.path;

          //remove title from title stack if defined
          let title = loader::loader.App.title();
          if(title !== void 0) {
            //because all the apps that is dismounting will trigger willTransitionFrom,
            //so the total number of titles to be popped will be correct regardless of
            //the order of execution of willTransitionFrom function.
            appCtx.title.pop();
          }

          if(typeof loader.App.willTransitionFrom === 'function') {
            loader::(loader.App.willTransitionFrom)(transition, component, cb);
            if(loader.App.willTransitionFrom.length < 3) {
              cb();
            }
          } else {
            cb();
          }
        }
        static get childContextTypes () {
          return {
            appCtx: PropTypes.object,
            root: PropTypes.string,
            currentPath: PropTypes.string,
            locale: PropTypes.func
          }
        }
        render () {
          let App = loader.App;
          return <App />;
        }

    }
  }
  initStores() {
    this.App.stores.forEach(s => {
      s.getInstance(this.context.appCtx);
    });
  }
  runAction(action) {
    return this.context.appCtx.runAction(action);
  }
  getStore(Store) {
    return Store.getInstance(this.context.appCtx);
  }
  get locale() {
    return this.context.locale.locale;
  }
  setLocale(l) {
    return this.context.locale.setLocale(l);
  }
  tmpl(key, params) {
    return this.context.locale(key, params);
  }
  formatNumber(...args) {
    return this.context.locale.formatNumber(...args);
  }
  formatCurrency(...args) {
    return this.context.locale.formatCurrency(...args);
  }
  formatDateTime(...args) {
    return this.context.locale.formatDateTime(...args);
  }

}

function loaded()  {
  if(!this[LOADED]) {
    this[LOADED] = (async () => {
      if(typeof this.App === 'string') {
        this.appPath = this.App;
        this.App = await System.import(this.App);
      }
      if(this.App === AppRoot) {
        this.context.locale = new Locale(this.context.appCtx);
      } else {
        let setting = this.App.localeSetting;

        if(setting !== void 0) {

          let appPath = this.resolvedPath || this.appPath;
          setting.path = path.resolve(path.dirname(appPath), setting.path);


          if(typeof window !== 'undefined' && typeof System !== 'undefined') {
            setting.path = setting.path.substr(1);
          }
          this.context.locale = new Locale(this.context.appCtx, setting);
          await this.context.locale.loadLocales();
        }

      }
      this.initStores();
    }());
    return this[LOADED];
  }
  return Promise.resolve();
}


function resolveRoot(root = '', currentPath = '') {

  if(root === '') {
    return '/' + currentPath;
  } else if(currentPath === '') {
    return '/' + root;
  } else {
    return `/${root}/${currentPath}`;
  }

}
