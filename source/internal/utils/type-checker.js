/**
 * meepworks-type-checker { Function }
 *
 * @param {Function} fn
 * @returns void 0
 */
export function isFunction(fn) {
  return typeof fn === 'function'
}

/**
 * meepworks-type-checker { Object }
 *
 * @param {Object} obj
 * @returns void 0
 */
export function isObject(obj) {
  return typeof obj === 'object'
}


/**
 * meepworks-type-checker { Array }
 *
 * @param {Array} arr
 * @returns void 0
 */
export function isArray(arr) {
  const toString = {}.toString
  return Array.isArray(arr) || toString.call(arr) === '[object Array]'
}

/**
 * meepworks-type-checker { client }
 *
 * @param void 0
 * @returns void 0
 */
export function isClient() {
  return typeof window !== undefined
}
