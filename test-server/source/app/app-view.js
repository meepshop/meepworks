import React from 'react';
import Component from '../../../build/component';
import Link from '../../../build/link';

export default class AppView extends Component {
  render() {
    return (
      <div>
        <div>{ this.tmpl('hello') }</div>
        <div><Link to="/sub">Link to Sub</Link></div>
        {this.props.children}
      </div>
    );
  }
}

