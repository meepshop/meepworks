/*
*	meepworks-nav.js
*	navigation menu module
*		
*/

var core = require('meepworks-core');
var meepIcon = require('meepworks-icon');
var react = require('react');
var dom = react.DOM;

var sidenav = module.exports = core.createClass({
	getDefaultProps: function ()
	{
		return {
			menu: [],
			router: null
		};
	},
	getInitialState: function ()
	{
		return {
			map: [],
			activeMap: []
		};
	},
	componentWillReceiveProps: function (nextProps)
	{
		
		this.setState({
			map: [],
			activeMap: []
		});
	},
	handleRoute: function(ctx)
	{
		var map = calculateRoadmap(this.props.menu, ctx.pathname, ctx.querystring);
		if(map)
		{
			this.setState({
				map: map.slice(0, map.length-1),
				activeMap: map
			});
		}
	},
	componentWillMount: function ()
	{
		if(this.props.router)
		{
			this.props.router.addTrigger(this.handleRoute);
		}
	},
	componentWillUnmount: function()
	{
		if(this.props.router)
		{
			this.props.router.removeTrigger(this.handleRoute);
		}
	},
	render: function ()
	{

		var items = getItems.call(this, this.props.menu);
		return dom.nav({
			key: 'side-nav',
			className: 'side-nav', 
			children: dom.ul({
				key: 'side-nav-ul',
				children: items
			})
		});
	}
});

function getItems(menu, layer, label)
{
	if(typeof layer==='undefined')
	{
		layer=0;
	}
	var items = [];
	if(layer>0)
	{
		items.push(sidenav.navHeading({
			key: 'nav-heading',
			handleNav: handleNav.bind(this, -1, true, null),
			label: label
		}));
	}

	items = items.concat(menu.map(function (item, idx){
			//avoid modifying original item
			var props = {
				key: item.label + ':' + idx,
				originalItem: item,
				active: this.state.activeMap[layer]==idx
			};
			if(typeof item.menu !=='undefined' && Array.isArray(item.menu))
			{	
				//avoid modifying props
				props.handleNav = handleNav.bind(this, idx, true, null);
				props.active = this.state.activeMap[layer]==idx;
				if(this.state.map[layer]==idx)
				{
					props.submenu = dom.ul({
						key: item.label + '-submenu',
						className: 'side-nav-child',
						children: getItems.call(this, item.menu, layer+1, item.label)
					});
					props.active = true;
				}

			}
			else
			{
				props.handleNav = handleNav.bind(this, idx, false, item);
			}
			return sidenav.navItem(props);
			
		}.bind(this)));
	return items;
}
function handleNav(idx, isMenu, item, e)
{

	if(isMenu)
	{
		if(idx==-1)
		{
			this.state.map.pop();
			this.setState({
				map: this.state.map
			});

		}
		else
		{
			this.state.map.push(idx);
			this.setState({
				map: this.state.map
			});
		}
		e.preventDefault();
	}
	else
	{
		this.state.activeMap = this.state.map.slice(0, this.state.map.length);
		this.state.activeMap.push(idx);
		this.setState({
			activeMap: this.state.activeMap
		});
		if(typeof item.onClick== 'function')
		{
			item.onClick(e);
		}
		if(typeof item.link === 'undefined' || item.link=="")
		{
			e.preventDefault();

		}
	}
}
sidenav.navItem = core.createClass({
	getDefaultProps: function ()
	{
		return {
			handleNav: function () {},
			originalItem: {},
			active: false,
			submenu: null
		};
	},
	render: function()
	{
		var aChildren = [];
		if(this.props.originalItem.badge !== null)
		{
			aChildren.push(dom.span({
				key: 'item-badge',
				className: 'badge',
				children: this.props.originalItem.badge
			}));
		}
		if(this.props.originalItem.menu)
		{
			aChildren.push(dom.i({
				key: 'item-caret',
				className: 'nav-item-caret'
			}));
		}	
		if(this.props.originalItem.icon!=null)
		{
			aChildren.push(dom.i({
				key: 'item-icon',
				className: 'nav-item-icon icon',
				children: [
				dom.img({
					src: this.props.originalItem.icon,
					alt: 'Icon'
				})
				]
			}));

		}
		else if(this.props.originalItem.iconClass!=null)
		{
			aChildren.push(dom.i({
				key: 'item-icon',
				className: 'nav-item-icon icon ' + this.props.originalItem.iconClass
			}));
		}
		aChildren.push(this.props.originalItem.label);
		var liChildren = [
		dom.a({
				key: this.props.originalItem.label,	//comply to react's requirement to avoid warning message
				href: this.props.originalItem.link || '#',
				onClick: this.props.handleNav,
				children: aChildren
			})
		];
		if(this.props.submenu)
		{
			liChildren.push(this.props.submenu);
		}

		return react.addons.CSSTransitionGroup({
			className: 'side-nav-item' + (this.props.active ? ' active' : ''),
			component: dom.li,
			transitionName: 'side-nav',
			children: liChildren
		});
	}
});
sidenav.navHeading = core.createClass({
	getDefaultProps: function ()
	{
		return {
			handleNav: function (){},
			label: 'nav heading'
		};
	},
	render: function ()
	{
		return dom.li({
			className: 'side-nav-item-heading',
			children: [
			dom.a({
				className: 'side-nav-back',
				href: '#',
				onClick: this.props.handleNav,
				children: [
				dom.i({
					className: 'nav-item-caret'
				}),
				this.props.label
				]
			})
			]
		});
	}
});

function calculateRoadmap(menu, pathname, query)
{
	var map = false;
	if(!Array.isArray(menu))
	{
		return map;
	}
	menu.every(function (item, idx)
	{
		if(item.menu)
		{
			if((map=calculateRoadmap(item.menu, pathname, query)))
			{
				map.splice(0,0, idx);
				return false;
			}

		}
		else
		{
			if(item.link.indexOf('?')>-1)
			{
				if(item.link.split('?')[1]==query)
				{
					map=[idx];
					return false;
				}
			}
			else
			{
				if(item.link == pathname && query=="")
				{
					map=[idx];
					return false;
				}
			}

		}
		return true;
	});
	return map;
}