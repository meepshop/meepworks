var core = require('meepworks-core');
var meepTip = require('meepworks-tip');
var meepMenu = require('meepworks-menu');
var react = require('react');

var dom = react.DOM;
var propTypes = react.PropTypes;
var animate = react.addons.CSSTransitionGroup;

/* Basic button properties and functions*/
var _buttonMixin = {
    propTypes: {
        label: propTypes.any.isRequired,
        className: propTypes.string,
        bootstrapStyle: propTypes.oneOf(['default', 'primary', 'success', 'info', 'warning', 'danger', 'link']),
        block: propTypes.bool,
        size: propTypes.oneOf(['lg', 'sm', 'xs']),
        disabled: propTypes.bool,
        onClick: propTypes.func,
        onBlur: propTypes.func,
        link: propTypes.string
    },
    getDefaultProps: function ()
    {
        return {
            bootstrapStyle: 'default'
        };
    },
    handleBlur: function (e)
    {
        if (typeof this.props.onBlur === 'function')
        {
            this.props.onBlur(e);
        }
    },
    handleClick: function (e)
    {
        if (typeof this.props.onClick === 'function')
        {
            this.props.onClick(e);
        }
        if (!this.props.link)
        {
            e.preventDefault();
        }
    }
};
/* Generic button implementation */
var _meepButton = module.exports = core.createClass({
    displayName: 'button',
    mixins: [
        _buttonMixin,
        meepTip.mixin
    ],
    propTypes: {
        buttonStyle: propTypes.oneOf(['flat', 'ion', 'icon'])

    },
    render: function ()
    {
        var className = ['btn'];
        if (this.props.className)
        {
            className.push(this.props.className);
        }
        if (this.props.buttonStyle)
        {
            className.push('btn-' + this.props.buttonStyle);
        }
        if (this.props.buttonStyle !== 'icon')
        {
            if (this.props.bootstrapStyle)
            {
                className.push('btn-' + this.props.bootstrapStyle);
            }
        }
        if (this.props.size)
        {
            className.push('btn-' + this.props.size);
        }
        if (this.props.block === true)
        {
            className.push('btn-block');
        }
        if (this.props.disabled === true)
        {
            className.push('disabled');
        }

        var props = {
            type: 'button',
            className: className.join(' ')
        };

        var label = this.props.label;
        if (!Array.isArray(label))
        {
            label = [label];
        }

        var button;
        if (this.props.disabled !== true)
        {
            props.onClick = this.handleClick;
            props.onBlur = this.handleBlur;
            if (this.props.link)
            {
                props.href = this.props.link;
                /* Instead of passing in label as children array,
                    pass them in as parameters so that react doesn't warn about
                    using unique keys
                */
                button = dom.a.apply(this, [props].concat(label.map(function (item)
                {
                    return item;
                })));
            }
            else
            {
                button = dom.button.apply(this, [props].concat(label.map(function (item)
                {
                    return item;
                })));
            }
        }
        else
        {
            button = dom.button.apply(this, [props].concat(label.map(function (item)
            {
                return item;
            })));
        }

        if (this.props.tooltip)
        {

            return _buttonGroup({
                children: [
                button,
                meepTip.attach.call(this)
                ]
            });
        }
        else
        {
            return button;
        }
    }
});
_meepButton.transferProps = function (props)
{
    if (this.props.hasOwnProperty('label'))
    {
        props.label = this.props.label;
    }
    if (this.props.hasOwnProperty('className'))
    {
        props.className = this.props.className;
    }
    if (this.props.hasOwnProperty('bootstrapStyle'))
    {
        props.bootstrapStyle = this.props.bootstrapStyle;
    }
    if (this.props.hasOwnProperty('buttonStyle'))
    {
        props.buttonStyle = this.props.buttonStyle;
    }
    if (this.props.hasOwnProperty('block'))
    {
        props.block = this.props.block;
    }
    if (this.props.hasOwnProperty('size'))
    {
        props.size = this.props.size;
    }
    if (this.props.hasOwnProperty('disabled'))
    {
        props.disabled = this.props.disabled;
    }
    return props;
};

/*
    props: {
        [button props as regular button],
        icon: 'text to be used as icon, or a meepIcon component,
        iconAlign: 'left' || 'right', [default to right]
    }
*/
var _extended = _meepButton.extended = core.createClass({
    mixins: [
        _buttonMixin,
        meepTip.mixin
    ],
    displayName: 'button-extended',
    getDefaultProps: function ()
    {
        return {
            iconAlign: 'right'
        };
    },
    propTypes: {
        buttonStyle: propTypes.oneOf(['flat', 'ion']),
        iconAlign: propTypes.oneOf(['left', 'right'])
    },
    render: function ()
    {
        var className = ['btn-extend'];
        if (this.props.className)
        {
            className.push(this.props.className);
        }
        if (this.props.iconAlign === 'left')
        {
            className.push('be-left');
        }
        var props = _meepButton.transferProps.call(this, {
            className: className.join(' ')
        });
        if (this.props.icon)
        {
            props.label = [
                props.label,
                this.props.icon
            ];
        }
        meepTip.transferProps.call(this, props);
        return _meepButton(props);

    }
});


var _buttonGroup = _meepButton.buttonGroup = core.createClass({
    render: function ()
    {
        var className = ['btn-group'];
        if (this.props.className)
        {
            className.push(this.props.className);
        }
        return dom.div({
            className: className.join(' '),
            children: this.props.children
        });
    }
});

var _buttonToolbar = _meepButton.buttonToolbar = core.createClass({
    render: function ()
    {
        return dom.div({
            className: 'btn-toolbar',
            children: this.props.children
        });
    }
});

var _menuButton = _meepButton.menuButton = core.createClass({
    mixins: [
        meepTip.mixin,
        meepMenu.dropdown.mixin
    ],
    getDefaultProps: function ()
    {
        return {
            hideOnAction: true,
            hideOnBlur: true
        };
    },
    propTypes: {
        dropUp: propTypes.bool,
        hideOnAction: propTypes.bool,
        hideOnBlur: propTypes.bool

    },
    getInitialState: function ()
    {
        return {
            show: false
        };
    },
    toggleMenu: function (e)
    {
        this.setState({
            show: !this.state.show
        });
    },
    handleDocumentClick: function (e)
    {
        if (!core.isChildOf(e.target, this.getDOMNode()))
        {
            this.setState({
                show: false
            });
        }
    },
    render: function ()
    {
        var className = ['btn-group'];
        if (this.props.dropUp)
        {
            className.push('dropup');
        }
        if (this.state.show)
        {
            className.push('open');
            if (this.props.hideOnBlur !== false)
            {
                window.addEventListener('click', this.handleDocumentClick);
            }
        }
        else
        {
            if (this.props.hideOnBlur !== false)
            {
                window.removeEventListener('click', this.handleDocumentClick);
            }
        }
        if (this.props.className)
        {
            className.push(this.props.className);
        }
        var btnProps = _meepButton.transferProps.call(this, {
            onClick: this.toggleMenu
        });
        btnProps.className = 'dropdown-toggle';
        if (this.props.buttonStyle != 'icon')
        {
            btnProps.label = [
                btnProps.label + ' ',
                dom.span({ className: 'caret' })
            ];
        }
        var props = {
            className: className.join(' '),
            children: [_meepButton(btnProps)]
        };


        props.children.push(meepMenu.dropdown(meepMenu.dropdown.transferProps.call(this, {
            actionTrigger: this.props.hideOnAction !== false ? this.toggleMenu : null
        })));
        if (this.props.tooltip && !this.state.show)
        {
            props.children.push(meepTip.attach.call(this));
        }

        return dom.div(props);


    }
});


var _handleMenuClick = function (idx)
{
    if (idx !== this.state.context)
    {
        this.setState({
            context: idx
        });
    }
};

/* Deferred */
var _splitButton = _meepButton.splitButton = core.createClass({
    mixins: [
        meepMenu.mixin
    ],
    render: function ()
    {
        return dom.div();
    }
});

//var _splitButton = _meepButton.splitButton = core.createClass({
//	mixins: [_mixins.menu],
//	getInitialState: function ()
//	{
//		return {
//			context: 0
//		};
//	},
//	handleButtonClick: function(e)
//	{
//		if(this.state.show)
//		{
//			this.setState({
//				show: false
//			});
//		}
//		var fn = this.props.menuItems[this.state.context].onClick;
//		if(typeof fn == 'function')
//		{
//			fn(e);
//		}
//	},
//	getMenu: function ()
//	{
//		if(this.state.show)
//		{
//			window.addEventListener('click', this.handleDocumentClick);
//			var self = this;
//			var menu = this.props.menuItems.map(function (item, idx)
//			{
//				if(item.link || typeof item.onClick == 'function')
//				{
//					return {
//						label: item.label,
//						onClick: _handleMenuClick.bind(self, idx)
//					};
//				}
//				else
//				{
//					return item;
//				}
//			});

//			return meepMenu.listMenu({
//				key: 'menu',
//				menuItems: menu,
//				className: 'dropdown-menu' + (this.props.alignRight ? ' pull-right': ''),
//				onClick: this.handleToggleMenu //close menu when item is clicked
//			});

//		}
//		window.removeEventListener('click', this.handleDocumentClick);
//		return '';
//	},
//	render: function ()
//	{
//		var className = ['btn-group'];
//		if(this.props.dropUp)
//		{
//			className.push('dropup');
//		}
//		if(this.state.show)
//		{
//			className.push('open');
//		}
//		var label = '';
//		var link = '#';
//		if(Array.isArray(this.props.menuItems) 
//			&& typeof this.props.menuItems[this.state.context] !='undefined' )
//		{
//			if(typeof this.props.menuItems[this.state.context].label != 'undefined')
//			{
//				label = this.props.menuItems[this.state.context].label;
//			}
//			if(typeof this.props.menuItems[this.state.context].link != 'undefined')
//			{
//				link = this.props.menuItems[this.state.context].link;
//			}
//		}


//		var props = {
//			className: className.join(' '),
//			children: [
//			_genericButton(_copyButtonProps.call(this,{
//				key: 'button',
//				label: label,
//				onClick: this.handleButtonClick,
//				link: link
//			})),
//			_genericButton(_copyButtonProps.call(this, {
//				key: 'menu-toggle',
//				className: 'dropdown-toggle',
//				label: dom.span({
//					key: 'caret',
//					className: 'caret'
//				}),
//				onClick: this.handleToggleMenu
//			})),		
//			animate({
//				component: dom.div,
//				transitionName: 'dropdown-fade',
//				transitionEnter: !!this.props.animate,
//				transitionLeave: !!this.props.animate,
//				children: this.getMenu()
//			})

//			]

//		};
//		if (this.props.tooltip && !this.state.show)
//		{
//			props.children.push(meepTip.attach.call(this, props));
//		}
//		return dom.div(props);
//	}

//});

var _copyButtonProps = function (props)
{
    if (this.props.bootstrapStyle)
    {
        props.bootstrapStyle = this.props.bootstrapStyle;
    }
    if (this.props.specialStyle)
    {
        props.specialStyle = this.props.specialStyle;
    }
    if (this.props.size)
    {
        props.size = this.props.size;
    }
    if (this.props.block)
    {
        props.block = this.props.block;
    }
    return props;
};
_meepButton.menuDivider = meepMenu.divider;
