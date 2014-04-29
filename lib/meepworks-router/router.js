/*	Meepworks-router
*	Client side router based on visionmedia/page.js
*/
var page = require('page');


var routes = {};
var triggers = [];

/* simplifies page.js use to 'route'=>callback relation
* page.js requires query string handling to happen within the handler
* extend this feature to allow binding of separate querystrings to different handlers
* use querystrings for routing instead of hashes so that the server could pre-serve or 
* pre-render contents (currently not implemented)
*/
var router = module.exports = function (route, cb)
{
	//if there's query string
	if(cb)
	{
		if(route.indexOf('?')>-1)
		{
			route = route.split('?');
			if(route[0] === "")
			{
				//assuming this query string is bound to current url if no url is supplied
				route[0] = window.location.pathname;
			}
			if(!routes[route[0]])
			{
				routes[route[0]] = {
					fn: null,
					subRoutes: {}
				};
				page(route[0], baseHandler);
			}
			routes[route[0]].subRoutes[route[1]] = cb;
		}
		else
		{
			if(!routes[route])
			{
				routes[route] = {
					fn: cb,
					subRoutes: {}
				};
				page(route, baseHandler);
			}
			else
			{
				routes[route].fn = cb;
			}
		}
	}
	else
	{
		page(route);
	}
};
router.init = function (obj)
{
	page(obj);
};
router.addTrigger = function (cb)
{
	if(typeof cb == 'function')
	{
		triggers.push(cb);
	}
};
router.removeTrigger = function (cb)
{
	var idx;
	if(typeof cb=='function' && (idx=triggers.indexOf(cb))>-1)
	{
		triggers.splice(idx, 1);
	}
};

function baseHandler(ctx)
{
	if(routes[ctx.pathname])
	{
		if(ctx.querystring!=="")
		{
			if(typeof routes[ctx.pathname].subRoutes[ctx.querystring] == 'function')
			{
				routes[ctx.pathname].subRoutes[ctx.querystring](ctx);
			}
		}
		else
		{
			if(typeof routes[ctx.pathname].fn == 'function')
			{
				routes[ctx.pathname].fn(ctx);	
			}
		}
	}
	triggers.forEach(function (cb){
		cb(ctx);
	});
};
