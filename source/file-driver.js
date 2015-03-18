import React from 'react';
import co from 'co';
import Dispatcher from './dispatcher';
import { INIT_STORE } from './store-base';
import LocaleStore from './stores/locale-store';
import { LOCALE_CACHE as LC } from './locale';
import DetectIntl from './actions/detect-intl';
import DetectBrowserLanguage from './actions/detect-browser-language';
import LoadLocales from './actions/load-locales';

import foreach from 'greasebox/co-foreach';
import Tmpl from './tmpl';

export default class FileDriver {
  constructor(App) {
    //init stores
    co(function * () {
      let dispatcher = Dispatcher.getInstance();
      if(Array.isArray(App.stores)) {
        App.stores.forEach((s) => {
          let t = s.getInstance();
          t[INIT_STORE]();
          dispatcher.register(t);
        });
      }
      let lStore = LocaleStore.getInstance();
      lStore[INIT_STORE]();
      dispatcher.register(lStore);

      yield new DetectIntl().exec();
      yield new DetectBrowserLanguage().exec();
      yield new LoadLocales({
        lStore,
        LC
      }).exec();

      let AppComponent = App.component;
      React.render(<AppComponent />, document.body);


    });
  }
}
