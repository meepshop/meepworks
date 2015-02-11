import ActionBase from '../action-base';

export const SET_ROUTES = Symbol();
export default class SetRoutes extends ActionBase {
  get symbol() {
    return SET_ROUTES;
  }
  *action(routes) {
    return routes;
  }
}
