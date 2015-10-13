import React from 'react';
import Component from '../../../build/component';
import Link from '../../../build/link';

import './test.css!';

export default class SubView extends Component {
  render() {
    return (
      <div>
        <div>{ this.tmpl('sub') }</div>
        <ul>
          <li>
            <Link to="/sub/child1" >Child 1</Link>
          </li>
          <li>
            <Link to="/sub/child2" >Child 2</Link>
          </li>
          </ul>
          {this.props.children}
        <Link to="/">Back</Link>
      </div>
    );
  }
}

