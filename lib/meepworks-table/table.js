var react = require('react');
var core = require('meepworks-core');
var tip = require('meepworks-tip');


var dom = react.DOM;
var propTypes = react.PropTypes;

var _mixins = {
	
};

var _table = module.exports = core.createClass({
	getDefaultProps: function()
	{
		return {
			border: true,
			striped: false,
			hover: false,
			condense: false	 //default padding to 5px instead of 8px
		};
	},
	propTypes: {
		border: propTypes.bool,
		striped: propTypes.bool,
		hover: propTypes.bool,
		condense: propTypes.bool

	},
	render: function ()
	{
		var className = ['table'];
		if(this.props.border)
		{
			className.push('table-bordered');
		}
		if(this.props.striped)
		{
			className.push('table-striped');
		}
		if(this.props.hover)
		{
			className.push('table-hover');
		}
		if(this.props.condense)
		{
			className.push('table-condensed');
		}
		var props = {
			className: className.join(' '),
			children: this.props.children
		};
		return dom.table(props);
	}
});
