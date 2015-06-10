import ActionBase from '../../../build/action-base';

export class Test extends ActionBase {
  *action (msg) {
    yield new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
    return msg;
  }
}
