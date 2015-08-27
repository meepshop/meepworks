import React from 'react';
import Application from '../../../build/application';

export default class DefaultApp extends Application {
  static willTransitionTo(transition, param, query) {
  }
  static title() {
    return this.tmpl('title');
  }
  static get localeSetting() {
    return {
      path: './locales',
      locales: [
        'en-US',
        'zh-TW',
        'fr-FR'
      ]
    };
  }
  render() {
    return (
      <div>Default</div>
    );
  }
}
