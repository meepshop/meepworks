import Instance from './Instance'
import Emitter from 'component-emitter'
import Dispatcher from '../../core/dispatch/dispatcher'

import { isFunction } from '../../utils/type-checker'
import { warning } from '../../warning/type-error-log'

const _ActionHandler = Symbol()
const _Emitter = Symbol()
const _Registered = Symbol()
const _Symbols = Symbol()
const _Ctx = Symbol()


/**
 * @exports default
 * @class StoreBase
 * @extends Instance
 * @extends Emitter
 *    Base store class for implementing data stores.
 */
export default class Store extends Instance {
  constructor() {
    super()
    this[_Emitter] = new Emitter()
    this[_Symbols] = new Map()

    // bind main action handler with bounded this in the scope
    this[_ActionHandler] = (payload) => {
      // run the actual action handlers using the action as the accessor
      const s = this[_Symbols].get(payload.action)
      if (typeof this[s] === 'function') {
        this[s](payload.payload)
      }
    }
  }

  bindHandler(action, handler) {
    if (!this[_Symbols].has(action)) {
      this[_Symbols].set(action, Symbol())
    }
    this[this[_Symbols].get(action)] = handler
  }

  static getInstance(ctx) {
    const self = super.getInstance(ctx)

    if (!self[_Registered]) {
      if (!ctx.init && ctx.storeData) {
        // rehydrate data if ctx has not been initialized
        self.rehydrate(ctx.storeData)
      }
      ctx.stores.add(self)
      Dispatcher.getInstance(ctx).register(self, self[_ActionHandler])
      self[_Ctx] = ctx
      self[_Registered] = true
    }
    return self
  }

  /**
   * @function
   *  Returns the current state in JS object form.
   */
  dehydrate() {}
  /**
   * @function
   *  @param {Object} state - The state object to fill into the data store.
   *  Fill the data store with the state object, the underlying data is immutable.
   */
  rehydrate() {}

  changed() {
    this[_Emitter].emit('change')
  }
  on(fn) {
    if (!isFunction(fn)) warning(`error on ${fn}, listener must be [Function] type.`)
    this[_Emitter].on('change', fn)
  }
  off(fn) {
    if (!isFunction(fn)) warning(`error on ${fn}, listener must be [Function] type.`)
    this[_Emitter].off('change', fn)
  }
  get ctx() {
    return this[_Ctx]
  }
}
