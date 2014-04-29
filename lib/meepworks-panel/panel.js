var core = require('meepworks-core');
var react = require('react');
var meepButton = require('meepworks-button');
var meepIcon = require('meepworks-icon');

var dom = react.DOM;
var propTypes = react.PropTypes;
var animate = react.addons.CSSTransitionGroup;

_cache = {
    expandStack: []
};
_cache.expandCheck =function (panel, expanded)
{
    var canExpand = false;
    var changed = false;

    var idx = this.expandStack.indexOf(panel);
    if (idx > -1)
    {
        if(expanded)
        {
            if (idx == this.expandStack.length - 1)
            {
                canExpand = true;
            }
        }
        else
        {
            changed = true;
            this.expandStack.splice(idx, 1);
        }
    }
    else
    {
        if(expanded)
        {
            changed = true;
            this.expandStack.push(panel);
            canExpand = true;
        }
    }
    if (changed)
    {
        this.expandStack.forEach(function (p)
        {
            if(p!==panel)
            {
                p.handleExpandStackChange();
            }
        });
    }

    return canExpand;
};
_cache.unmount = function (panel, expanded)
{
    var changed = false;
    if(expanded)
    {
        var idx = this.expandStack.indexOf(panel);
        if(idx==this.expandStack.length-1)
        {
            changed = true;
        }
        this.expandStack.splice(idx, 1);
    }
    if(changed)
    {
        this.expandStack.forEach(function (p)
        {
            if (p !== panel)
            {
                p.handleExpandStackChange();
            }
        });
    }
    

};

var _meepPanel = module.exports = core.createClass({
	getDefaultProps: function ()
	{
		return {
			headerActions: [],
			lnCloseTip: 'Close',
			lnExpandTip: 'Expand',
			lnShrinkTip: 'Shrink',
			lnCollapseTip: 'Collapse'
		};
	},
	propTypes: {
		onClose: propTypes.func,	//show close button
		
		canCollapse: function (props, propName)
		{
			if(props.hasOwnProperty(propName))
			{
				propTypes.bool(props, propName);
				if(props[propName]===true && props.hasOwnProperty('collapsed') && typeof props.onCollapse !=='function')
				{
					console.log('Warning: defining `collapsed` property without `onCollapse` handler will disable the collapse toggle.');
				}
			}
		},
		collapsed: propTypes.bool,	/* externally controlled collapse */
		startCollapsed: function (props, propName)
		{
			if(props.hasOwnProperty(propName))
			{
				propTypes.bool(props, propName);
				if(props.hasOwnProperty('collapsed'))
				{
					console.log('Warning: `startCollapsed` has no effect when `collapsed` property is defined.');
				}
			}
		},
		onCollapse: propTypes.func,
		animateCollapse: propTypes.bool,

		canExpand: function (props, propName)
		{
			if(props.hasOwnProperty(propName))
			{
				propTypes.bool(props, propName);
				if(props[propName] && props.hasOwnProperty('expanded') && typeof props.onExpand !== 'function ')
				{
					console.log('Warning: defining `expanded` property without `onExpand` handler will disable the expand toggle.')
				}
			}
		},
		expanded: propTypes.bool,
		startExpanded: function (props, propName)
		{
			if(props.hasOwnProperty(propName))
			{
				propTypes.bool(props, propName);
				if(props.hasOwnProperty('expanded'))
				{
					console.log('Warning: `startExpanded` has no effect when `expanded` property is defined.');
				}
			}
		},
		onExpand: propTypes.func,

		fullscreen: propTypes.bool,
		canFullscreen: propTypes.bool,
		startFullscreen: propTypes.bool,
		onFullscreen: propTypes.func,

		/* header settings */
		hideHeader: propTypes.bool,
		title: propTypes.string,
		headerActions: propTypes.array,

		/*children: will be placed in body */


		/* allowing setting classname to each parts*/
		headerClass: propTypes.string,
		bodyClass: propTypes.string,
		footerClass: propTypes.string,

		/* tips */
		lnCloseTip: propTypes.string,
		lnExpandTip: propTypes.string,
		lnCollapseTip: propTypes.string

	},
	getInitialState: function ()
	{
		return {
			collapsed: false,
			managedCollapse: false,
			expanded: false,
			managedExpand: false,
			animationCounter: 0
		};
	},
	componentDidMount: function ()
	{
	    console.log('panel mount');
		var state = this.state;
		state.managedExpand = this.props.hasOwnProperty('expanded');
		state.managedCollapse = this.props.hasOwnProperty('collapsed');
		if(!state.managedExpand && this.props.startExpanded)
		{
			state.expanded = true;
		}
		if(!state.managedCollapse && !state.expanded && this.props.startCollapsed)
		{
			state.collapsed = true;
		}
		this.forceUpdate();
	},
	componentWillReceiveProps: function (nextProps)
	{
		var managedExpand = nextProps.hasOwnProperty('expanded');
		var managedCollapse = nextProps.hasOwnProperty('collapsed');
		if(this.state.managedExpand!=managedExpand 
			|| this.state.managedCollapse!=managedCollapse)
		{
			this.setState({
				managedExpand: managedExpand,
				managedCollapse: managedCollapse
			});
		}
	},
	componentWillUnmount: function ()
	{
	    _cache.unmount(this, this.isExpanded());
	},
	isExpanded: function ()
	{
		if(this.state.managedExpand)
		{
			return this.props.expanded;
		}
		return this.state.expanded;
	},
	toggleExpand: function (e)
	{
		if(this.props.canExpand)
		{
			var expanded = !this.isExpanded();
			if(!this.state.managedExpand)
			{
				this.setState({
					expanded: expanded
				});
			}
			if(this.props.onExpand)
			{
				this.props.onExpand(expanded, e);
			}
			if(expanded && this.isCollapsed())
			{
				this.toggleCollapse();
			}
		}
	},
	setExpand: function (expanded)
	{
		if(this.state.managedExpand)
		{
			console.log('Warning: `expanded` property is defined, modify expanded by changing the property instead.');
		}
		else
		{
			expanded=!!expanded;
			this.setState({
				expanded: expanded
			});
		}
	},
	isCollapsed: function ()
	{
		if(this.state.managedCollapse)
		{
			return this.props.collapsed;
		}
		return this.state.collapsed;
	},
	toggleCollapse: function (e)
	{
		if(this.props.canCollapse)
		{
			this.state.animationCounter++;
			var collapsed = !this.isCollapsed();
			if(!this.state.managedCollapse)
			{
				this.setState({
					collapsed: collapsed
				});
			}
			if(this.props.onCollapse)
			{
				this.props.onCollapse(collapsed, e);
			}
			if(collapsed && this.isExpanded())
			{
				this.toggleExpand();
			}
		}
	},
	setCollapsed: function (collapsed)
	{
		if(this.state.managedCollapse)
		{
			console.log('Warning: `collapsed` property is defined, modify collapsed by changing the property instead.');
		}
		else
		{
			collapsed = !!collapsed;
			this.setState({
				collapsed: collapsed
			});
		}
	},
	handleExpandStackChange: function ()
	{
	    this.forceUpdate();
	},
	render: function()
	{
		var className = ['panel', 'panel-default'];
		
		if (/Trident/i.test(navigator.userAgent))   
		{
            //apply some ie specific ui fix
		    className.push('ie');
		}
		/* expand */
		var managedExpand = this.props.hasOwnProperty('expanded');
		var isExpanded = this.isExpanded();

		if(_cache.expandCheck(this, isExpanded))
		{
			className.push('expand');
		}

		/* collapse */
		var managedCollapse = this.props.hasOwnProperty('collapsed');
		/* if expanded then no collapse */
		var isCollapsed = this.isCollapsed() && !isExpanded;	
		if(isCollapsed)
		{
			className.push('panel-collapsed');
		}
		var props = {
			className: className.join(' '),
			//transitionName: 'panel-collapse',
            /* animation interferes with tooltip, fix when better solution is found */
			//transitionEnter: false,//!isExpanded && !!this.props.animateCollapse,
			//transitionLeave: false, //!isExpanded && !!this.props.animateCollapse,
			//component: dom.div,
			children: []
		};

		/* header generation */
		if(!this.props.hideHeader)
		{
			
			/* make a copy of header actions */
			var actions = this.props.headerActions.slice(0, this.props.headerActions.length);

			/* add expand button */
			var showExpandToggle = false;
			if(managedExpand && this.props.canExpand && typeof this.props.onExpand === 'funciton'
				|| !managedExpand && this.props.canExpand)
			{
			    actions.push(meepButton({
                    buttonStyle: 'icon',
					label: meepIcon.glyphicon({
						name: isExpanded ? 'glyphicon-resize-small' : 'glyphicon-resize-full'
					}),
					onClick: this.toggleExpand,
					tooltip: isExpanded ? this.props.lnShrinkTip : this.props.lnExpandTip,
                    tooltipPosition: 'bottom-left'
				}));
			}

			/* add collapse button */
			var showCollapseToggle = false;
			if(managedCollapse && this.props.canCollapse && typeof this.props.onCollapse === 'function'
				|| !managedCollapse && this.props.canCollapse)
			{
			    actions.push(meepButton({
			        buttonStyle: 'icon',
					label: meepIcon.ionicon({
						name: 'ion-chevron-down'
					}),
					onClick: this.toggleCollapse,
					tooltip: this.props.lnCollapseTip,
					tooltipPosition: 'bottom-left'
				}));
			}

			/* add close button */
			if(typeof this.props.onClose === 'function')
			{
			    actions.push(meepButton({
			        buttonStyle: 'icon',
					label: meepIcon.ionicon({
						name: 'ion-close-round'
					}),
					onClick: this.props.onClose,
					tooltip: this.props.lnCloseTip,
					tooltipPosition: 'bottom-right'
				}));
			}



			var headerProps = {
				key: 'panel-header',
				className: this.props.headerClass,
				title: this.props.title,
				actions: actions
			};
			props.children.push(_panelHeader(headerProps));
		}

		/* body generation */

		if(!isCollapsed)
		{
			
			var bodyProps = {
				key: 'panel-body' + ':' + (this.state.animationCounter),
				className: this.props.bodyClass,
				children: this.props.body
			};
			props.children.push(_panelBody(bodyProps));
		}

		/* footer generation */
		if(this.props.hasOwnProperty('footer'))
		{
			
			props.children.push(_panelFooter({
				key: 'panel-footer',
				className: this.props.footerClass,
				children: this.props.footer
			}))
		}


	    //return animate(props);
		return dom.div(props);
	}
});

var _panelHeader = core.createClass({
	getDefaultProps: function ()
	{
		return {
			actions: [],
			title: ''
		};
	},
	render: function ()
	{
		var className = ['panel-heading'];
		if(this.props.className)
		{
			className.push(this.props.className);
		}
		var props = {
			className: className.join(' '),
			children: [
			dom.div({
				className: 'panel-icon',
				children: this.props.icon
			}),
			dom.div({
				className: 'panel-actions',
				children: this.props.actions
			}),
			dom.h3({
				className: 'panel-title',
				children: this.props.title
			})
			]
		};


		return dom.div(props);
	}
});


var _panelBody = core.createClass({
	render: function ()
	{
		var className =['panel-body'];
		var props = {
			className: className.join(' '),
			children: this.props.children
		};
		return dom.div(props)
	}
});

var _panelFooter = core.createClass({
	render: function ()
	{
		var className = ['panel-footer'];
		var props = {
			className: className.join(' '),
			children: this.props.children
		};
		return dom.div(props);
	}
})
