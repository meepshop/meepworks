import React, {  PropTypes } from 'react';
import Component from './component';
import {APP_INIT} from './app-context';

const LOADED = Symbol();


export default class AppLoader {
  constructor(App, appCtx, currentPath, root = '' ) {
    const loader = this;
    this.App = App;
    this.context = {
      appCtx
    };

    return class K extends Component {
        static get contextTypes() {
          return {
            router: PropTypes.func,
            appCtx: PropTypes.object,
            root: PropTypes.string,
            currentPath: PropTypes.string
          };
        }
        getChildContext() {
          return {
            appCtx,
            root: resolveRoot(root, currentPath)
          };
        }
        static willTransitionTo(transition, params, query, cb) {
          loader.loaded.then(() => {
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
          let title = loader::loader.App.title();
          if(title !== void 0) {
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
            currentPath: PropTypes.string
          }
        }
        render () {
          let App = loader.App;
          return <App />;
        }

    }
  }
  get loaded()  {

    if(typeof this.App === 'string') {
      if(!this[LOADED]) {
        this[LOADED] = (async () => {
          this.App = await System.import(this.App);
          this.initStores();
        }());
      }
      return this[LOADED];


    } else {
      this.initStores();
      return Promise.resolve();
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
