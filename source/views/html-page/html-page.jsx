import React from 'react'; 

var HtmlPage = React.createClass({
  getDefaultProps: function () {
    return {
      title: '',
      metaData: [],
      scripts: [],
      style: [],
      body: null
    };
  },
  render: function () {
  
    /* jshint ignore:start */
    return <html>
      <head>

        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" charSet="UTF-8" />
        {this.props.metaData}
        <title>{this.props.title}</title>
        {this.props.styles}
        {this.props.scripts}
      </head>
      <body>
        {this.props.body}
      </body>
    </html>;
    /* jshint ignore:end */
  }
});

module.exports = HtmlPage;
