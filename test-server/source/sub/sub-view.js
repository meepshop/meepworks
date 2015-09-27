import React from 'react';
import Component from '../../../build/component';

export default class SubView extends Component {
  render() {
    return (
      <div>{ this.tmpl('sub') }
      </div>
    );
  }
}

