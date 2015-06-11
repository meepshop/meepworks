import React, { PropTypes } from 'react';

export default class Component extends React.Component {
  static get contextTypes() {
    return {
      router: PropTypes.func,
      appCtx: PropTypes.object,
      root: PropTypes.string,
      currentPath: PropTypes.string
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
  locale(key, params) {

  }
  formatNumber() {

  }
  formatCurrency() {

  }
  formatDate() {

  }
  setLocale() {

  }
}
