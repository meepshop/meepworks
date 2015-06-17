import React, { PropTypes } from 'react';

export default class Component extends React.Component {
  static get contextTypes() {
    return {
      router: PropTypes.func,
      appCtx: PropTypes.object,
      baseURL: PropTypes.string,
      currentPath: PropTypes.string,
      locale: PropTypes.func
    };
  }
  static get localeSetting() {
    return void 0;
  }
  runAction(action) {
    return this.context.appCtx.runAction(action);
  }
  getStore(Store) {
    return Store.getInstance(this.context.appCtx);
  }
  get locale() {
    return this.context.locale.locale;
  }
  setLocale(l) {
    return this.context.locale.setLocale(l);
  }
  tmpl(key, params) {
    return this.context.locale(key, params);
  }
  formatNumber(...args) {
    return this.context.locale.formatNumber(...args);
  }
  formatCurrency(...args) {
    return this.context.locale.formatCurrency(...args);
  }
  formatDateTime(...args) {
    return this.context.locale.formatDateTime(...args);
  }
}
