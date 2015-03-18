import ActionBase from '../action-base';

const SET_ROUTES = Symbol();
export default class SetRoutes extends ActionBase {
  static get symbol() {
    return SET_ROUTES;
  }
  *action(routes) {
    return routes;
  }
}
