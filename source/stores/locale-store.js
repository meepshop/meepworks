import StoreBase from '../store-base';
import DetectIntl from '../actions/detect-intl';
import LoadLocales from '../actions/load-locales';
import SetLocale from '../actions/set-locale';
import ExposeContext from '../actions/expose-context';
import DetectBrowserLanguage from '../actions/detect-browser-language';

import Im from 'immutable';


const DATA = Symbol();
const DEFAULT = Symbol();

export default class LocaleStore extends StoreBase {
  constructor() {
    this.rehydrate({
      locale: null,
      acceptLanguages: []
    });
  }
  dehydrate() {
    let output = this[DATA].toJS();
    //clear intl object from data
    output.intl = null;
    output.data = null;
    output.mapping = null;
    return output;
  }
  rehydrate(state) {
    state.intl = null;
    state.mapping = {};
    state.data = {};
    this[DATA] = Im.fromJS(state);
  }
  get handlers() {
    return [{
      action: DetectIntl,
      handler: this.handleDetectIntl
    }, {
      action: LoadLocales,
      handler: this.handleLoadLocales
    }, {
      action: SetLocale,
      handler: this.handleSetLocale
    }, {
      action: ExposeContext,
      handler: this.handleExposeContext
    }, {
      action: DetectBrowserLanguage,
      handler: this.handleDetectBrowserLanguage
    }];
  }
  handleDetectIntl(payload) {
    this[DATA] = this[DATA].set('intl', payload.intl);
  }
  handleExposeContext(ctx) {
    let list = ctx.get('accept-language');
    list = list.split(',').map((l) => {
      return l.split(';').shift();
    });
    if(list.length === 0) {
      list.push('en-US');
    }
    let locale = ctx.locale;
    if(!locale) {
      locale = list[0];
    }
    this[DATA] = this[DATA].withMutations(map => {
      map.set('locale', locale)
        .set('acceptLanguages', Im.fromJS(list));
    });
  }

  handleDetectBrowserLanguage() {
    let locale = navigator.language || navigator.userLanguage;
    let acceptLanguages = navigator.languages || [locale];
    this[DATA] = this[DATA].withMutations(map => {
      map.set('locale', locale)
        .set('acceptLanguages', Im.fromJS(acceptLanguages));
    });
  }

  handleLoadLocales(payload) {
    this[DATA] = this[DATA].withMutations(map => {
      map.set('data', Im.fromJS(payload.data))
        .set('mapping', Im.fromJS(payload.mapping));
    });
    this.emit('change');
  }

  handleSetLocale(l) {
    this[DATA] = this[DATA].set('locale', l);
  }


  static get locale() {
    return this.getInstance().locale;
  }

  get locale() {
    return this[DATA].get('locale');
  }

  static get data() {
    return this.getInstance().data;
  }
  get data() {
    return this[DATA].get('data');
  }

  static get acceptLanguages() {
    return this.getInstance().acceptLanguages;
  }
  get acceptLanguages() {
    return this[DATA].get('acceptLanguages');
  }

  static getTmpl(p, key) {
    return this.getInstance().getTmpl(p, key);
  }
  getTmpl(p, key) {
    return this[DATA].getIn(['data', p, this[DATA].getIn(['mapping', p]), key]);
  }

  static get mapping() {
    return this.getInstance().mapping;
  }
  get mapping() {
    return this[DATA].get('mapping');
  }

  static get intl() {
    return this.getInstance().intl;
  }
  get intl() {
    return this[DATA].get('intl');
  }
}
