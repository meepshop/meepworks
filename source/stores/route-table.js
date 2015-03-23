import StoreBase from '../store-base';
import Im from 'immutable';
import SetRoutes from '../actions/set-routes';


const DATA = Symbol();

export default class RouteTable extends StoreBase {
  constructor() {
    this.rehydrate({
        routes: {},
        srcRoot: '/',
        driver: null
    });
  }
  get handlers() {
    return [ {
      action: SetRoutes,
      handler: this.handleSetRoutes
    }];
  }
  handleSetRoutes(payload) {
    this[DATA] = this[DATA].withMutations((map) => {
      map
        .set('routes', Im.fromJS(payload.routes))
        .set('srcRoot', payload.srcRoot);
    });
  }
  rehydrate(state) {
    if(state) {
      this[DATA] = Im.fromJS(state);
    }
  }
  dehydrate() {
    return this[DATA].toJS();
  }
  getRoutes() {
    return this[DATA].get('routes').toJS();
  }
  getSrcRoot() {
    return this[DATA].get('srcRoot');
  }
}
