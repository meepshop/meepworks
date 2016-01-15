import React from 'react';
import { renderToString } from 'react-dom/server';

/**
 * @class Viewport
 * @description The default Viewport component
 * @property innerHTML
 */
export default class Viewport extends React.Component {
  render() {
    let innerHtml;

    if(this.props.children) {
      innerHtml = {
        __html: renderToString(this.props.children)
      };
    }
    return (
      <div
        id="viewport"
        dangerouslySetInnerHTML={innerHtml}
        />
    );
  }
}
