import Tmpl from './tmpl'
import { LocaleLoadError } from './errors';

if (typeof Intl === 'undefined') {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/en.js'
  ], function (require) {
    require('intl');
    require('intl/locale-data/jsonp/en.js');
  });
}

const Cache = new Map();
const NumberFormatters = new Map();

const _Ctx = Symbol();

let localeDataLoaded = false;
const isClient = typeof window !== 'undefined';


export default class Locale {
  constructor(ctx, setting) {
    let self = (key, params) => {
      let res;
      let locale = self[_Ctx].locale;
      for (var [k, v] of Cache) {
        if(k === self[_Ctx].locale && key){
          res = v[key] || key;
          break;
        }
      }
      if(typeof res === 'undefined') {
        return key;
      }
      if(typeof params !== 'undefined') {
        res = Tmpl.format(res, params);
      }
      return res;
    };

    if(typeof setting !== 'undefined' && typeof setting.locales !== 'undefined') {
      let arr = [];
      for(let k in setting.locales){
        arr.push(k);
        if(!Cache.has(k)){
          Cache.set(k, setting.locales[k]);
        }
      }
      if( arr.indexOf(ctx.locale) === -1 && arr.length > 0){
        ctx.locale = arr[0];
      } 
    }
    self[_Ctx] = ctx;
    self.__proto__ = this.__proto__;
    return self;
  }
  async loadLocales() {

  }

  get locale() {
    return this[_Ctx].locale;
  }

  async setLocale(l) {
    let previousLocale = this[_Ctx].locale;
    this[_Ctx].locale = l;
    try {
      this[_Ctx].emit('locale-change');
    } catch (err) {
      this[_Ctx].locale = previousLocale;
      this[_Ctx].emit('error', new LocaleLoadError(err));
    }

  }


  static formatNumber(locale, value, opts) {
    locale = locale.replace('_', '-');
    let key = `${locale}:${JSON.stringify(opts)}`;
    if(!NumberFormatters.has(key)) {
      NumberFormatters.set(key, new Intl.NumberFormat(locale, opts));
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
    let f = new Intl.DateTimeFormat(locale, opts);
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
