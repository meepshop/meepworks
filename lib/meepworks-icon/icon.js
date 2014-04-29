var core = require('meepworks-core');
var react = require('react');
var dom = react.DOM;

/*
*	i tag is used for text based icons: glyphicons and ion icons
*	img tag should be used for url or image icons
*/

var iconClass = {
	getDefaultProps: function ()
	{
		return {
			name: null,
			component: dom.i
		};
	}
};

var iconRender = {
	render: function ()
	{
		var className = [this.props.type];
		if(this.props.name)
		{
			className.push(this.props.name);
		}
		return this.props.component({
			className: className.join(' ')
		});
	}
};


var meepIcon = module.exports = core.createClass({
	getDefaultProps: function ()
	{
		return {
			img: null
		};
	},
	render: function ()
	{
		if(this.props.img instanceof Image)
		{
			return dom.img({
				src: this.props.img.src
			});
		}
		else
		{
			return dom.img({
				src: this.props.img
			});
		}
	}
});


var glyphicon = meepIcon.glyphicon = core.createClass({
	mixins: [iconClass, iconRender],
	getDefaultProps: function ()
	{
		return {
			type: 'glyphicon'
		};
	}
});

var ionicon = meepIcon.ionicon = core.createClass({
	mixins: [iconClass, iconRender],
	getDefaultProps: function ()
	{
		return {
			type: 'ionicon'
		}
	}
});




