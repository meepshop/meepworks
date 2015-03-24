import ActionBase from '../action-base';


/**
 * @default
 * @class ExposeContext
 * @extends ActionBase
 * Exposes the koa request context
 */
export default class ExposeContext extends ActionBase {
  *action(ctx) {
    return ctx;
  }
}
