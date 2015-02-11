import ActionBase from '../action-base';

export const SET_COMPONENTS = Symbol();

export default class SetComponents extends ActionBase {
  get symbol() {
    return SET_COMPONENTS;
  }
  *action (comps) {
    return comps;
  }
}
