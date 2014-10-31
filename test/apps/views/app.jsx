import React from 'react';

var App = React.createClass({
  render: function () {
    /* jshint ignore:start */
    return <div>Views</div>;
    /* jshint ignore:end */
  }
});
App.init = function () {
    /* jshint ignore:start */
  React.render(<App></App>, document.body);
    /* jshint ignore:end */
};  

export default App;
