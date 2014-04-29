/*
*	Tooltip module
*/

var react = require('react');
var core = require('meepworks-core');

var dom = react.DOM;
var propTypes = react.PropTypes;
var animate = react.addons.CSSTransitionGroup;


/* Tooltips are only for showing simple text that is not too long.
    Use popover menu's for complicated items.
*/
var _tip2PropTypes = {
    tooltip: propTypes.string,
    tooltipDelay: propTypes.oneOf([0, 100,200,300]),
    tooltipAlways: propTypes.bool,
    tooltipPosition: propTypes.oneOf([
            'top',
            'bottom',
            'left',
            'right',
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right'
    ]),
    tooltipAnimation: propTypes.oneOf([
        'none',
        'fade',
        'fade-in'
    ]),
    tooltipAllowClick: propTypes.bool   //allow clicking on tip to trigger onclick event of parent

};
var _tip2Mixin = {
    propTypes: _tip2PropTypes,
    componentDidMount: function ()
    {
        if (this.props.hasOwnProperty('tooltip')
            && this.refs.tooltip
            && typeof this.refs.tooltip.reposition === 'function')
        {
            this.refs.tooltip.reposition();
        }
    },
    componentDidUpdate: function ()
    {
        if (this.props.hasOwnProperty('tooltip')
            && this.isMounted()
            && this.refs.tooltip
            && typeof this.refs.tooltip.reposition === 'function')
        {
            this.refs.tooltip.reposition();
        }

    }
};

var _tip2 = module.exports = core.createClass({
    mixins: [
        {
            propTypes: _tip2PropTypes
        }
    ],
    getDefaultProps: function ()
    {
        return {
            tooltip: '',
            tooltipDelay: 100,
            tooltipPosition: 'bottom',
            tooltipAnimation: 'fade-in',
        };
    },
    getInitialState: function ()
    {
        return {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            repositionTimeoutId: null
        };
    },
    reposition: function ()
    {
        
        if (this.state.repositionTimeoutId != null)
        {
            clearTimeout(this.state.repositionTimeoutId);
            this.state.repositionTimeoutId = null;
        }
        if (this.isMounted())
        {
            var thisDom = this.getDOMNode();

            var rect = thisDom.getBoundingClientRect();
            var target = thisDom.parentNode.getBoundingClientRect();

            var top = this.state.top, left = this.state.left;
            switch (this.props.tooltipPosition)
            {
                case 'bottom':
                    top += Math.floor(target.bottom - rect.top);
                    left += Math.floor((target.right + target.left
                        - rect.right - rect.left) / 2);
                    break;
                case 'top':
                    top += Math.floor(target.top - rect.bottom);
                    left += Math.floor((target.right + target.left
                        - rect.right - rect.left) / 2);
                    break;
                case 'left':
                    top += Math.floor((target.bottom + target.top - rect.bottom - rect.top) / 2);
                    left += Math.floor(target.left - rect.right);
                    break;
                case 'right':
                    top += Math.floor((target.bottom + target.top - rect.bottom - rect.top) / 2);
                    left += Math.floor(target.right - rect.left);
                    break;
                case 'top-left':
                    top += Math.floor(target.top - rect.bottom);
                    left += Math.floor(target.right - rect.right);
                    break;
                case 'top-right':
                    top += Math.floor(target.top - rect.bottom);
                    left += Math.floor(target.left - rect.left);
                    break;
                case 'bottom-left':
                    top += Math.floor(target.bottom - rect.top);
                    left += Math.floor(target.right - rect.right);                    
                    break;
                case 'bottom-right':
                    top += Math.floor(target.bottom - rect.top);
                    left += Math.floor(target.left - rect.left);
                    break;
            }
            
            //isHover can be used to adjust position of tip element to allow animations that moves the tip position
            
            /* Experimental :hover detection */
            if (this.props.tooltipAnimation == 'fade-in')
            {
                var isHover = thisDom.parentNode.parentNode.querySelector('*:hover') === thisDom.parentNode;
                if(!isHover)
                {
                    switch(this.props.tooltipPosition)
                    {
                        case 'top':
                        case 'top-left':
                        case 'top-right':
                            top += 5;
                            break;
                        case 'bottom':
                        case 'bottom-left':
                        case 'bottom-right':
                            top -= 5;
                            break;
                        case 'left':
                            left += 5;
                            break;
                        case 'right':
                            left -= 5;
                            break;
                        }
                }
            }
            if (this.state.top != top || this.state.left != left)
            {
                this.setState({
                    top: top,
                    left: left
                });
            }
        }
        else
        {
            //set timeout to reposition
            var self = this;
            this.state.repositionTimeoutId = setTimeout(function ()
            {
                self.reposition();
            }, 50);
        }
    },
    handleClick: function (e)
    {
        /* Prevent triggering onClick event of parent by clicking the tip */
        if (this.props.tooltipAllowClick !== true)
        {
            e.stopPropagation();
        }
    },
    render: function ()
    {
        var className = ['tooltip'];
        if (this.props.tooltipAlways === true)
        {
            className.push('always');
        }
        switch(this.props.tooltipAnimation)
        {
            case 'fade': className.push('hover-fade');
                break;
            case 'fade-in': className.push('hover-fade-in');
                break;
        }
        var delay = parseInt(this.props.tooltipDelay);
        if (delay > 0)
        {
            if(delay<=100)
            {
                className.push('delay100');
            }
            else if(delay<=200)
            {
                className.push('delay200');
            }
            else
            {
                className.push('delay300');
            }
        }

        className.push(this.props.tooltipPosition);
        var props = {
            className: className.join(' '),
            onClick: this.handleClick,
            style: {
                left: this.state.left + 'px',
                top: this.state.top + 'px'
            },
            children: [
                dom.div({
                    className: 'tooltip-arrow'
                }),
                dom.div({
                    className: 'tooltip-inner',
                    children: this.props.tooltip
                })
            ]
        };
        
        
        return dom.div(props);
    }
})


_tip2.mixin = _tip2Mixin;
_tip2.attach = function ()
{
    return _tip2(_tip2.transferProps.call(this, {
        ref: 'tooltip'
    }));
}
_tip2.transferProps = function (props)
{
    if (this.props.hasOwnProperty('tooltip'))
    {
        props.tooltip = this.props.tooltip;
    }
    if (this.props.hasOwnProperty('tooltipDelay'))
    {
        props.tooltipDelay = this.props.tooltipDelay;
    }
    if (this.props.hasOwnProperty('tooltipPosition'))
    {
        props.tooltipPosition = this.props.tooltipPosition;
    }
    if (this.props.hasOwnProperty('tooltipAlways'))
    {
        props.tooltipAlways = this.props.tooltipAlways;
    }
    if (this.props.hasOwnProperty('tooltipAnimation'))
    {
        props.tooltipAnimation = this.props.tooltipAnimation;
    }
    return props;

};
