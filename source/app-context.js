import Dispatcher from './dispatcher';
import co from 'co';
import { PAYLOAD } from './action-base';
import { LOCALE, ACCEPTLANG, LOCALEMAPPING } from './locale';

export const APP_INIT = Symbol();
export const STATE = Symbol();

const DISPATCHER = Symbol();
const TITLE = Symbol();
const STORES = Symbol();


export default class AppContext {
  constructor() {
    this[DISPATCHER] = Dispatcher.getInstance(this);
    this[TITLE] = [];
    this[STORES] = new Set();
    this[APP_INIT] = false;
    this[LOCALE] = 'en-US';
    this[ACCEPTLANG] = [];
    this[LOCALEMAPPING] = {};

  }
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
  get title() {
    return this[TITLE];
  }
  get stores() {
    return this[STORES];
  }
}

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
  }
});
