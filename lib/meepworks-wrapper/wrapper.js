/*
*	Wrapper deals with the outmost container of an app.
*	It houses the contents and menu and deals with showing and hiding of menu.
*/

var core = require('meepworks-core');
var react = require('react');
var meepButton = require('meepworks-button');
var dom = react.DOM;
var transitionGroup = react.addons.CSSTransitionGroup;

var cache = {
	windowSize: core.getViewportSize()
};


var meepWrapper = module.exports = core.createClass({
	getDefaultProps: function()
	{
		return {
			menu: null,
			content: null,
			leftActions: [],
			rightActions: [],
			module: null,
			title: ''
		};
	},
	getInitialState: function ()
	{
		return {
			hideMenu: !this.props.menu || cache.windowSize.width <767 ? true : false,
			hideModule: true
		};
	},
	componentWillReceiveProps: function (nextProps)
	{
		this.checkWindowSize();
	},
	componentDidMount: function ()
	{
		core.addEventListener('resize', this.checkWindowSize);
	},
	componentWillUnmount: function ()
	{
		core.removeEventListener('resize', this.checkWindowSize);
	},
	checkWindowSize: function ()	//due to binding needs
	{								//this has to be part of the wrapper object
		if(this.props.menu || this.props.module)
		{
			cache.windowSize = core.getViewportSize();
			if( cache.windowSize.width< 767)
			{
				this.setState({
					hideMenu: true,
					hideModule: true
				});
			}
		}
	},
	render: function ()
	{

		return react.DOM.section({
			id: 'wrapper',
			className: 'container',
			children: [
			this.props.menu,
			dom.section({
				className: 'content' + (this.state.hideMenu ? ' content-lg':''),
				children: [
				contentHeader({
					title: this.props.title,
					hasMenu: !!this.props.menu,
					leftActions: getLeftActions.call(this),
					rightActions: getRightActions.call(this)
				}),
				dom.div({
					className: 'content-splitter',
					children: getContent.call(this)
				})
				]
			})
			]
		});
	}
});

function getContent()
{
	var content = [];
	if(this.props.content)
	{
		content.push(contentMain({
			key: 'content-main',
			hideModule: this.state.hideModule,
			content: this.props.content
		}));
	}
	if(this.props.module)
	{
		content.push(contentAside({
			key:'content-aside',
			hideModule: this.state.hideModule,
			module: this.props.module
		}));
	}
	return content.length>0 ? content : null;
}
function getLeftActions ()
{
	var actions = [];
	if(this.props.menu)
	{
	    actions.push(meepButton({
	        buttonStyle: 'icon',
			key: 'menu-toggle',
			onClick: toggleMenu.bind(this),
			label: dom.i({className: 'ion-navicon-round'})
		}));
	}
	return actions.concat(this.props.leftActions);
}
function getRightActions()
{
	var actions = this.props.rightActions.slice(0, this.props.rightActions.length);
	if(this.props.module)
	{
	    actions.push(meepButton({
	        buttonStyle: 'icon',
			key: 'module-toggle',
			label: dom.i({className: 'ion-navicon-round'}),
			onClick: toggleModule.bind(this)
		}));
	}
	return actions;

}
function toggleMenu()
{
	if(this.props.menu)
	{
		this.setState({
			hideMenu: !this.state.hideMenu,
			hideModule: cache.windowSize.width< 1023 ? true: this.state.hideModule
			/* menu + module in smaller screen is not user friendly*/
		});
	}
}
function toggleModule()
{
	if(this.props.module)
	{
		this.setState({
			hideModule: !this.state.hideModule,
			hideMenu: cache.windowSize.width < 1023 ? true: this.state.hideMenu
		});
	}
}
var contentHeader = meepWrapper.contentHeader = core.createClass({
	getDefaultProps: function() 
	{
		return {
			title: '',
			leftActions: [],
			rightActions: [],
			hasMenu: true
		};
	},
	render: function ()
	{
		var props = {
			key: 'content-header',
			className: 'content-header',
			children: [
			dom.div({
				className: 'header-actions pull-left',
				children: this.props.leftActions
			}),
			dom.h1({
				className: 'content-title',
				children: this.props.title
			}),
			dom.div({
				className: 'header-actions pull-right',
				children: this.props.rightActions
			})
			]
		};
		return dom.header(props);
	}
});

var contentMain = meepWrapper.contentMain =core.createClass({
	getDefaultProps: function ()
	{
		return {
			hideModule: true,
			content: null
		}
	},
	render: function()
	{
		
		return transitionGroup({
			component: dom.section,
			className: 'content-main' + (this.props.hideModule ? '': ' content-main-md'),
			children: this.props.content,
			transitionName: 'content-main-fade',
			transitionLeave: false
		});
	}


});


var contentAside = meepWrapper.contentAside = core.createClass({
	getDefaultProps: function ()
	{
		return {
			hideModule: true,
			module: null
		};
	},
	render: function ()
	{
		return dom.section({
			className: 'content-aside' + (this.props.hideModule ? '': ' open'),
			children: this.props.module
		});
	}
});