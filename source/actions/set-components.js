import ActionBase from '../action-base';

const SET_COMPONENTS = Symbol();

export default class SetComponents extends ActionBase {
  static get symbol() {
    return SET_COMPONENTS;
  }
  *action (comps) {
    return comps;
  }
}
