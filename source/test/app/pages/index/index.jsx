import React from 'react';
import Immutable from 'immutable';

if(typeof window !== 'undefined') {
  window.immutable = Immutable;
}

var App = React.createClass({
  render: function () {
    return <div>Index Page</div>;
  }
  });


export default App; 
