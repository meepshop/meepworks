import ActionBase from '../action-base';

export default class SetComponents extends ActionBase {
  *action (comps) {
    return comps;
  }
}
