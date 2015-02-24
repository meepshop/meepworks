"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var React = _babelHelpers.interopRequire(require("react"));

var RouterStore = _babelHelpers.interopRequire(require("../dist/stores/router-store"));

var App = React.createClass({
  displayName: "App",

  render: function render() {
    var Content = RouterStore.getInstance().getChildComponent(App);

    console.log("###", Content);
    if (!Content) {
      Content = Home;
    }

    return React.createElement(
      "div",
      null,
      React.createElement(
        "a",
        { href: "/" },
        "Home"
      ),
      React.createElement("br", null),
      React.createElement(
        "a",
        { href: "/modules" },
        "Modules"
      ),
      React.createElement("br", null),
      React.createElement(Content, null)
    );
  }
});

var Home = React.createClass({
  displayName: "Home",

  render: function render() {
    return React.createElement(
      "div",
      null,
      "Welcome to Meepworks!"
    );
  }
});
module.exports = {
  component: App,
  routes: {
    "/": {
      name: "Home",
      title: "Meepworks"
    },
    "/modules": {
      name: "Modules",
      app: "./modules",
      title: "Modules"
    }
  }
};

//# sourceMappingURL=./app.js.map