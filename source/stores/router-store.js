import StoreBase from '../store-base';
import Immutable from 'immutable';
import debug from 'debug';
import { NAVIGATE } from '../actions/navigate';
import { SET_COMPONENTS } from '../actions/set-components';

const log = debug('router-store');

const DATA_KEY = Symbol();

export default class RouterStore extends StoreBase {
  constructor(initialState) {
    if (!initialState) {
      initialState = {
        title: '',
        params: null,
        route: '',
        url: ''
      };
    }
    this.rehydrate(initialState);
  }

  get handlers() {
    return [{
      action: NAVIGATE,
      handler: this.handleNavigate
    }, {
      action: SET_COMPONENTS,
      handler: this.handleSetComponents
    }];
  }
  handleNavigate(route) {
    log('handleNavigate', route);
    this[DATA_KEY] = this[DATA_KEY].withMutations((map) => {
      map
        .set('title', route.title)
        .set('params', Immutable.fromJS(route.params))
        .set('route', route.route)
        .set('url', route.url)
        .set('components', Immutable.fromJS(route.components));
    });
    this.emit('change');
    log('Navigated');

  }
  handleSetComponents(comps) {
    log('handleSetComponents', comps);
    this[DATA_KEY] = this[DATA_KEY].set('components', Immutable.fromJS(comps));
  }

  rehydrate(state) {
    if (state) {
      state.components = [];
      this[DATA_KEY] = Immutable.fromJS(state);
    }
  }
  dehydrate() {
    let res = this[DATA_KEY].toJS();
    delete res.components;
    return res;
  }

  getChildComponent(comp) {
    var res = null;
    for (var i = 0, len = this[DATA_KEY].get('components').size - 1; i < len; i++) {
      if (comp === this[DATA_KEY].getIn(['components', i])) {
        res = this[DATA_KEY].getIn(['components', i + 1]);
        break;
      }
    }
    return res;
  }
  getRootComponent() {
    return this[DATA_KEY].getIn(['components', 0]);
  }
  getTitle() {
    return this[DATA_KEY].get('title');
  }
  getRoute() {
    return this[DATA_KEY].get('route');
  }
  getUrl() {
    return this[DATA_KEY].get('url');
  }
  static getState() {
    return this.getInstance()[DATA_KEY];
  }
}
