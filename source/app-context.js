import Dispatcher from './dispatcher';
import co from 'co';
import { PAYLOAD } from './action-base';

export const APP_INIT = Symbol();
export const APPROOT = Symbol();
const DISPATCHER = Symbol();
const TITLE = Symbol();
const STORES = Symbol();
const LOCALE = Symbol();
const ACCEPTLANG = Symbol();


export default class AppContext {
  constructor() {
    this[DISPATCHER] = Dispatcher.getInstance(this);
    this[TITLE] = [];
    this[STORES] = new Set();
    this[APP_INIT] = false;
    this[LOCALE] = 'en-US';
    this[ACCEPTLANG] = [];
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
  setLocale(locale) {
    console.log('@', this);
    this[LOCALE] = locale;
    if(typeof this[APPROOT] === 'function') {
      this[APPROOT](locale);
    }

  }
  get title() {
    return this[TITLE];
  }
  get stores() {
    return this[STORES];
  }
}
