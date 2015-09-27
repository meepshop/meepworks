import React, { PropTypes } from 'react';
import path from 'path';

import asyncMap from 'greasebox/async-map';

import Locale from './locale';

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
    this[COMPONENT_PATH] = path.resolve(this.dirname, this.component);
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
  get routes() {

    return {
      path: this.path,
      getChildRoutes: async (location, cb) => {
        if(isClient) {
          cb(null, await asyncMap(this[CHILDROUTES], async r => {
            return await System.import(r);
          }));
        } else {
          cb(null, this[CHILDROUTES].map(r => require(r)));
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
          this[COMPONENT] = class K extends Comp {
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
              //  let res = {
              //    appCtx,
              //    baseURL: loader.context.baseURL,
              //    appURL: loader.context.appURL
              //  };
              //  //if the application has defined locale settings
              //  //override the locale object in the context
              //  if(loader.context.locale !== void 0) {
              //    res.locale = loader.context.locale;
              //  }
              //  return res;
              return {
                ctx: self[CTX],
                locale: self[LOCALE]
              };
            }

          };

        }

        cb(null, this[COMPONENT]);
      }

    }
  }
  //onEnter() {
  //
  //}
  //
  //onLeave() {
  //
  //}
}


//TODO: defined locale, onEnter, onLeave handling, title handling,
//      port application-context
