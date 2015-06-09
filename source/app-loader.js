import React, { Component, PropTypes } from 'react';



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
              console.log('no will transi')
               cb();
            }

          }).catch((err) => {
            console.log('Err:', err);
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

    } else {
      return Promise.resolve();
    }
  }
}

//class Loader extends React.Component {
//  static get contextTypes() {
//    return {
//      router: React.PropTypes.func
//    };
//  }
//  static willTransitionFrom() {
//    console.log('from: loader');
//  }
//  static willTransitionTo(t) {
//    console.log('@', t.path);
//    if(!AppCache[t.path]) {
//      AppCache[t.path] = Inner;
//    }
//  }
//  render () {
//    let Mod = AppCache[this.context.router.getCurrentPath()];
//    return <Mod />;
//  }
//}
