import React from 'react';
import Immutable from 'immutable';
import Page from 'page';

if(typeof window !== 'undefined') {
  window.Immutable = Immutable;
}

var mixin = {
  shouldComponentUpdate: function (nextProps) {
    if(nextProps.def === this.props.def) {
      console.log(this.props.def.get('type'), ': no update');
      return false;
    } else {
      console.log(this.props.def.get('type'), ': update');
      return true;
    }
  }
};



var App = React.createClass({
  mixins: [mixin],
  componentDidMount: function () {
    Page('/', function () {
      console.log('/');
    });
    //this.props.def.get('pages').forEach(function (page) {
    //  Page('/' + page.get('name'), function (){
    //    console.log(page.get('name'));
    //  });

    //});
    this.props.def.get('pages').forEach((page) => {
      Page('/' + page.get('name'), () => {
        console.log(page.get('name'));
      });
    });
    Page.start({
      dispatch: true
    });
  },
  render: function () {
    return <div>
      <div><a href='./test'>Test</a></div>
      <div></div>
    </div>;
  }
});

var Cp1 = React.createClass({
  mixins: [mixin],
  render: function () {
    return <div className="cp1">{this.props.def.get('content')}</div>;
  }
});

var Cp2 = React.createClass({
  mixins: [mixin],
  render: function () {
    window.test = this.props.def;
    return <div className="cp1">{this.props.def.get('content')}</div>;
  }
});

App.init = function () {
  var im = Immutable.fromJS({
    type: 'app',
    pages: [{
      name: 'index',
      component: Cp1,
      props: {
        type: 'cp1',
        content: 'In CP1'
      }
    }, {
      name: 'test',
      component: Cp2,
      props: {
        type: 'cp2',
        content: 'In CP2'
      }
    }
    ]
  });
  React.render(<App def={im}/>, document.body);
};
export default App; 
