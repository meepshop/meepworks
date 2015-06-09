import React, { Component, PropTypes } from 'react';

const LOADED = Symbol();


export default class AppLoader {
  constructor(App, ctx) {
    const loader = this;
    this.App = App;
    this.context = {
      appCtx: ctx
    };


    return class K extends Component {
        static get contextTypes() {
          return {
            router: PropTypes.func,
            appCtx: PropTypes.object
          };
        }
        getChildContext() {
          return {
            appCtx: ctx
          };
        }
        static willTransitionTo(transition, params, query, cb) {
          loader.loaded.then(() => {
            if(typeof loader.App.willTransitionTo === 'function') {
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

          loader::(loader.App.willTransitionFrom)(transition, component, cb);
          if(loader.App.willTransitionFrom.length < 3) {
            cb();
          }
        }
        static get childContextTypes () {
          return {
            appCtx: PropTypes.object
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
        }());
      }
      return this[LOADED];


    } else {
      return Promise.resolve();
    }
  }
}

