import IntlPolyfill from 'intl';
import Tmpl from './tmpl';
import { APPROOT } from './app-root';
import { LocaleLoadFailed } from './errors';


//const Intl = global.Intl || IntlPolyfill;
const Intl = IntlPolyfill;
const Cache = new Map();
const NumberFormatters = new Map();
const DateFormatters = new Map();
const DefaultLocale = 'en-US';

const CTX = Symbol();
const PATH = Symbol();

export const LOCALE = Symbol();
export const ACCEPTLANG = Symbol();
export const LOCALEMAPPING = Symbol();

export default class Locale {
  constructor(ctx, setting) {
    //load files and create mappings
    let self = (key, params) => {
      let p = self[PATH];
      if(!p) {
        return key;
      }
      let m = self[CTX][LOCALEMAPPING][p];
      let res = Cache.get(self[PATH]).preload[m][key];
      if(typeof res === 'undefined') {
        return key;
      }

      if(typeof params !== 'undefined') {
        res = Tmpl.format(res, params);
      }
      return res;
    };

    self[CTX] = ctx;

    if(typeof setting !== 'undefined') {

      self[PATH] = setting.path;
      if(!setting.preload) {
        setting.preload = {};
      } else {
        setting.locales = [];
        for(let l in setting.preload) {
          setting.locales.push(l);
        }
      }

      if(!Cache.has(setting.path)) {
        Cache.set(setting.path, {
          locales: new Set(setting.locales),
          preload: setting.preload
        });
      } else {
        let c = Cache.get(setting.path);
        setting.locales.forEach((l) => {
          c.locales.add(l);
        });
        if(setting.preload) {
          for(let l in setting.preload) {
            if(!c.preload[l]) {
              c.preload[l] = setting.preload[l];
            }
          }
        }
      }
    }

    self.__proto__ = this.__proto__;
    return self;
  }

  async loadLocales() {

    let mapping = this[CTX][LOCALEMAPPING];
    let locale = this[CTX][LOCALE];
    let acceptedLanguages = this[CTX][ACCEPTLANG];
    //check if path exists in Cache
    for(let [p, c] of Cache) {
      let match = findMatch(locale, c.locales);

      //find a match from accepted languages current locale isn't available
      if(!match) {
        if(acceptedLanguages.every((l) => {
          match = findMatch(l, c.locales);
          return !match;
        })) {
          match = c.locales.entries().next().value.shift();
        }
      }
      if(!c.preload[match]) {
        if(typeof window !== 'undefined' && typeof System !== 'undefined') {
          c.preload[match] = await System.import(`${p}/${match}.json!`);
        } else {
          c.preload[match] = require(`${p}/${match}.json`);
        }
      }
      mapping[p] = match;
    }
  }

  get locale() {
    return this[CTX][LOCALE];
  }

  async setLocale(l) {
    let previousLocale = this[CTX][LOCALE];
    this[CTX][LOCALE] = l;
    try {
      await this.loadLocales();
      if(typeof this[CTX][APPROOT] === 'function') {
        this[CTX][APPROOT](l);
      }
    } catch (err) {
      this[CTX][LOCALE] = previousLocale;
      await this.loadLocales();
      this[CTX].emit('error', new LocaleLoadFailed(err));
    }

  }


  static formatNumber(locale, value, opts) {
    let key = `${locale}:${JSON.stringify(opts)}`;
    if(!NumberFormatters.has(key)) {
      NumberFormatters.set(key, Intl.NumberFormat(locale, opts));
    }
    let f = NumberFormatters.get(key);
    return f.format(value);
  }
  formatNumber(...args) {
    let locale = this[CTX][LOCALE];
    return Locale.formatNumber(Locale, ...args);
  }


  static formatDateTime(locale, t, opts) {
    let key = `${locale}:${JSON.stringify(opts)}`;
    if(!DateFormatters.has(key)) {
      DateFormatters.set(key, Intl.DateTimeFormat(locale, opts));
    }
    let f = DateFormatters.get(key);
    return f.format(t);
  }
  formatDateTime(...args) {
    let locale = this[CTX][LOCALE];
    return Locale.formatDateTime(locale, ...args);
  }

  static formatCurrency(locale, value, currency, fixed) {
    currency = currency.toUpperCase();
    let opts = {
      style: 'currency',
      currency: currency.toUpperCase()
    };
    if(typeof fixed === 'number') {
      fixed = ~~fixed;
      opts.minimumFractionDigits = fixed;
      opts.maximumFractionDigits = fixed;
    }
    return this.formatNumber(locale, value, opts);
  }
  formatCurrency(...args) {
    let locale = this[CTX][LOCALE];
    return Locale.formatCurrency(locale, ...args);
  }
}

function findMatch(locale, list) {
  if(list.has(locale)) {
    return locale;
  } else {
    let ln = locale.split('-').shift();
    if(list.has(ln)) {
      //locale = zh-TW, list has zh
      return ln;
    } else {
    //locale = zh, list has zh-TW
      for(let entry of list) {
        if(entry.split('-').shift() === ln) {
          return entry;
        }
      }
    }
  }
}
