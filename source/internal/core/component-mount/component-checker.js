import {
  isFunction
} from '../../utils/type-checker'

import {
  warning
} from '../../warning/type-error-log'

/**
 * meepworks-component-checker
 *
 * @param {Function} component
 * @param {Function} callback
 * @returns void 0
 */
export default function component_checker(component, callback) {
  if (!isFunction(component) & component !== undefined) {
    warning(`component support only function, but got the ${typeof component}, please checkout your component type`)
    return void 0
  }
  try {
    callback(null, component)
  } catch (err) {
    warning(err)
  }

  return void 0
}
