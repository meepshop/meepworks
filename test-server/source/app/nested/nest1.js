import React from 'react';
import Locale from '../../../../dist/locale';
import path from 'path';


const lc = new Locale({
  path: path.resolve(__dirname, './locale'),
  locales: [
    'en-US',
    'zh-TW',
    'fr-FR'
  ]
});

const TIMEOUT_ID = Symbol();

lc.addOverride(lc);
lc.addOverride(lc);

class NestedApp1 extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      locale: lc.locale
    };
  }
  componentDidMount() {
    lc.on('change', this.handleChange);
    this[TIMEOUT_ID] = setTimeout(() => {
      this[TIMEOUT_ID] = null;
      lc.setLocale('fr-FR');
    }, 1000);
  }
  componentWillUnmount() {
    lc.off('change', this.handleChange);
    if(this[TIMEOUT_ID]) {
      clearTimeout(this[TIMEOUT_ID]);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    for(let s in this.state) {
      if(this.state[s] !== nextState[s]) {
        return true;
      }
    }
    return false;
  }
  handleChange() {
    this.setState({
      locale: lc.locale
    });
  }
  render () {
    return (
      <div>{ lc.format('content', {
        name: 'Jack'
      }) }<br />
      {
        lc.format('nokey')
      }<br />
      {
        lc.formatCurrency(1234.56, 'USD')
      }</div>
    );
  }
}

export default {
  component: NestedApp1
};

