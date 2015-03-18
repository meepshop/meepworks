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
const HTTP_PATH = /^\/(http|https):\//;
const FORMAT = Symbol();

export default class Locale {
  constructor(p) {
    let match = p.path.match(HTTP_PATH);
    if(match) {
      p.path = p.path.replace(match.shift(), `${match.shift()}://`);
      let root = `${RouterStore.rootUrl}/`;
      let urlInfo = url.parse(p.path);
      p.path = urlInfo.path.replace(root, '');
    }

    if(!LOCALE_CACHE.has(p.path)) {
      LOCALE_CACHE.set(p.path, {
        locales: new Set(p.locales),
        preload: p.preload || {}
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
  get locale() {
    return LocaleStore.locale;
  }
  setLocale(l) {
    return co(function * () {
      yield new SetLocale(l).exec();
      yield new LoadLocales({
        lStore: LocaleStore.getInstance(),
        LC: LOCALE_CACHE
      }).exec();
    });
  }
  formatDecimal(value) {

  }
  formatCurrency(value, currency) {

  }
  formatDate(t) {

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
