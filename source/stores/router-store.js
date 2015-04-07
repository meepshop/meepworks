import StoreBase from '../store-base';
import Immutable from 'immutable';
import Navigate from '../actions/navigate';
import SetComponents from '../actions/set-components';
import SetApproot from '../actions/set-approot';

const DATA = Symbol();

export default class RouterStore extends StoreBase {
  constructor() {
    super();
    let state = {
        title: '',
        params: null,
        route: '',
        url: '',
        root: ''
      };
    this.rehydrate(state);
  }

  get handlers() {
    return [{
      action: Navigate,
      handler: this.handleNavigate
    }, {
      action: SetComponents,
      handler: this.handleSetComponents
    }, {
      action: SetApproot,
      handler: this.handleSetApproot
    }];
  }
  handleSetApproot(root) {
    console.log(root);
    if(root[root.length -1] === '/') {
      root = root.substr(0, root.length - 1);
    }
    this[DATA] = this[DATA].set('root', root);
    this.emit('change');
  }
  handleNavigate(route) {
    this[DATA] = this[DATA].withMutations((map) => {
      map
        .set('title', route.title)
        .set('params', Immutable.fromJS(route.params))
        .set('route', route.route)
        .set('url', route.url)
        .set('components', Immutable.fromJS(route.components));
    });
    this.emit('change');

  }
  handleSetComponents(comps) {
    this[DATA] = this[DATA].set('components', Immutable.fromJS(comps));
  }

  rehydrate(state) {
    if (state) {
      state.components = [];
      this[DATA] = Immutable.fromJS(state);
    }
  }
  dehydrate() {
    let res = this[DATA].toJS();
    delete res.components;
    return res;
  }

  static getChildComponent(comp) {
    return this.getInstance().getChildComponent(comp);
  }
  getChildComponent(comp) {
    var res = null;
    for (var i = 0, len = this[DATA].get('components').size - 1; i < len; i++) {
      if (comp === this[DATA].getIn(['components', i])) {
        res = this[DATA].getIn(['components', i + 1]);
        break;
      }
    }
    return res;
  }
  getRootComponent() {
    return this[DATA].getIn(['components', 0]);
  }
  static getRootComponent() {
    return this.getInstance().getRootComponent();
  }
  static get rootComponent() {
    return this.getInstance().rootComponent;
  }
  get rootComponent() {
    return this[DATA].getIn(['components', 0]);
  }

  getTitle() {
    return this[DATA].get('title');
  }
  static getTitle() {
    return this.getInstance()[DATA].get('title');
  }

  static get title() {
    return this.getInstance().title;
  }
  get title() {
    return this[DATA].get('title');
  }

  getRoute() {
    return this[DATA].get('route');
  }
  static getRoute() {
    return this.getInstance()[DATA].get('route');
  }

  static get route() {
    return this.getInstance().route;
  }
  get route() {
    return this[DATA].get('route');
  }


  getUrl() {
    return this[DATA].get('url');
  }
  static getUrl() {
    return this.getInstance()[DATA].get('url');
  }
  static get url() {
    return this.getInstance().url;
  }
  get url() {
    return this[DATA].get('url');
  }


  getState() {
    return this[DATA];
  }
  static getState() {
    return this.getInstance()[DATA];
  }
  static get state() {
    return this.getInstance()[DATA];
  }
  get state() {
    return this[DATA];
  }

  static get rootUrl() {
    return this.getInstance().rootUrl;
  }
  get rootUrl() {
    return this[DATA].get('root');
  }
}
