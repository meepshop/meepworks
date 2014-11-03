import React from 'react'; 

var HtmlPage = React.createClass({
  getDefaultProps: function () {
    return {
      title: '',
      metaData: [],
      scripts: [],
      style: [],
      body: null,
      setInnerHTML: ''
    };
  },
  render: function () {
  

    var body = (this.props.setInnerHTML ? <body dangerouslySetInnerHTML={{
      __html: this.props.setInnerHTML
    }}></body> : <body>{this.props.body}</body>);


    return <html>
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" charSet="UTF-8" />
        {this.props.metaData}
        <title>{this.props.title}</title>
        {this.props.styles}
        {this.props.scripts}
      </head>
        {body}
    </html>;
  }
});

export default HtmlPage;
