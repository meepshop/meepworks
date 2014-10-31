import React from 'react';
import Immutable from 'immutable';


var AppContainer = React.createClass({
  getDefaultProps: function () {
    return  {
      app: null
    };
  },
  render: function () {
    /* jshint ignore:start */
    return <div>
      {this.props.app}
    </div>;
    /* jshint ignore:end */
  }
});
/*
// how do we utilize immutable?
//
   {

  }


*/

export default AppContainer;
