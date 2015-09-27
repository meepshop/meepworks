import path from 'path';




import asyncMap from 'greasebox/async-map';

const isClient = typeof window !== 'undefined';

const CHILDROUTES = Symbol();
const COMPONENT = Symbol();
const ROUTE = Symbol();
const DIRNAME = Symbol();


//TODO: defined locale, onEnter, onLeave handling, title handling,
//      port application-context
export default class Application {
  constructor({
    route = '/',
    component,
    dirname,
    childRoutes = [],
    locale,
    onEnter,
    onLeave
  }) {
    this[CHILDROUTES] = childRoutes.map(r => path.resolve(dirname, r));
    this[COMPONENT] = path.resolve(dirname, component);
    this[ROUTE] = route;
    this[DIRNAME] = dirname;
  }
  get path() {
    return this[ROUTE];
  }
  getRoutes(ctx) {
    return {
      path: this[ROUTE],
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
        if(isClient) {
          cb(null, await System.import(this[COMPONENT]));
        } else {
          cb(null, require(this[COMPONENT]));
        }
      }

    };
  }
  get routes () {
    return {
      path: this[ROUTE],
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
        if(isClient) {
          cb(null, await System.import(this[COMPONENT]));
        } else {
          cb(null, require(this[COMPONENT]));
        }
      }

    };
  }
}


