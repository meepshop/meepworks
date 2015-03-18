import ActionBase from '../action-base';

const EXPOSE_CONTEXT = Symbol();

/**
 * @default
 * @class ExposeContext
 * @extends ActionBase
 * Exposes the koa request context
 */
export default class ExposeContext extends ActionBase {
  static get symbol() {
    return EXPOSE_CONTEXT;
  }
  *action(ctx) {
    return ctx;
  }
}
