import ActionBase from '../action-base';

const DETECT_INTL = Symbol();

export default class DetectIntl extends ActionBase {
  static get symbol() {
    return DETECT_INTL;
  }
  *action() {
    if(!global.Intl) {
      if(typeof window === 'undefined') {
        return {
          intl: require('intl')
        };
      } else {
        return {
          intl: yield System.import('intl')
        };
      }
    }
    return {
      intl: global.Intl
    };
  }
}
