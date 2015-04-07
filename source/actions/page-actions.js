import ActionBase from '../action-base';

export class Goto extends ActionBase {
  *action(p) {
    if(this.ctx) {
      throw new Error('Goto can only be used on the client side');
    }
    let page = yield System.import('page');
    page(p);
  }
}

export class Back extends ActionBase {
  *action(p) {
    if(this.ctx) {
      throw new Error('Back can only be used on the client side');
    }
    history.back();
  }
}

export class Forward extends ActionBase {
  *action(p) {
    if(this.ctx) {
      throw new Error('Forward can only be used on the client side');
    }
    history.forward();
  }
}
