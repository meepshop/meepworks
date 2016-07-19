import React from 'react';
import Component from '../../../build/component';
import './loader.css!';

export default class Loader extends Component {
  constructor(...args) {
    super(...args);
  }
  render() {
    return (
      <div className="loader">Loader
      </div>
    );
  }
}
