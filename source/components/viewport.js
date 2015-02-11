import React from 'react';

export default React.createClass({
  render() {
    if(this.props.innerHTML) {
      return <div
        id="viewport"
        dangerouslySetInnerHTML={{
          __html: this.props.innerHTML
        }}></div>;
    }
    return <div id="viewport"></div>;
  }
});
