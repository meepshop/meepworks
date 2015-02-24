"use strict";

System.register(["react", "../dist/stores/router-store"], function (_export) {
  var React, RouterStore, App, Home;
  return {
    setters: [function (_react) {
      React = _react["default"];
    }, function (_distStoresRouterStore) {
      RouterStore = _distStoresRouterStore["default"];
    }],
    execute: function () {
      App = React.createClass({
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
      Home = React.createClass({
        displayName: "Home",

        render: function render() {
          return React.createElement(
            "div",
            null,
            "Welcome to Meepworks!"
          );
        }
      });

      _export("default", {
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
      });
    }
  };
});

//# sourceMappingURL=./app.js.map