import React from 'react';
import Immutable from 'immutable';

import './style.css!';
import AppContainer from '../../lib/app-container';

//import Meepworks from '../../../dist/index';
//console.log('test', Meepworks);
var App = React.createClass({
  render: function () {
    /* jshint ignore:start */
    return <div id="app" style={{
        marginTop: 80
    }}>
      <div >Header Bar</div>
      This is the content of an App
    </div>;
    /*jshint ignore:end */
  }

});

App.init = function () {
    /* jshint ignore:start */
  React.render(<App></App>, document.body);
  /* jshint ignore:end */
};

export default App;


