import React from 'react';
import RouterStore from '../stores/router-store';

export default React.createClass({
  getDefaultProps() {
    return {
      scripts: [],
      styles: [],
      metas: [],
      body: null,
      setHtml: false
    };
  },
  render() {
    return <html>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
        {this.props.metas}
        <title>{RouterStore.getInstance().getTitle()}</title>
        {this.props.styles}
        {this.props.scripts}
      </head>
      {
        this.props.setHtml ? <body dangerouslySetInnerHTML={{__html: this.props.body}}></body> : <body>{this.props.body}</body>
      }
    </html>;
  }
});
