/**
 * Inspired by CSS in JS talk.
 * Add function support to style definations.
 *
 * Experimental
 *
 * Uses:
 * function transition(props) {
 *  return {
 *    transition: props,
 *    webkitTransition: Props
 *  };
 * }
 *
 * var styles = new Styles({
 *  base: {
 *    width: '100%',
 *    height: '100%'
 *  },
 *  panel: {
 *    backgroundColor: 'lightgray'
 *  },
 *  animated: {
 *    transition: transition('all 0.3s ease-in-out')
 *  }
 * });
 *
 * var Panel = React.createClass( {
 *  render() {
 *    return <div
 *      className="panel"
 *      style={merge(
 *        styles.base,
 *        styles.panel,
 *        this.props.animated && styles.animated
 *      )} >
 *        {this.props.content}
 *      </div>;
 *  }
 * });
 *
 */

/**
 *  @exports default
 *  @class StyleMap - Represents a map of style definations.
 */
export default class StyleMap {
  /**
   *  @constructor
   *  @param {Object} map - A map of style definitions.
   */
  constructor (map) {
    for(var name in map) {
      if(typeof map[name] === 'object') {
        this[name] = new Style(map[name]);
      }
    }

  }
}

/**
 * @class Style - Represent a style definination.
 */
class Style {
  /**
   * @constructor
   * @param {Object} def - The css style definition in object literal form.
   */
  constructor(def) {
    traverseDefinition.call(this, def);
  }
}

function traverseDefinition(def) {
  for(var prop in def) {
    if(typeof def[prop] === 'object') {
      //Any nested object should be treated as style definitions returned by
      //functions, and merged into this definition.
      traverseDefinition.call(this, def[prop]);
    } else {
      this[prop] = def[prop];
    }
  }
}




/**
 * @exports merge
 * @function
 * @param {StyleDefinition} arguments
 *
 * Merges all the style definitions in the arguments to one resulting object.
 */
export function merge() {
  var res = {};
  Object.assign(res, ...arguments);
  return res;
}

