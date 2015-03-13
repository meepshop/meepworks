import ActionBase from '../../../../dist/action-base';

const ROUTE_CHANGE = Symbol();

export default class RouteChange extends ActionBase {
  get symbol() {
    return ROUTE_CHANGE;
  }
  static get symbol() {
    return ROUTE_CHANGE;
  }
  *action(route) {
    return route;
  }
}

