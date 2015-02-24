"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var React = _babelHelpers.interopRequire(require("react"));

var ActionBase = _babelHelpers.interopRequire(require("../dist/action-base"));

var StoreBase = _babelHelpers.interopRequire(require("../dist/store-base"));

var Modules = React.createClass({
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

var UPDATE_TIME = _core.Symbol();

var UpdateTime = (function (ActionBase) {
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

var TimeStore = (function (StoreBase) {
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

module.exports = {
  component: Modules,
  stores: [TimeStore]
};

//# sourceMappingURL=./modules.js.map