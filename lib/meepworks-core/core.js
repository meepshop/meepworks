/*
*	Author: Jack Tzu-Chieh Huang
*
*/

var react = require('react');
var es5shim = require('es5-shim/es5-shim');

var _cache = {
	eventListeners: {
	    'resize': [],
        'layout': [],
	},
	viewportSize: {
		width: 0,
		height: 0
	}
};



var core = module.exports = {
	/*
	*	Simplifies use of react class objects in app code.
	*	Allow apps to use react classes without including react.
	*/
	createClass: function (props)
	{
		var reactClass = react.createClass(props);

		return function (props, target)
		{
			var obj;
			if(Array.isArray(props))
			{
				if(typeof target!=='undefined')
				{
					console.log('props cannot be an array when rendering to a target');
					return null;
				}
				obj = [];
				for(var i =0, len=props.length; i<len; i++)
				{
					obj.push(reactClass(props));
				}
			}
			else
			{
				obj = reactClass(props);
			}
			if(typeof target !== 'undefined')
			{

				obj = react.renderComponent(obj, target);

			}

			return obj;
		};
	}
};


/* http://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript

not very reliable
*/

var _checkViewportSize =function ()
{
	_cache.viewportSize.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	_cache.viewportSize.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
};
_checkViewportSize(); /* check for the first time */

core.getViewportSize = function()
{
	return _cache.viewportSize;
};
core.addEventListener = function (event, fn)
{
	if(!_cache.eventListeners[event])
	{
		_cache.eventListeners[event] = [];
	}
	if(typeof fn === 'function' && _cache.eventListeners[event].indexOf(fn))
	{
		_cache.eventListeners[event].push(fn);
	}
};
core.removeEventListener = function (event, fn)
{
	if(Array.isArray(_cache.eventListeners[event]))
	{
		var idx = _cache.eventListeners[event].indexOf(fn);
		if(idx>-1)
		{
			_cache.eventListeners[event].splice(idx, 1);
		}
	}
};

core.trigger = function (event)
{
    if(Array.isArray(_cache.eventListeners[event]))
    {
        _cache.eventListeners[event].forEach(function (fn)
        {
            fn();
        });
    }
};

    /*
    *	Centralize window resize checking and batch update component via 
    *	subscribed event listeners
    */
    var _checkResizeTimeout = null;
    window.addEventListener('resize', function (e)
    {
        if(_checkResizeTimeout != null)
        {
            clearTimeout(_checkResizeTimeout);
            _checkResizeTimeout = null;
        }
        _checkResizeTimeout = setTimeout(function ()
        {
            _checkViewportSize();
            _cache.eventListeners.resize.forEach(function (fn)
            {
                fn(e);
            });	
        }, 300);
	
    });
    /*
    * string replacement helper
    * ex: core.format('Hello ${name}', {name: 'Joe'}) yields 'Hello Joe'
    */
    core.format = function (tmpl, obj)
    {
        for(var name in obj)
        {
            var reg = new RegExp('\\{\\{'+name+'\\}\\}', 'g');
            tmpl = tmpl.replace(reg, obj[name]);
        }
        return tmpl;
    };

    /*
    *	Transfers the properties of from object to the to object
    * 	ex: core.transferProps({name: 'Jack'}, {}) => {name: 'Jack'}
    *   This is used to "clone" properties onto new objects, so that
    *   we don't mutate the original property objects
    */
    core.transferProps = function (from, to)
    {
        for(var name in from)
        {
            if (from.hasOwnProperty(name))
            {
                to[name] = from[name];
            }
        }
        return to;
    };

    /*
    *	Recursively checking if node a is a child of b or if a is b.
    *	This inevitably queries dom, but does not do any changes to them.
    *	TODO: test on various browsers
    */
    core.isChildOf = function (a, b)
    {
        if(a===b)
        {
            return true;
        }
        if(b.hasChildNodes())
        {
            var children = b.childNodes;
            for(var i = 0, len = children.length; i<len; i++)
            {
                if(core.isChildOf(a, children[i]))
                {
                    return true;
                }
            }
        }
        return false;

    };

    var _unitArray = ['B', 'KB', 'MB', 'GB', 'TB'];
    var _formatSize = core.formatSize = function (size)
    {
        size = parseInt(size);
        var uIdx = 0;
        while (size > 10240)
        {
            size = size / 1024;
            uIdx++;
        }
        return _addComma(Math.floor(size)) + _unitArray[uIdx];
    };


    var _addComma = core.addComma = function (val)
    {
        val = val + '';
        var isNegative = val[0] == '-';
        if (isNegative)
        {
            val = val.substr(1);
        }
        val = val.split('.');
        var len = val[0].length;
        var tmp = [];
        while (len > 3)
        {
            tmp.push(val[0].substr(len - 3, 3));
            len -= 3;
        }
        if (len > 0)
        {
            tmp.push(val[0].substr(0, len));
        }
        val[0] = tmp.reverse().join(',');
        if (val.length > 0)
        {
            val = val.join('.');
        }
        if (isNegative)
        {
            val = '-' + val;
        }
        return val;
    };