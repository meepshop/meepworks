import React from 'react';
import Component from '../../../build/component';

export default class AppView extends Component {
  render() {
    return (
      <div>
        <div>{ this.tmpl('hello') }</div>
        {this.props.children}
      </div>
    );
  }
}

