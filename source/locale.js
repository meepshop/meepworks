import LocaleStore from './stores/locale-store';
import LoadLocales from './actions/load-locales';
import SetLocale from './actions/set-locale';
import RouterStore from './stores/router-store';
import Tmpl from './tmpl';
import Im from 'immutable';
import co from 'co';
import url from 'url';

export const LOCALE_CACHE = new Map();

const PATH = Symbol();
const OVERRIDES = Symbol();
const FORMAT = Symbol();

const NUMBER_FORMATTERS = new Map();
const DATE_FORMATTERS = new Map();

const HTTP_PATH = /^\/(http|https):\//;

export default class Locale {
  constructor(p) {
    let match = p.path.match(HTTP_PATH);
    if(match) {
      p.path = p.path.replace(match.shift(), `${match.shift()}://`);
      let root = `${RouterStore.rootUrl}/`;
      let urlInfo = url.parse(p.path);
      p.path = urlInfo.path.replace(root, '');
    }

    if(!p.preload) {
      p.preload = {};
    } else {
      p.locales = [];
      for(let l in p.preload) {
        p.locales.push(l);
      }
    }

    if(!LOCALE_CACHE.has(p.path)) {
      LOCALE_CACHE.set(p.path, {
        locales: new Set(p.locales),
        preload: p.preload
      });
    } else {
      let c = LOCALE_CACHE.get(p.path);
      p.locales.forEach((l) => {
        c.locales.add(l);
      });
      if(p.preload) {
        for(let l in p.preload) {
          if(!c.preload.has(l)) {
            c.preload.set(l, p.preload[l]);
          }
        }
      }
    }
    this[PATH] = p.path;
    this[OVERRIDES] = [];
  }
  get paths() {
    return this[PATH];
  }

  addOverride(l) {
    this[OVERRIDES].unshift(l);
  }

  format(key, params) {
    let res;
    if(this[OVERRIDES].every((o) => {
      res = o[FORMAT](key, params);
      return !res;
    })) {
      res = this[FORMAT](key, params);
      if(!res) {
        res = key;
      }
    }
    return res;
  }
  static get locale() {
    return LocaleStore.locale;
  }
  get locale() {
    return LocaleStore.locale;
  }
  static setLocale(l) {
    return co(function * () {
      yield new SetLocale(l).exec();
      yield new LoadLocales({
        lStore: LocaleStore.getInstance(),
        LC: LOCALE_CACHE
      }).exec();
    });
  }
  setLocale(l) {
    return Locale.setLocale(l);
  }
  formatDecimal(value) {
    return this.formatNumber(value);
  }
  formatCurrency(value, currency) {
    return this.formatNumber(value, {
      style: 'currency',
      currency
    });
  }
  formatNumber(value, opts) {
    let l = Locale.locale;
    let key = `${l}:${JSON.stringify(opts)}`;
    if(!NUMBER_FORMATTERS.has(key)) {
      NUMBER_FORMATTERS.set(key, LocaleStore.intl.NumberFormat(l, opts));
    }
    let f = NUMBER_FORMATTERS.get(key);
    return f.format(value);
  }
  formatDate(t, opts) {
    let l = Locale.locale;
    let key = `${l}:${JSON.stringify(opts)}`;
    if(!DATE_FORMATTERS.has(key)) {
      DATE_FORMATTERS.set(key, LocaleStore.intl.DateTimeFormat(l, opts));
    }
    let f = DATE_FORMATTERS.get(key);
    return f.format(value);

  }
  on(e, f) {
    LocaleStore.getInstance().on(e, f);
  }
  addEventListener(e, f) {
    LocaleStore.getInstance().on(e, f);
  }
  off(e, f) {
    LocaleStore.getInstance().off(e, f);
  }
  removeEventListener(e, f) {
    LocaleStore.getInstance().off(e, f);
  }
}

Locale.prototype[FORMAT] = function (key, params) {
  let res;
  let l = LocaleStore.locale;
  let tmpl = LocaleStore.getTmpl(this[PATH], key);
  if(tmpl) {
    res = Tmpl.format(tmpl, params);
  }
  return res;
}
