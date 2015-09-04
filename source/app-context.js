import Dispatcher from './dispatcher';
import co from 'co';
import { PAYLOAD } from './action-base';
import { LOCALE, ACCEPTLANG, LOCALEMAPPING } from './locale';
import Emitter from 'component-emitter';

export const APP_INIT = Symbol();
export const STATE = Symbol();
export const FILES = Symbol();

const DISPATCHER = Symbol();
const TITLE = Symbol();
const STORES = Symbol();

/**
 * @class AppContext
 * @description Application Context for applications. Actions use the context
 *              to call the current dispatcher, and the dispatcher uses the
 *              context to dispatcher data to the correct stores. Applications
 *              also use the context to get the correct data from stores.
 *              On server side, there is one context per request.
 *              On client side, there is only one context.
 */
export default class AppContext {
  constructor() {
    this[DISPATCHER] = Dispatcher.getInstance(this);
    this[TITLE] = [];
    this[STORES] = new Set();
    this[APP_INIT] = false;
    this[LOCALE] = 'en-US';
    this[ACCEPTLANG] = [];
    this[LOCALEMAPPING] = {};
    this[FILES] = [];

  }
  /**
   * @function
   * @description helper function to run actions under this context.
   * @param {Action} action - An instance of the action to be run.
   * @return {Promise}
   */
  runAction(action) {
    let self = this;
    action.ctx = self;

    return co(function *() {
      self[DISPATCHER].dispatch({
        action: action.constructor,
        payload: yield action.action(...action[PAYLOAD])
      });

    });
  }
  /**
   * @function
   * @description helper function to get store instance with this context.
   * @param {Store} store - The constructor of the store.
   * @return {Store}
   */
  getStore(store) {
    return store.getInstance(this);
  }
  /**
   * @property {Array} title
   * @description Used by the framework to determine the appropriate document title.
   */
  get title() {
    return this[TITLE];
  }
  /**
   * @property {Set of Store} stores
   * @description Used by the framework to dehydrate all the stores to send to client side.
   */
  get stores() {
    return this[STORES];
  }
  /**
   * @property {Array of String} files
   * @description This is used by the framework to scan the files to determine the css files necesary
   *              to preload.
   */
  get files() {
    return this[FILES];
  }
}

Emitter(AppContext.prototype);

Object.defineProperty(AppContext.prototype, STATE, {
  get() {
    return {
      locale: this[LOCALE],
      acceptLanguage: this[ACCEPTLANG],
      mapping: this[LOCALEMAPPING]
    };
  },
  set(val) {
    this[LOCALE] = val.locale;
    this[ACCEPTLANG] = val.acceptLanguage;
    this[LOCALEMAPPING] = val.mapping;
  }
});
