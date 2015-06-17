import React from 'react';


/**
 *  @class HtmlPage
 *  @description Default Server Html Templates
 *  @property script {Array} Array of script elements to be rendered
 *  @property styles {Array} Array of stylesheet link elements to be rendered
 *  @property metas {Array} Array of meta elements to be rendered
 *  @property title {string} Title for the html page
 *  @property body {Component} Elements to be rendered in body tag
 *  @property innerHTML {string} Html string to be rendered. Will ignore body property if provided.
 *
 */
export default class HtmlPage extends React.Component {
  static get defaultProps() {
    return {
      scripts: [],
      styles: [],
      metas: [],
      title: null,
      body: null,
      innerHtml: void 0
    };
  }
  render() {
    return (
      <html>
        <head>
          <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
          <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
          {this.props.metas}
          <title>{this.props.title}</title>
          {this.props.styles}
          {this.props.scripts}
        </head>
        {this.props.innerHTML ? <body dangerouslySetInnerHTML={{__html: this.props.innerHTML}}></body> : <body>{this.props.body}</body>}
      </html>
    );
  }
}
