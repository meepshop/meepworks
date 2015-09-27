import Dispatcher from './dispatcher';
import Emitter from 'component-emitter';
import { ActionError } from './errors';
import Im from 'immutable';

const _Dispatcher = Symbol();
const _Init = Symbol();
const _Stores = Symbol();
const _Title = Symbol();
const _Locale = Symbol();
const _AcceptLanguage = Symbol();
const _LocaleMapping = Symbol();


export default class ApplicationContext {
  constructor(locale = 'en_US', acceptLanguage = [], localeMapping = {}) {
    this[_Dispatcher] = Dispatcher.getInstance(this);
    this[_Title] = [];
    this[_Stores] = new Set();
    this[_Init] = false;
    this[_Locale] = locale;
    this[_AcceptLanguage] = acceptLanguage;
    this[_LocaleMapping] = localeMapping;

  }
  async runAction(action) {
    action.ctx = this;
    try {
      this[_Dispatcher].dispatch({
        action: action.constructor,
        payload: await action.action(...action.payload)
      });
    } catch(err) {
      this.emit('error', new ActionError(err));
    }
  }
  getStore(Store) {
    return Store.getInstance(this);
  }
  get title() {
    return this[_Title].slice().pop();
  }
  pushTitle(title) {
    this[_Title].push(title);
  }
  popTitle() {
    return this[_Title].pop();
  }
  get stores() {
    return this[_Stores].slice();
  }

  get locale() {
    return this[_Locale];
  }
  set locale(locale) {
    this[_Locale] = locale;
  }

  get acceptLanguage() {
    return this[_AcceptLanguage];
  }

  get localeMapping() {
    return this[_LocaleMapping];
  }
}

Emitter(ApplicationContext.prototype);





//    export default class AppContext {
//      constructor() {
//        this[ACCEPTLANG] = [];
//        this[_LocaleMAPPING] = {};
//
//      }
//      get files() {
//        return this[FILES];
//      }
//    }
//
//    Emitter(AppContext.prototype);
//
//    Object.defineProperty(AppContext.prototype, STATE, {
//      get() {
//        return {
//          locale: this[_Locale],
//          acceptLanguage: this[ACCEPTLANG],
//          mapping: this[_LocaleMAPPING]
//        };
//      },
//      set(val) {
//        this[_Locale] = val.locale;
//        this[ACCEPTLANG] = val.acceptLanguage;
//        this[_LocaleMAPPING] = val.mapping;
//      }
//    });
