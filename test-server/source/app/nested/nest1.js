import React from 'react';
import Locale from '../../../../dist/locale';
import path from 'path';
import {ReplaceState, Back} from '../../../../dist/actions/page-actions';

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

class NestedApp1 extends React.Component {
  static lc() {
    return lc;
  }
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      locale: lc.locale
    };
  }
  componentDidMount() {
    lc.subscribe(this.handleChange);
    this[TIMEOUT_ID] = setTimeout(() => {
      this[TIMEOUT_ID] = null;
      lc.setLocale('fr-FR');
    }, 5000);
  }
  componentWillUnmount() {
    lc.unsubscribe(this.handleChange);
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
      <div> Locale: {lc.locale}
        <br />
        { lc.format('content', {
        name: 'Jack'
      }) }<br />
      {
        lc.format('nokey')
      }<br />
      {
        Locale.formatCurrency(1234.56, 'USD')
      }<br />
      {
        Locale.formatDateTime(new Date())
      }<br />
      <div onClick={()=> {
        new Back().exec();
      }}>Return to modules</div>
      </div>
    );
  }
}

export default {
  component: NestedApp1
};


