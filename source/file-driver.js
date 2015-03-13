import React from 'react';
import co from 'co';
import Dispatcher from './dispatcher';
import { INIT_STORE } from './store-base';


import foreach from 'greasebox/co-foreach';
import Tmpl from './tmpl';

export default class FileDriver {
  constructor(App) {
    console.log(App);

    //init stores
    let dispatcher = Dispatcher.getInstance();
    if(Array.isArray(App.stores)) {
      App.stores.forEach((s) => {
        console.log('store: ', s);
        let t = s.getInstance();
        console.log(t.handlers);
        t[INIT_STORE]();
        dispatcher.register(t);
      });
    }

    let AppComponent = App.component;
    console.log(document.body);
    React.render(<AppComponent />, document.body);

  }
}
