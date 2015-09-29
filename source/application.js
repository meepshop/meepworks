import React, { PropTypes } from 'react';
import Component from './component';
import path from 'path';

import asyncMap from 'greasebox/async-map';

import Locale from './locale';
import { LocaleLoadError } from './errors';

const isClient = typeof window !== 'undefined';

const _ChildRoutes = Symbol();
const _Component = Symbol();
const _ComponentPath = Symbol();
const _Locale = Symbol();
const _Ctx = Symbol();
const _CtxObject = Symbol();


export default class Application {
  constructor(ctx) {
    this[_Ctx] = ctx;
    this[_ChildRoutes] = this.childRoutes.map(r => path.resolve(this.dirname, r));
    this[_ComponentPath] = path.resolve(this.dirname, this.component);
    this[_Locale] = new Locale(ctx, this::processLocaleSetting());
    this[_CtxObject] = {
      context: {
        ctx,
        locale: this[_Locale]
      }
    };
  }
  get path() {
    return '/';
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

  get routes() {

    return {
      path: this.path,
      getChildRoutes: async (location, cb) => {
        if(isClient) {
          cb(null, await asyncMap(this[_ChildRoutes], async r => {
            try {
              let ChildApp = await System.import(r);
              let child = new ChildApp(this[_Ctx]);
              return child.routes;
            } catch (err) {
              return null;
            }

          }));
        } else {
          cb(null, this[_ChildRoutes].map(r => {
            this[_Ctx].files.add(r);
            let ChildApp = require(r);
            let child = new ChildApp(this[_Ctx]);
            return child.routes;
          }))
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
          if(!this[_Ctx].init) {
            store.rehydrate(this[_Ctx].storeData);
          }
          return store;
        });


        //title
        if(this.title !== Application.prototype.title) {
          this[_Ctx].pushTitle(this[_CtxObject]::this.title());
        }
        if(this[_Ctx].init && typeof this.onEnter === 'function' && this.onEnter !== Application.prototype.onEnter) {
          await this[_CtxObject]::this.onEnter(nextState, replaceState);
          cb();
        } else {
          cb();
        }
      },
      onLeave: () => {
        //title
        if(this.title !== Application.prototype.title) {
          this[_Ctx].popTitle();
        }
        if(typeof this.onLeave === 'function' && this.onLeave !== Application.prototype.onLeave) {
          this[_CtxObject]::this.onLeave();
        }
      },
      getComponent: async (location, cb) => {
        let self = this;
        if(!this[_Component]) {
          let Comp;
          if(isClient) {
            Comp = await System.import(this[_ComponentPath]);

          } else {
            this[_Ctx].files.add(this[_ComponentPath]);
            Comp = require(this[_ComponentPath]);
          }

          //extends the Comp with contexts
          this[_Component] = class K extends Component {
            static get contextTypes() {
              return {
                ctx: PropTypes.object,
                locale: PropTypes.func
              };
            }
            static get childContextTypes () {
              return {
                ctx: PropTypes.object,
                locale: PropTypes.func
              }
            }
            getChildContext() {
              return self[_CtxObject].context;
            }
            render() {
              return (<Comp {...this.props}/>)
            }

          };

        }

        cb(null, this[_Component]);
      }

    }
  }
}

function processLocaleSetting() {
  let settings = this.locale;
  if(settings) {
    settings.path = path.resolve(this.dirname, settings.path);
  }
  return settings;
}
