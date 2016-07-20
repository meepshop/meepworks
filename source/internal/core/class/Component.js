import React, { PropTypes as ComponentPropTypes } from 'react'
import { routerShape } from 'react-router'


export default class Component extends React.Component {
  static get contextTypes() {
    return {
      router: routerShape.isRequired,
      ctx: ComponentPropTypes.object,
      locale: ComponentPropTypes.func
    }
  }
  runAction(action) {
    return this.context.ctx.runAction(action)
  }
  getStore(Store) {
    return Store.getInstance(this.context.ctx)
  }
  get locale() {
    return this.context.locale.locale
  }
  setLocale(l) {
    return this.context.locale.setLocale(l)
  }
  tmpl(key, params) {
    return this.context.locale(key, params)
  }
  formatNumber(...args) {
    return this.context.locale.formatNumber(...args)
  }
  formatCurrency(...args) {
    return this.context.locale.formatCurrency(...args)
  }
  formatDateTime(...args) {
    return this.context.locale.formatDateTime(...args)
  }
}
