/**
*   progress.js
*/

var react = require('react');
var core = require('meepworks-core');

var dom = react.DOM;
var propTypes = react.PropTypes;



var _progress = module.exports = core.createClass({
    getDefaultProps: function ()
    {
        return {
            style: 'animated',
            direction: 'left',
            progress: 0
        };
    },
    propTypes: {
        style: propTypes.oneOf(['none', 'striped', 'animated']),
        bootstrapStyle: propTypes.oneOf(['default', 'primary', 'success', 'info', 'warning', 'danger']),
        direction: propTypes.oneOf(['top', 'bottom', 'left', 'right']),
        size: propTypes.oneOf(['lg', 'deault', 'sm']),
        color: propTypes.string,
        progress: propTypes.number,
        text: propTypes.string,
        hideText: propTypes.bool,
        className: propTypes.string

    },
    getInitialState: function ()
    {
        return {
            width: 0,
            height: 0,
            intervalId: null
        };
    },
    componentDidMount: function ()
    {
        //if(this.state.intervalId)
        //{
        //    clearInterval(this.state.intervalId);
        //}
        //this.state.intervalId = setInterval(this.checkWidth, 300);
        //core.addEventListener('resize', this.checkWidth);
        core.addEventListener('layout', this.checkWidth);
        this.checkWidth();
    },
    componentWillUnmount: function ()
    {
        clearInterval(this.state.intervalId);
        //core.removeEventListener('resize', this.checkWidth);
        core.removeEventListener('layout', this.checkWidth);
    },
    checkWidth: function ()
    {
        if(this.isMounted())
        {
            var rect = this.getDOMNode().getBoundingClientRect();
            var width = Math.floor(rect.right - rect.left);
            var height = Math.floor(rect.bottom - rect.top);
            if (width != this.state.width || height != this.state.height)
            {
                this.setState({
                    width: width,
                    height: height
                });
            }
        }
    },
    render: function ()
    {
        var className = ['progress'];
        if (this.props.hasOwnProperty('className'))
        {
            className.push(this.props.className);
        }
        switch(this.props.style)
        {
            case 'animated':
                className.push('active');
            case 'striped':
                className.push('progress-striped');
                break;
        }
        
        switch(this.props.size)
        {
            case 'lg':
            case 'sm':
                className.push('progress-' + this.props.size);
                break;
        }
        var isVertical = false;
        switch(this.props.direction)
        {
            case 'right':
                className.push('right');
                break;
            case 'top':
                className.push('vertical', 'top');
                isVertical = true;
                break;
            case 'bottom':
                className.push('vertical', 'bottom');
                isVertical = true;
                break;
        }

        var props = {
            className: className.join(' ')
        };
        var percent = this.props.progress + '%';
        var display = null;
        if (this.props.hideText !== true)
        {
            display = this.props.hasOwnProperty('text') ? this.props.text : percent;
        }

        var progressStyle = {};
        var progressClass = ['progress-bar'];
        if (this.props.hasOwnProperty('color'))
        {
            progressStyle['background-color'] = this.props.color;
        }
        var textStyle = {};
        if (isVertical)
        {
            progressStyle.height = percent;
            textStyle.height = this.state.height + 'px';
            textStyle['line-height'] = this.state.height + 'px';
        }
        else
        {
            progressStyle.width = percent;
            textStyle.width = this.state.width + 'px';
        }
        switch (this.props.bootstrapStyle)
        {
            case 'primary':
            case 'success':
            case 'info':
            case 'warning':
            case 'danger':
                progressClass.push('progress-bar-' + this.props.bootstrapStyle);
                break;
        }

        return dom.div(props,
            dom.span({
                className: 'progressbar-back-text',
                style: textStyle
            }, display),
            dom.div({
                className: progressClass.join(' '),
                style: progressStyle
            },
            dom.span({
                ref: 'front-text',
                className: 'progressbar-front-text',
                style: textStyle
            }, display)
            )
            );
    }
});

//dom.div({
//    className: 'progress progress-striped active'
//}, dom.span({
//    className: 'progressbar-back-text'
//}, '40%'),
//                    dom.div({
//                        className: 'progress-bar progress-bar-info',
//                        style: {
//                            width: '40%'
//                        }
//                    }, dom.span({
//                        className: 'progressbar-front-text'
//                    }, '40%')))
