import React, { Component, PropTypes } from 'react';
import {APP_INIT} from './app-context';

const LOADED = Symbol();


export default class AppLoader {
  constructor(App, ctx, root) {
    const loader = this;
    this.App = App;
    this.context = {
      appCtx: ctx
    };
    this.ctx = ctx;


    return class K extends Component {
        static get contextTypes() {
          return {
            router: PropTypes.func,
            appCtx: PropTypes.object,
            root: PropTypes.string
          };
        }
        getChildContext() {
          return {
            appCtx: ctx,
            root
          };
        }
        static willTransitionTo(transition, params, query, cb) {
          loader.loaded.then(() => {
            let title = loader.App.title;
            if(title !== void 0) {
              loader.ctx.title.push(title);
            }
            if(ctx[APP_INIT] && typeof loader.App.willTransitionTo === 'function') {
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
          let title = loader.App.title;
          if(title !== void 0) {

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
            root: PropTypes.string
          }
        }
        render () {
          let App = loader.App;
          return <App ctx={loader.ctx}/>;
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
      s.getInstance(this.ctx);
    });
  }
}

