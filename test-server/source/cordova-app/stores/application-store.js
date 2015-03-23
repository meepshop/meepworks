import StoreBase from '../../../../dist/store-base';
import RouteChange from '../actions/route-change';
import Im from 'immutable';

var obj = new Im.Map();
obj = obj.set('field1', true);

const DATA = Symbol();

export default class ApplicationStore extends StoreBase {
  constructor() {
    this[DATA] = new Im.Map({
      route: '/'
    });
  }
  get handlers() {
    return [{
      action: RouteChange,
      handler: this.handleRouteChange
    }];
  }
  handleRouteChange(route) {
    this[DATA] = this[DATA].set('route', route);
    this.emit('change');
  }
  get route() {
    return this[DATA].get('route');
  }
  get state() {
    return this[DATA];
  }
}

