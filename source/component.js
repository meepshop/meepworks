import React, { PropTypes } from 'react';
import { PropTypes as RouterPropTypes} from 'react-router';


export default class Component extends React.Component {
  static get contextTypes() {
    return {
      history: RouterPropTypes.history,
      ctx: PropTypes.object,
      locale: PropTypes.func,
    };
  }
  runAction(action) {
    return this.context.ctx.runAction(action);
  }
  getStore(Store) {
    return Store.getInstance(this.context.ctx);
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
