import StoreBase from '../store-base';
import Im from 'immutable';
import debug from 'debug';
import {SET_ROUTES} from '../actions/set-routes';

const log = debug('route-table');

const KEY = Symbol();

export default class RouteTable extends StoreBase {
  constructor() {
    this.rehydrate({
        routes: {},
        srcRoot: '/'
    });
  }
  get handlers() {
    return [ {
      action: SET_ROUTES,
      handler: this.handleSetRoutes
    }];
  }
  handleSetRoutes(payload) {
    log('handleSetRoutes', payload);
    this[KEY] = this[KEY].withMutations((map) => {
      map
        .set('routes', Im.fromJS(payload.routes))
        .set('srcRoot', payload.srcRoot);
    });
  }
  rehydrate(state) {
    if(state) {
      this[KEY] = Im.fromJS(state);
    }
  }
  dehydrate() {
    return this[KEY].toJS();
  }
  getRoutes() {
    return this[KEY].get('routes').toJS();
  }
  getSrcRoot() {
    return this[KEY].get('srcRoot');
  }
}
