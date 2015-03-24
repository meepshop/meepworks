import ActionBase from '../action-base';
export default class DetectIntl extends ActionBase {
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
