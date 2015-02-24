"use strict";

System.register(["babel-runtime/helpers", "babel-runtime/core-js", "react", "../dist/action-base", "../dist/store-base"], function (_export) {
  var _babelHelpers, _core, React, ActionBase, StoreBase, Modules, UPDATE_TIME, UpdateTime, TimeStore;

  return {
    setters: [function (_babelRuntimeHelpers) {
      _babelHelpers = _babelRuntimeHelpers["default"];
    }, function (_babelRuntimeCoreJs) {
      _core = _babelRuntimeCoreJs["default"];
    }, function (_react) {
      React = _react["default"];
    }, function (_distActionBase) {
      ActionBase = _distActionBase["default"];
    }, function (_distStoreBase) {
      StoreBase = _distStoreBase["default"];
    }],
    execute: function () {
      Modules = React.createClass({
        displayName: "Modules",

        render: function render() {
          console.log(TimeStore.getInstance().now);
          return React.createElement(
            "div",
            null,
            TimeStore.getInstance().now
          );
        }
      });
      UPDATE_TIME = _core.Symbol();

      UpdateTime = (function (ActionBase) {
        function UpdateTime() {
          _babelHelpers.classCallCheck(this, UpdateTime);

          if (ActionBase != null) {
            ActionBase.apply(this, arguments);
          }
        }

        _babelHelpers.inherits(UpdateTime, ActionBase);

        _babelHelpers.prototypeProperties(UpdateTime, null, {
          symbol: {
            get: function () {
              return UPDATE_TIME;
            },
            configurable: true
          },
          action: {
            value: function action(payload) {
              return _core.Promise.resolve(new Date().toString());
            },
            writable: true,
            configurable: true
          }
        });

        return UpdateTime;
      })(ActionBase);

      TimeStore = (function (StoreBase) {
        function TimeStore() {
          _babelHelpers.classCallCheck(this, TimeStore);

          this.time = new Date().toString();
        }

        _babelHelpers.inherits(TimeStore, StoreBase);

        _babelHelpers.prototypeProperties(TimeStore, null, {
          handlers: {
            get: function () {
              return [{
                action: UPDATE_TIME,
                handler: this.handleUpdateTime
              }];
            },
            configurable: true
          },
          handleUpdateTime: {
            value: function handleUpdateTime(payload) {
              this.time = payload;
              this.emit("change");
            },
            writable: true,
            configurable: true
          },
          dehydrate: {
            value: function dehydrate() {
              return this.time;
            },
            writable: true,
            configurable: true
          },
          rehydrate: {
            value: function rehydrate(time) {
              this.time = time;
            },
            writable: true,
            configurable: true
          },
          now: {
            get: function () {
              return this.time;
            },
            configurable: true
          }
        });

        return TimeStore;
      })(StoreBase);

      _export("default", {
        component: Modules,
        stores: [TimeStore]
      });
    }
  };
});

//# sourceMappingURL=./modules.js.map