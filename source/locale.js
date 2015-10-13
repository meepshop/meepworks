import IntlPolyfill from 'intl';
import Tmpl from './tmpl';
import { LocaleLoadError } from './errors';


//const Intl = global.Intl || IntlPolyfill;
const Intl = IntlPolyfill;
const Cache = new Map();
const NumberFormatters = new Map();
const DateFormatters = new Map();

const _Ctx = Symbol();
const _Path = Symbol();

let localeDataLoaded = false;
const isClient = typeof window !== 'undefined';


export default class Locale {
  constructor(ctx, setting) {
    //load files and create mappings
    let self = (key, params) => {
      let p = self[_Path];
      if(!p) {
        return key;
      }
      let m = self[_Ctx].localeMapping[p];
      let res = Cache.get(self[_Path]).preload[m][key];
      if(typeof res === 'undefined') {
        return key;
      }

      if(typeof params !== 'undefined') {
        res = Tmpl.format(res, params);
      }
      return res;
    };

    self[_Ctx] = ctx;

    if(typeof setting !== 'undefined') {

      self[_Path] = setting.path;
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

    if(isClient && !localeDataLoaded) {
      await System.import('intl/locale-data/complete');
    }

    let mapping = this[_Ctx].localeMapping;
    let locale = this[_Ctx].locale;
    let acceptLanguage = this[_Ctx].acceptLanguage;
    //check if path exists in Cache
    for(let [p, c] of Cache) {
      let match = findMatch(locale, c.locales);

      //find a match from accepted languages current locale isn't available
      if(!match) {
        if(acceptLanguage.every((l) => {
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
    return this[_Ctx].locale;
  }

  async setLocale(l) {
    let previousLocale = this[_Ctx].locale;
    this[_Ctx].locale = l;
    try {
      await this.loadLocales();
      this[_Ctx].emit('locale-change');
    } catch (err) {
      this[_Ctx].locale = previousLocale;
      await this.loadLocales();
      this[_Ctx].emit('error', new LocaleLoadError(err));
    }

  }


  static formatNumber(locale, value, opts) {
    locale = locale.replace('_', '-');
    let key = `${locale}:${JSON.stringify(opts)}`;
    if(!NumberFormatters.has(key)) {
      NumberFormatters.set(key, Intl.NumberFormat(locale, opts));
    }
    let f = NumberFormatters.get(key);
    return f.format(value);
  }
  formatNumber(...args) {
    let locale = this[_Ctx].locale;
    return Locale.formatNumber(locale, ...args);
  }


  static formatDateTime(locale, t, opts) {
    locale = locale.replace('_', '-');
    let key = `${locale}:${JSON.stringify(opts)}`;
    if(!DateFormatters.has(key)) {
      DateFormatters.set(key, Intl.DateTimeFormat(locale, opts));
    }
    let f = DateFormatters.get(key);
    return f.format(t);
  }
  formatDateTime(...args) {
    let locale = this[_Ctx].locale;
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
    let locale = this[_Ctx].locale;
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
