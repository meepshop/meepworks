
"use strict";
var react = require('react');
var core = require('meepworks-core');
var tip = require('meepworks-tip');
var input = require('meepworks-input');

var dom = react.DOM;
var animate = react.addons.CSSTransitionGroup;

var form = module.exports = {};

var mixins =  {
	genericRender: {
		render: function ()
		{
			var props = {
				children: [
				(this.props.label !== null ? 
					_controlLabel({
						htmlFor: this.props.name,
						children: this.props.label
					}) : null),
				_controlContainer({
					children: [
					_getInputElement.call(this),
					(this.props.tooltip && this.props.alwaysShowTooltip ?
						dom.span({
							className: 'help-block',
							children: this.props.tooltip
						}): null
						)
					]
				})
				]
			};

			if(this.props.tooltip && !this.props.alwaysShowTooltip)
			{
				tip.copyProps.call(this, props);
			}
			return _formGroup(props);
		}
	}
};

var textfield  = form.textfield = core.createClass({
	mixins: [
	tip.mixin,
	mixins.genericRender
	],
	inputType: 'text'
});
var passwordfield = form.passwordfield = core.createClass({
	mixins: [
	tip.mixin,
	mixins.genericRender
	],
	inputType: 'password'
});
var selectfield = form.selectfield = core.createClass({
	mixins: [
	tip.mixin,
	input.mixins.options,
	mixins.genericRender
	],
	inputType: 'select'
});
var staticfield = form.staticfield = core.createClass({
	mixins: [
	tip.mixin,
	mixins.genericRender
	],
	inputType: 'static'
});

var checkboxset = form.checkboxset = core.createClass({
	mixins: [ 
	input.mixins.options,
	tip.mixin,
	mixins.genericRender
	],
	inputType: 'checkbox'
});

var radioset = form.radioset = core.createClass({
	mixins: [
	input.mixins.options,
	tip.mixin,
	mixins.genericRender
	],
	inputType: 'radio'
});

var textarea = form.textarea = core.createClass({
	mixins: [
	tip.mixin,
	mixins.genericRender
	],
	inputType: 'textarea'
});

var tagfield = form.tagfield = core.createClass({
	mixins: [
	tip.mixin,
	mixins.genericRender
	],
	inputType: 'tag'
});

var form = form.form = core.createClass({
	render: function ()
	{
		return dom.div({
			className: 'form-horizontal',
			children: this.props.children
		});
	}
});

var _formGroup = core.createClass({
	mixins:[tip.mixin],
	render: function ()
	{
		var props = {
			className: 'form-group',
			children: [this.props.children]
		};
		if(this.props.tooltip)
		{
			props.children.push(tip.attach.call(this, props));
		}
		return dom.div(props);
	}
});

var _controlLabel = core.createClass({
	getDefaultProps: function ()
	{
		return {
			htmlFor: null
		};
	},
	render: function ()
	{
		return dom.label({
			htmlFor: this.props.htmlFor,
			className: 'col-sm-2 control-label',
			children: this.props.children
		});
	}
});
var _controlContainer = core.createClass({
	render: function ()
	{
		var props = {
			className: 'col-sm-10',
			children: [this.props.children]
		};
		return dom.div(props);
	}
});

var _getInputElement = function ()
{
	var className = ['form-control'];

	switch(this.inputType)
	{
		case 'text':
		case 'password':
		case 'textarea':
		if(this.props.size)
		{
			className.push('input-'+this.props.size);
		}
		return input[this.inputType]({
			name: this.props.name,
			placeholder: this.props.placeholder,
			className: className.join(' '),
			initialValue: this.props.initialValue,
			disabled: this.props.disabled
		});
		break;
		case 'tag':
		return input.tag({
			id: this.props.id,
			placeholder: this.props.placeholder,
			className: className.join(' '),
			value: this.props.value,
			disabled: this.props.disabled,
			multi: this.props.multi
		});
		break;
		case 'select':
		if(this.props.size)
		{
			className.push('input-'+this.props.size);
		}
		return input.select({
			name: this.props.name,
			options: this.props.options,
			multi: this.props.multi,
			initialValue: this.props.initialValue,
			className: className.join(' '),
			disabled: this.props.disabled
		});
		break;
		case 'static':
			className[0] += '-static';
		return dom.div({
			className: className.join(' '),
			children: this.props.value
		});
		break;
		case 'checkbox':
		case 'radio':
		var options = [];
		var self = this;
		className[0] = this.inputType + (this.props.inline ? '-inline':'');
		this.props.options.forEach(function (item){

			options.push(dom.label({
				className: className,
				children: [
				input[self.inputType]({
					value: item.value,
					name: self.props.id,
					//checked : item.checked,
					disabled: self.props.disabled
				}),
				item.label
				]
			}));

		});
		return options;
		break;
	}
};