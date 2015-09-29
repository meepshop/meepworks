import React from 'react';
import Component from '../../../build/component';
import Link from '../../../build/link';

export default class SubView extends Component {
  render() {
    return (
      <div>
        <div>{ this.tmpl('sub') }</div>
        <Link to="/">Back</Link>
      </div>
    );
  }
}

