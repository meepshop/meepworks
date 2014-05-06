


var react = require('react');
var core = require('meepworks-core');
var progress = require('meepworks-progress');

var dom = react.DOM;
var propTypes = react.PropTypes;




var _uploader = module.exports = core.createClass({
    handleClick: function (e)
    {
        this.refs.input.getDOMNode().click();
    },
    handleFileSelect: function (e)
    {
        var files = this.refs.input.getDOMNode().files


    },
    render: function ()
    {
        return dom.div({
            onClick: this.handleClick
        }, 'Click or Drag to upload...',
        dom.input({
            ref: 'input',
            className: 'hide',
            type: 'file',
            onChange: this.handleFileSelect
        }));
    }
});

var _fileStat = _uploader.fileStat = core.createClass({
    getDefaultProps: function ()
    {
        return {

        };
    },

});
