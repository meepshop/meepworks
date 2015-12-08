import React, { PropTypes } from 'react';
import { PropTypes as RouterPropTypes } from 'react-router';
import Component from './component';
import path from 'path';

import asyncMap from 'greasebox/async-map';

import Locale from './locale';
import { LocaleLoadError } from './errors';

const isClient = typeof window !== 'undefined';

const _ChildRoutes = Symbol();
const _Component = Symbol();
const _LoadingComponent = Symbol();
const _ComponentPath = Symbol();
const _Locale = Symbol();
const _Ctx = Symbol();
const _CtxObject = Symbol();
const _Routes = Symbol();
const _LoadingRoutes = Symbol();
const _RouteObject = Symbol();


export default class Application {
  constructor(ctx) {
    this[_Ctx] = ctx;
    //this[_ChildRoutes] = this.childRoutes.map(r => path.resolve(normalizeDirname(this.dirname), r));
    this[_ChildRoutes] = this.childRoutes.map(r => normalizedResolver(this.dirname, r));
    //this[_ComponentPath] = path.resolve(normalizeDirname(this.dirname), this.component);
    this[_ComponentPath] = normalizedResolver(this.dirname, this.component);
    this[_Locale] = new Locale(ctx, this::processLocaleSetting());
    this[_CtxObject] = {
      context: {
        ctx,
        locale: this[_Locale]
      },
      runAction(action) {
        return this.context.ctx.runAction(action);
      },
      getStore(Store) {
        return Store.getInstance(this.context.ctx);
      },
      get locale() {
        return this.context.locale.locale;
      },
      setLocale(l) {
        return this.context.locale.setLocale(l);
      },
      tmpl(key, params) {
        return this.context.locale(key, params);
      },
      formatNumber(...args) {
        return this.context.locale.formatNumber(...args);
      },
      formatCurrency(...args) {
        return this.context.locale.formatCurrency(...args);
      },
      formatDateTime(...args) {
        return this.context.locale.formatDateTime(...args);
      }
    };
  }
  get path() {
    return void 0;
  }
  get childRoutes() {
    return [];
  }
  get component() {
    throw new Error('Application must define a relative path to component');
    return void 0;
  }
  get dirname() {
    throw new Error('Application must define dirname');
  }
  get locale() {
    return void 0;
  }

  get stores() {
    return [];
  }

  title() {
    return void 0;
  }

  async onEnter() {
    //overload this function to define onEnter hook handlers
  }

  onLeave() {
    //overload this function to define onLeave hook handlers
  }
  routerWillLeave(nextLocation) {
    //overload this function to define routerWillLeave lifecycle method.
    //this allow leave confirmations to be done.
  }
  get routes() {
    if(!this[_RouteObject]) {
      this[_RouteObject] = {
        path: this.path,
        getChildRoutes: (location, cb) => {
          if(this[_Routes]) {
            cb(null, this[_Routes]);
          } else if(this[_LoadingRoutes]) {
            (async () => {
              await this[_LoadingRoutes];
              cb(null, this[_Routes]);
            })();
          } else {
            this[_LoadingRoutes] = (async () => {
              let childRoutes = [];
              if(isClient) {
                childRoutes = await asyncMap(this[_ChildRoutes], async r => {
                  try {
                    let ChildApp = await System.import(r);
                    let child = new ChildApp(this[_Ctx]);
                    return child.routes;
                  } catch (err) {
                    this[_Ctx].emit('error', err);
                  }
                });
              } else {
                childRoutes = this[_ChildRoutes].map(r => {
                  try {
                    let ChildApp = require(r);
                    let child = new ChildApp(this[_Ctx]);
                    this[_Ctx].files.add(r);
                    return child.routes;
                  } catch(err) {
                    this[_Ctx].emit('error', err);
                  }
                });
              }
              this[_Routes] = childRoutes.filter(r => !!r);
              cb(null, this[_Routes]);
            })();
          }
        },
        onEnter: async (nextState, replaceState, cb) => {
          try {
            await this[_Locale].loadLocales();
          } catch (err) {
            if(!(err instanceof LocaleLoadError)) {
              err = new LocaleLoadError(err);
            }
            this[_Ctx].emit('error', err);
          }

          //stores
          this.stores.forEach(s => {
            let store = s.getInstance(this[_Ctx]);
            return store;
          });


          //title
          if(this.title !== Application.prototype.title) {
            try {
              let title = this[_CtxObject]::this.title();
              if(title) {
                this[_Ctx].pushTitle(title);
              }
            } catch(err) {
              this[_Ctx].emit('error', err);
            }
          }
          if(this[_Ctx].init &&
             this.onEnter !== Application.prototype.onEnter &&
               typeof this.onEnter === 'function') {
            try {
              await this[_CtxObject]::this.onEnter(nextState, replaceState);
              cb();
            } catch(err) {
              cb(err);
            }
          } else {
            cb();
          }
        },
        onLeave: () => {
          //title
          if(this.title !== Application.prototype.title) {
            try {
              let title = this[_CtxObject]::this.title();
              if(title) {
                this[_Ctx].popTitle();
              }
            } catch(err) {
              this[_Ctx].emit('error', err);
            }
          }
          if(this.onLeave !== Application.prototype.onLeave &&
             typeof this.onLeave === 'function') {
            this[_CtxObject]::this.onLeave();
          }
        },
        getComponent: (location, cb) => {
          let self = this;
          if(this[_Component]) {
            cb(null, this[_Component]);
          } else if(this[_LoadingComponent]) {
            (async () => {
              await this[_LoadingComponent];
              cb(null, this[_Component]);
            })();
          } else {
            this[_LoadingComponent] = (async () => {
              let Comp;
              if(isClient) {
                try {
                  Comp = await System.import(this[_ComponentPath]);
                } catch(err) {
                  this[_Ctx].emit('error', err);
                  cb(err);
                }

              } else {
                this[_Ctx].files.add(this[_ComponentPath]);
                try {
                  Comp = require(this[_ComponentPath]);
                } catch(err) {
                  this[_Ctx].emit('error', err);
                  cb(err);
                }
              }

              //extends the Comp with contexts
              this[_Component] = class K extends Component {
                static get contextTypes() {
                  return {
                    ctx: PropTypes.object,
                    locale: PropTypes.func,
                    history: RouterPropTypes.history,
                    route: RouterPropTypes.route
                  };
                }
                static get childContextTypes () {
                  return {
                    ctx: PropTypes.object,
                    locale: PropTypes.func
                  }
                }
                componentDidMount() {
                  if(this.routerWillLeave !== Application.prototype.routerWillLeave &&
                     typeof self.routerWillLeave === 'function') {
                    this._unlistenBeforeLeavingRoute = this.context.history.listenBefore(
                      this::self.routerWillLeave
                    );
                  }
                }
                componentWillUnmount() {
                  if(this._unlistenBeforeLeavingRoute) {
                    this._unlistenBeforeLeavingRoute();
                  }
                }
                getChildContext() {
                  return self[_CtxObject].context;
                }
                render() {
                  return (<Comp {...this.props}/>)
                }

              };
              cb(null, this[_Component]);

            })();
          }
        }

      };
    }
    return this[_RouteObject];
  }
}

function processLocaleSetting() {
  let settings = this.locale;
  if(settings) {
    //settings.path = path.resolve(normalizeDirname(this.dirname), settings.path);
    settings.path = normalizedResolver(this.dirname, settings.path);
  }
  return settings;
}

const httpCheck = /^http/;
const httpReplace = /^(http:\/\/.*?)(\/)/;


function normalizedResolver(dirname, p) {
  if(httpCheck.test(dirname)) {
    let match = dirname.match(httpReplace);
    dirname = dirname.replace(httpReplace, '/');
    return match[1] + path.resolve(dirname, p);
  }
  return path.resolve(dirname, p);
}
function normalizeDirname(dirname) {
  if(httpCheck.test(dirname)) {
    return dirname.replace(httpReplace, '');
  }
  return dirname;
}
