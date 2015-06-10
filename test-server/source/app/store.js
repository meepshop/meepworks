import StoreBase from '../../../build/store-base';
import Im from 'immutable';

import * as Actions from './actions';

const DATA = Symbol();


export default class Store extends StoreBase {
  constructor() {
    super();

    this.rehydrate({
      msg: ''
    });


    this.bindHandler(Actions.Test, this.handleTest);
  }
  dehydrate() {
    return this[DATA];
  }
  rehydrate(state) {
    this[DATA] = Im.fromJS(state);
  }

  get state() {
    return this[DATA];
  }

  handleTest(msg) {
    console.log('changed');
    this[DATA] = this[DATA].set('msg', msg);
    this.changed();
  }
}
