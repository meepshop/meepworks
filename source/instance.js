const _cache = new WeakMap()
/**
 * Use weak maps for instances so that instances can easily be gc'ed
 * if the key is the request object itself.
 *
 */

const _Ctx = Symbol()
/**
 * @class Instance
 *  simple implementation of instanced objects
 */
export default class Instance {

  /**
   * @function
   * @param {object} key - optional object to use as a key
   *  Symbol value does not work on IE.
   *
   * Function getInstance returns the singleton if no key is passed in.
   * If an object is passed in as the key, it returns an unique instance
   * identified only by the object. If the object key is gc'ed, the unique
   * instance will be gc'ed as well. Unless it is being held by another
   * reference.
   */
  static getInstance(key) {
    if (!_cache.has(this)) {
      _cache.set(this, new WeakMap())
    }
    const cache = _cache.get(this)

    if (key) {
      if (!cache.has(key)) {
        const inst = new this()

        cache.set(key, inst)
        // keep a reference to the key for destroy
        inst[_Ctx] = key
      }
      return cache.get(key)
    } else {
      if (!cache.has(this)) {
        const inst = new this()
        cache.set(this, inst)
      }
      return cache.get(this)
    }
  }

  get ctx() {
    return this[_Ctx]
  }

  /**
   * @function
   *
   * Remove the singleton from the internal cache.
   */
  destroy() {
    const cache = _cache.get(this.constructor)
    if (this[_Ctx]) {
      // use key to clear _cache
      if (cache.has(this[_Ctx])) {
        cache.delete(this[_Ctx])
      }
    } else {
      if (cache.has(this.constructor)) {
        cache.delete(this.constructor)
      }
    }
  }
}
