var core = require('meepworks-core');
var react = require('react');
var dom = react.DOM;

var moduleHolder = module.exports = core.createClass({
	getDefaultProps: function ()
	{
		return {
			title: null,
			module: null
		}
	},
	render: function ()
	{
		return dom.div({
			className: 'content-module fixed-header',
			children: getModuleContent.call(this)
		});
	}
});


function getModuleContent()
{
	var content = [];
	if(this.props.title)
	{
		content.push(moduleTitle({
			title: this.props.title
		}));
	}
	content.push(dom.div({
		className: 'module-body',
		children: this.props.module
	}));

	return content;

}

var moduleTitle = moduleHolder.title = core.createClass({
	getDefaultProps: function ()
	{
		return {
			title: null,
		};
	},	
	render: function ()
	{
		return dom.div({
			key: 'module-header',
			className: 'module-header',
			children: dom.h3({
				className: 'module-title',
				children: this.props.title
			})
		});
	}
});