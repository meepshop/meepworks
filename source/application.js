import React, { PropTypes } from 'react';
import Component from './component';
import path from 'path';

import asyncMap from 'greasebox/async-map';

import Locale from './locale';
import { LocaleLoadError } from './errors';

const isClient = typeof window !== 'undefined';

const CHILDROUTES = Symbol();
const COMPONENT = Symbol();
const COMPONENT_PATH = Symbol();
const LOCALE = Symbol();
const CTX = Symbol();


export default class Application {
  constructor(ctx) {
    this[CTX] = ctx;
    this[CHILDROUTES] = this.childRoutes.map(r => path.resolve(this.dirname, r));
    console.log(this[CHILDROUTES])
    this[COMPONENT_PATH] = path.resolve(this.dirname, this.component);
    this[LOCALE] = new Locale(ctx, this::processLocaleSetting());
    this[CTX] = {
      context: {
        ctx,
        locale: this[LOCALE]
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

  title() {
    return void 0;
  }
  get routes() {

    return {
      path: this.path,
      getChildRoutes: async (location, cb) => {
        if(isClient) {
          cb(null, await asyncMap(this[CHILDROUTES], async r => {
            try {
              let ChildApp = await System.import(r);
              let child = new ChildApp(this[CTX].context.ctx);
              return child.routes;
            } catch (err) {
              return null;
            }

          }));
        } else {
          cb(null, this[CHILDROUTES].map(r => {
            let ChildApp = require(r);
            let child = new ChildApp(this[CTX].context.ctx);
            return child.routes;
          }))
        }
      },
      onEnter: async (nextState, replaceState, cb) => {
        try {
          await this[LOCALE].loadLocales();
        } catch (err) {
          if(!(err instanceof LocaleLoadError)) {
            err = new LocaleLoadError(err);
          }
          this[CTX].context.ctx.emit('error', err);
        }

        //title
        if(this.title !== Application.prototype.title) {
          this[CTX].context.ctx.pushTitle(this[CTX]::this.title());
        }
        if(typeof this.onEnter === 'function') {
          if(this.onEnter.length === 3) {
            await this[CTX]::this.onEnter(nextState, replaceState, cb);
          } else {
            await this[CTX]::this.onEnter(nextState, replaceState);
            cb();
          }
        } else {
          cb();
        }
      },
      onLeave: () => {
        //title
        if(this.title !== Application.prototype.title) {
          this[CTX].context.ctx.popTitle();
        }
        if(typeof this.onLeave === 'function') {
          this[CTX]::this.onLeave();
        }
      },
      getComponent: async (location, cb) => {
        let self = this;
        if(!this[COMPONENT]) {
          let Comp;
          if(isClient) {
            Comp = await System.import(this[COMPONENT_PATH]);
          } else {
            Comp = require(this[COMPONENT_PATH]);
          }

          //extends the Comp with contexts
          this[COMPONENT] = class K extends Component {
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
              return self[CTX].context;
            }
            render() {
              return (<Comp {...this.props}/>)
            }

          };

        }

        cb(null, this[COMPONENT]);
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

//TODO:  onLeave handling
