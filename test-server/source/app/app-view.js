import React from 'react';
import Component from '../../../build/component';

export default class AppView extends Component {
  render() {
    return (
      <div>{ this.tmpl('hello') }
      </div>
    );
  }
}

