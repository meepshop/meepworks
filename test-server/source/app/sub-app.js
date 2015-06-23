import React from 'react';
import Application from '../../../build/application';

export default class SubApp extends Application {
  static willTransitionFrom(transition) {
  }
  static title() {
    return 'Sub App';
  }
  static get routes() {
    return {
      'sub': {
        appPath: './not-found'
      }
    };
  }
  static get localeSetting() {
    return {
      path: './sub-locales',
      locales: [
        'en-US',
        'zh-TW'
      ]
    };
  }
  static willTransitionTo(transition) {
    if(Math.random() > 0.5) {
    } else if(Math.random() > 0.3) {
      transition.abort('reject');
    } else {
      transition.redirect(this.context.baseURL + '/not-found');
    }
  }
  render() {
    return (
      <div>SubApp @ {this.context.currentPath}<br />
        <button onClick={() => {
          this.setLocale(this.locale === 'en-US' ? 'zh-TW' : 'en-US');
        }}>Switch Language</button><br />
        {this.tmpl('content', { name: 'Joe'})}<br />
        {this.formatNumber(-1234.5678)}<br />
        {this.formatCurrency(1234.5678, 'USD')}<br />
        {this.formatCurrency(1234.5678, 'USD', 0)}<br />
        {this.formatDateTime(new Date())}
      </div>
    );
  }
}
