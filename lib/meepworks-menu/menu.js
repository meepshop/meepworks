var core = require('meepworks-core');
var react = require('react');
var meepTip = require('meepworks-tip');

var dom = react.DOM;
var propTypes = react.PropTypes;

/* _menu implement a listmenu component
    

*/
var _menu = module.exports = {};

var _sideMenu = _menu.sideMenu = core.createClass({
    getDefaultProps: function ()
    {
        return {
            label: null,
            link: null,
            nav: null
        };
    },
    render: function ()
    {
        return dom.aside({
            className: 'side-left',
            children: [
			_sideHeader({
			    label: this.props.label,
			    link: this.props.link
			}),
			_sideBody({
			    content: this.props.nav
			})
            ]
        });
    }
});

var _sideHeader = _menu.sideHeader = core.createClass({
    getDefaultProps: function ()
    {
        return {
            label: null,
            link: null
        }
    },
    render: function ()
    {
        var label = this.props.label;
        if (this.props.link)
        {
            label = dom.a({
                href: this.props.link,
                children: this.props.label
            });
        }
        return dom.div({
            className: 'side-header',
            children: dom.h3({
                className: 'brand',
                children: label
            })
        });
    }
});
var _sideBody = _menu.sideBody = core.createClass({
    getDefaultProps: function ()
    {
        return {
            content: null
        };
    },
    render: function ()
    {
        return dom.div({
            className: 'side-body',
            children: this.props.content
        });
    }
});


/*
   Simple list menu.
*/
var _listMenu = _menu.listMenu = core.createClass({
    getDefaultProps: function ()
    {
        return {
            menu: []
        };
    },
    propTypes: {
        menu: propTypes.array,
        className: propTypes.string,
        actionTrigger: propTypes.func
    },
    render: function ()
    {
        var self = this;
        var props = {
            children: this.props.menu.map(function (item, idx)
            {
                if (item === _divider)
                {
                    return _divider({
                        key: 'listitem:' + idx
                    });
                }
                else
                {
                    return _menuItem(core.transferProps(item, {
                        key: 'listitem:' + idx,
                        actionTrigger: self.props.actionTrigger
                    }));
                }
            })
        };
        if (this.props.className)
        {
            props.className = this.props.className;
        }

        return dom.ul(props);
    }
});

/*
    Mneu Item Definition: 
    {
        label: string,
        onClick: handler for lick
        link: set to href of anchor element

    }
*/
var _menuItem = core.createClass({
    mixins: [
        meepTip.mixin
    ],
    propTypes: {
        label: propTypes.any.isRequired,
        onClick: propTypes.func,
        link: propTypes.string,
        disabled: propTypes.bool,
        className: propTypes.string,
        actionTrigger: propTypes.func,
        active: propTypes.bool
    },
    handleClick: function (e)
    {
        var trigger = false;
        if (typeof this.props.onClick === 'function')
        {
            this.props.onClick(e);
            trigger = true;
        }
        if (!this.props.link)
        {
            e.preventDefault();
        }
        else
        {
            trigger = true;
        }
        if(trigger && typeof this.props.actionTrigger === 'function')
        {
            this.props.actionTrigger(e);
        }
    },
    render: function ()
    {
        var className = [];
        if (this.props.className)
        {
            className.push(this.props.className);
        }
        if (this.props.disabled === true)
        {
            className.push('disabled');
        }
        if (this.props.active)
        {
            className.push('active');
        }
        var props = {
            className: className.join(' '),
            children: []
        };

        var childProps = {
            children: [this.props.label]
        };

        if (this.props.tooltip)
        {
            childProps.children.push(meepTip.attach.call(this));
        }
        var clickable = !this.props.disabled && (!!this.props.link || !!this.props.onClick);
        if (clickable)
        {
            childProps.href = this.props.link || '#';
            childProps.onClick = this.handleClick;
            props.children.push(dom.a(childProps));
        }
        else
        {
            props.children.push(dom.span(childProps));
        }
        return dom.li(props);
    }
});



var _divider = _menu.divider = core.createClass({
    render: function ()
    {
        return dom.li({ className: 'divider' });
    }
});


/*
*/
var _dropdownMixin = {
    propTypes: {
        dropdownHeader: propTypes.array,
        dropdownMenu: propTypes.array,
        dropdownFooter: propTypes.array,
        dropdownAlignRight: propTypes.bool,
        dropdownAnimation: propTypes.oneOf(['none', 'fade', 'fade-in']),
        dropdownOnHover: propTypes.bool
        
    },
};
var _dropdown = _menu.dropdown = core.createClass({
    mixins: [
        _dropdownMixin
    ],
    getDefaultProps: function ()
    {
        return {
            dropdownHeader: [],
            dropdownMenu: [],
            dropdownFooter: [],
            dropdownAnimation: 'fade-in'
        };
    },
    propTypes: {
        actionTrigger: propTypes.func
    },
    render: function ()
    {
        var items = [];
        //var idx = 0;
        this.props.dropdownHeader.forEach(function (item)
        {
            if (item === _divider)
            {
                items.push(item);
            }
            else
            {
                var props = core.transferProps(item, {
                    //key: 'menu:' + idx++
                });
                var className = props.className ? props.className.split(' ') : [];
                className.push('dropdown-header');
                props.className = className.join(' ');
                items.push(props);
            }
            
        });
        this.props.dropdownMenu.forEach(function (item)
        {
            if (item === _divider)
            {
                items.push(item);
            }
            else
            {
                items.push(core.transferProps(item, {
                    //key: 'menu:' + idx++
                }));
            }

        });
        this.props.dropdownFooter.forEach(function (item)
        {
            if (item === _divider)
            {
                items.push(item);
            }
            else
            {
                var props = core.transferProps(item, {
                    //key: 'menu:' + idx++
                });
                var className = props.className ? props.className.split(' ') : [];
                className.push('dropdown-footer');
                props.className = className.join(' ');
                items.push(props);
            }
            
        });
        var className = ['dropdown-menu'];
        if (this.props.dropdownHeader.length > 0 || this.props.dropdownFooter.length > 0)
        {
            className.push('dropdown-extended');
        }
        if (this.props.dropdownAlignRight === true)
        {
            className.push('pull-right');
        }
        switch(this.props.dropdownAnimation)
        {
            case 'fade':
                className.push('hover-fade');
                break;
            case 'fade-in':
                className.push('hover-fade-in');
                break;

        }
        return _listMenu({
            className: className.join(' '),
            menu: items,
            actionTrigger: this.props.actionTrigger
        });

    }
});
_dropdown.mixin = _dropdownMixin;
_dropdown.transferProps = function (props)
{
    if (this.props.hasOwnProperty('dropdownHeader'))
    {
        props.dropdownHeader = this.props.dropdownHeader;
    }
    if (this.props.hasOwnProperty('dropdownMenu'))
    {
        props.dropdownMenu = this.props.dropdownMenu;
    }
    if (this.props.hasOwnProperty('dropdownFooter'))
    {
        props.dropdownFooter = this.props.dropdownFooter;
    }
    if (this.props.hasOwnProperty('dropdownAlignRight'))
    {
        props.dropdownAlignRight = this.props.dropdownAlignRight;
    }
    if (this.props.hasOwnProperty('dropdownAnimation'))
    {
        props.dropdownAnimation = this.props.dropdownAnimation;
    }
    if (this.props.hasOwnProperty('dropdownOnHover'))
    {
        props.dropdownOnHover = this.props.dropdownOnHover;
    }
    return props;
};