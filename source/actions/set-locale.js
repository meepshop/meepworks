import ActionBase from '../action-base';

export default class SetLocale extends ActionBase {
  *action(l) {
    return l;
  }
}
