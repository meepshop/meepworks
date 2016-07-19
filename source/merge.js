import extend from './extend'
/**
 * @exports merge
 * @function
 * @param {StyleDefinition} arguments
 *
 * Merges all the style definitions in the arguments to one resulting object.
 */
export default function merge(...args) {
  return extend({}, ...args)
}
