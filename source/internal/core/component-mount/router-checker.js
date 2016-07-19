import {
  isArray
} from '../../utils/type-checker'

import {
  warning
} from '../../warning/type-error-log'

/**
 * meepworks-router-checker
 *
 * @param {Array} router
 * @param {Function} callback
 * @returns void 0
 */
export default function router_checker(router, callback) {
  if (!isArray(router) & router !== undefined) {
    warning(`router support only array, but got the ${typeof router}, please checkout your router type`)
    return void 0
  }

  try {
    callback(null, router)
  } catch (err) {
    warning(err)
  }
  return void 0
}
