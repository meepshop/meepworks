var react = require('react');
var core = require('meepworks-core');
var dom = react.DOM;

var meepApp = module.exports = core.createClass({
	getDefaultProps: function()
	{
		return {
			header: null,
			fixedHeader: false,
			body: null
		};
	},
	render: function ()
	{
		return dom.div({
			className: 'content-app' + (this.props.fixedHeader ? ' fixed-header': ''),
			children: [
				this.props.header,
				this.props.body
			]
		});
	}
});


var appHeader = meepApp.header = core.createClass({
	getDefaultProps: function()
	{
		return {
			content: null
		}
	},
	render: function ()
	{
		return dom.div({
			className: 'app-header',
			children: this.props.content
		});
	}
});

var appBody = meepApp.body = core.createClass({
	render: function ()
	{
		return dom.div({
			className: 'app-body',
			children: this.props.content
		});
	}
});