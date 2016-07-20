import Flux from 'flux'
import Instance from '../../core/class/Instance'

const _DispatchToken = Symbol()
const _Dispatcher = Symbol()
/**
 * @exports default
 * @class Dispatcher
 *    Wraps Flux.Dispatcher to provide instanced
 *    dispatcher.
 */
export default class Dispatcher extends Instance {
  constructor() {
    super()
    this[_Dispatcher] = new Flux.Dispatcher()
  }
  /**
   * @function
   * @param {StoreBase} store - store to be registered
   */

  register(store, fn) {
    store[_DispatchToken] = this[_Dispatcher].register(fn)
  }
  /**
   *  @function
   *  @param {StoreBase} store - store to be unregistered
   */
  unregister(store) {
    this[_Dispatcher].unregister(store[_DispatchToken])
  }

  /**
   *  @function
   *  @param {Array<StoreBase>} stores - array of stores to wait for.
   */
  waitFor(stores) {
    if (!Array.isArray(stores)) {
      stores = [ stores ]
    }
    this[_Dispatcher].waitFor(stores.map(s => s[_DispatchToken]))
  }

  dispatch(payload) {
    this[_Dispatcher].dispatch(payload)
  }
  isDispatching() {
    return this[_Dispatcher].isDispatching()
  }
}
