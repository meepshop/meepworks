import ActionBase from '../action-base';

export default class SetRoutes extends ActionBase {
  *action(routes) {
    return routes;
  }
}
