/* eslint no-console: 0 */

/**
 * meepworks-warning
 *
 * @param {String} message
 * @param {Function} callback - block the function when callback funtion was call
 * @returns void 0
 */
export function warning(message, callback) {
  if (typeof console !== undefined && typeof console.error === 'function') {
    console.error(message)
    if (callback) callback()
    return false
  }
  try {
    throw new Error(message)
  } catch (err) { throw new Error(err) }
}
