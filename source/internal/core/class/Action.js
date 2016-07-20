const _Payload = Symbol()
const _Ctx = Symbol()


/**
 *  @exports default
 *  @class ActionBase
 *    Base class for actions
 */
export default class Action {
  /**
   * @constructor
   * @param {any} payload - parameter passed into the action handler
   */
  constructor(payload) {
    this[_Payload] = payload
  }
  /**
   * @function
   *
   */
  async action() {
    // allow actions to be used as events by defaulting to resolved promise
    return this[_Payload]
  }

  get payload() {
    return this[_Payload]
  }
  get ctx() {
    return this[_Ctx]
  }
  set ctx(ctx) {
    this[_Ctx] = ctx
  }
}
