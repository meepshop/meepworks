import React from 'react';
import Locale from '../../../../dist/locale';
import path from 'path';


const lc = new Locale({
  path: path.resolve(__dirname, './locale'),
  locales: [
    'en-US',
    'zh-TW'
  ]
});

lc.addOverride(lc);
lc.addOverride(lc);

class NestedApp1 extends React.Component {
  render () {
    return (
      <div>{ lc.format('content', {
        name: 'Jack'
      }) }<br />
      {
        lc.format('nokey')
      }</div>
    );
  }
}

export default {
  component: NestedApp1
};

