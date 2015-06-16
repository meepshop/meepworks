import IntlPolyfill from 'intl';
import Tmpl from './tmpl';
import { APPROOT } from './app-root';


const Intl = global.Intl || IntlPolyfill;

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
  constructor(p, ctx) {
    //load files and create mappings
    let self = (key, params) => {
      let p = self[PATH];
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

    console.log('@@@', self);
    self[CTX] = ctx;
    self[PATH] = p.path;


    if(!p.preload) {
      p.preload = {};
    } else {
      p.locales = [];
      for(let l in p.preload) {
        p.locales.push(l);
      }
    }

    if(!Cache.has(p.path)) {
      Cache.set(p.path, {
        locales: new Set(p.locales),
        preload: p.preload
      });
    } else {
      let c = Cache.get(p.path);
      p.locales.forEach((l) => {
        c.locales.add(l);
      });
      if(p.preload) {
        for(let l in p.preload) {
          if(!c.preload[l]) {
            c.preload[l] = p.preload[l];
          }
        }
      }
    }

    self.__proto__ = this.__proto__;
    return self;
  }

  async loadLocales() {

    console.log('@loadLocales', this, this[CTX]);
    let mapping = this[CTX][LOCALEMAPPING];
    let locale = this[CTX][LOCALE];
    let acceptedLanguagees = this[CTX][ACCEPTLANG];
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

  async setLocale(l) {
    this[CTX][LOCALE] = l;
    await this.loadLocales();
    if(typeof this[CTX][APPROOT] === 'function') {
      this[CTX][APPROOT](l);
    }

  }


  static formatNumber(value, opts) {
    let l = this.locale || DefaultLocale;
    let key = `${l}:${JSON.stringify(opts)}`;
    if(!NumberFormatters.has(key)) {
      NumberFormatters.set(key, Intl.NumberFormat(l, opts));
    }
    let f = NumberFormatters.get(key);
    return f.format(value);
  }
  static formatDateTime(t, opts) {
    let l = this.locale || DefaultLocale;
    let key = `${l}:${JSON.stringify(opts)}`;
    if(!DateFormatters.has(key)) {
      DateFormatters.set(key, Intl.DateTimeFormat(l, opts));
    }
    let f = DateFormatters.get(key);
    return f.format(t);
  }
  static formatCurrency(value, currency, fixed) {
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
    return this.formatNumber(value, opts);
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
