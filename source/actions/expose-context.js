import ActionBase from '../action-base';

export const EXPOSE_CONTEXT = Symbol();

export default class ExposeContext extends ActionBase {
  get symbol() {
    return EXPOSE_CONTEXT;
  }
  action(ctx) {
    return Promise.resolve(ctx);
  }
}
