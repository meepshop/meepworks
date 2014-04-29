"use strict";
var react = require("react");
var core = require('meepworks-core');
var meepMenu = require('meepworks-menu');
var meepInput = require('meepworks-input');

var dom = react.DOM;
var propTypes = react.PropTypes;

/* mixin defination for multilingual */
var _lnPagination = {
    propTypes: {
        lnPaginationFirstPage: propTypes.string,
        lnPaginationFirstPageTip: propTypes.string,
        lnPaginationLastPage: propTypes.string,
        lnPaginationLastPageTip: propTypes.string
    }
};


var _pagination = module.exports = core.createClass({
    mixins: [
        _lnPagination
    ],
    getDefaultProps: function ()
    {
        return {
            page: 0,
            count: 0,
            step: 10,
            lnPaginationFirstPage: '<<',
            lnPaginationLastPage: '>>',
            lnPaginationFirstPageTip: 'First Page',
            lnPaginationLastPageTip: 'Last Page'
        };
    },
    propTypes: {
        page: propTypes.number.isRequired,	//current displayed page
        count: propTypes.number.isRequired, //number of total items
        step: propTypes.number.isRequired,	//number displayed per page
        onChange: propTypes.func.isRequired

    },
    getInitialState: function ()
    {
        return {
            btnLimit: 2	//number of buttons to show on either side of current page
            /* should be showing 2*btnLimit + 1 page buttons */
        };
    },
    componentDidMount: function ()
    {
        core.addEventListener('resize', this.checkSize);
        this.checkSize();
    },
    checkSize: function (e)
    {
        var parentRect = this.getDOMNode().parentNode.getBoundingClientRect();
        /* get bounding rectangle of parent node */
        var btnLimit = Math.floor((parentRect.right - parentRect.left) / 90 - 1);
        /* 
			Assume each button is 45px and subtract 2 buttons for first and last.			
		*/
        if (btnLimit < 1)
        {
            btnLimit = 1;	// we want to have at least 3 page buttons
        }
        if (btnLimit > 3)
        {
            btnLimit = 3;	//at most 7 page buttons
        }
        if (btnLimit != this.state.btnLimit)
        {
            this.setState({
                btnLimit: btnLimit
            });
        }
    },
    componentWillUnmount: function ()
    {
        core.removeEventListener('resize', this.checkSize);
    },
    handleClick: function (idx)
    {
        if (this.props.onChange)
        {
            this.props.onChange(idx);
        }
    },
    getMenu: function ()
    {

        var lastPage = (this.props.step > 0 && this.props.count > 0) ? (Math.ceil(this.props.count / this.props.step) - 1) : 0;
        var disabled = this.props.page == 0;
        var menu = [{
            label: this.props.lnPaginationFirstPage,
            disabled: disabled,
            onClick: disabled ? null : this.handleClick.bind(this, 0),
            tooltip: this.props.lnPaginationFirstPageTip
        }];
        var i = this.props.page - this.state.btnLimit;
        var limit = this.props.page + this.state.btnLimit;
        if (i < 0)
        {
            limit -= i;
            i = 0;
            if (limit > lastPage)
            {
                limit = lastPage;
            }
        }
        if (limit > lastPage)
        {
            i -= (limit - lastPage);
            limit = lastPage;
            if (i < 0)
            {
                i = 0;
            }
        }

        while (i <= limit)
        {
            disabled = i == this.props.page;
            menu.push({
                onClick: disabled ? null : this.handleClick.bind(this, i),
                className: disabled ? 'active': '',
                label: ++i
            });
        }
        disabled = this.props.page == lastPage;
        menu.push({
            label: this.props.lnPaginationLastPage,
            disabled: disabled,
            onClick: disabled ? null : this.handleClick.bind(this, lastPage),
            tooltip: this.props.lnPaginationLastPageTip
        });
        return menu;
    },
    render: function ()
    {
        var props = {
            className: 'pagination',
            menu: this.getMenu()
        };
        return meepMenu.listMenu(props);
    }
});

_pagination.lnMixin = _lnPagination;
_pagination.transferLnProps = function (props)
{
    if (this.props.hasOwnProperty('lnPaginationFirstPage'))
    {
        props.lnPaginationFirstPage = this.props.lnPaginationFirstPage;
    }
    if (this.props.hasOwnProperty('lnPaginationFirstPageTip'))
    {
        props.lnPaginationFirstPageTip = this.props.lnPaginationFirstPageTip;
    }
    if (this.props.hasOwnProperty('lnPaginationLastPage'))
    {
        props.lnPaginationLastPage = this.props.lnPaginationLastPage;
    }
    if (this.props.hasOwnProperty('lnPaginationLastPageTip'))
    {
        props.lnPaginationLastPageTip = this.props.lnPaginationLastPageTip;
    }
    return props;
};

var _lnStatusDisplay = {
    propTypes: {
        lnPaginationStatusDisplay: propTypes.string
    }
};
var _statusDisplay = _pagination.statusDisplay = core.createClass({
    mixins: [
       _lnStatusDisplay
    ],
    getDefaultProps: function ()
    {
        return {
            page: 0,
            step: 0,
            count: 0,
            lnPaginationStatusDisplay: "Showing {{from}} to {{to}} of {{count}} entries"
        };
    },
    propTypes: {
        page: propTypes.number.isRequired,
        step: propTypes.number.isRequired,
        count: propTypes.number.isRequired
    },
    render: function ()
    {
        var from = 0, to = 0;
        if (this.props.count !== 0)
        {
            from = this.props.page * this.props.step + 1;
            to = this.props.step == -1 ? this.props.count : from + this.props.step - 1;
            to = (to > this.props.count) ? this.props.count : to;
        }
        var props = {
            children: core.format(this.props.lnPaginationStatusDisplay, {
                from: from,
                to: to,
                count: this.props.count
            })
        };
        if (this.props.className)
        {
            props.className = this.props.className;
        }
        return react.DOM.div(props);
    }
});
_statusDisplay.lnMixin = _lnStatusDisplay;
_statusDisplay.transferLnProps = function (props)
{
    if (this.props.hasOwnProperty('lnPaginationStatusDisplay'))
    {
        props.lnPaginationStatusDisplay = this.props.lnPaginationStatusDisplay;
    }
    return props;
};


var _lnStepSetting = {
    propTypes: {
        lnPaginationSetting: propTypes.string,
        lnPaginationOptionAll: propTypes.string
    }
};
var _stepSetting = _pagination.stepSetting = core.createClass({
    mixins: [
        _lnStepSetting
    ],
    getDefaultProps: function ()
    {
        return {
            step: 0,
            options: [10, 25, 50, 100],
            allowAll: true,
            lnPaginationSetting: 'Show {{options}} entries',
            lnPaginationOptionAll: 'All'
        };
    },
    propTypes: {
        step: propTypes.number.isRequired,
        options: propTypes.array,
        allowAll: propTypes.bool,
        onChange: propTypes.func.isRequired
    },
    handleChange: function (step)
    {
        if (this.props.onChange)
        {
            this.props.onChange(parseInt(step));	//coerce to int
        }
    },
    render: function ()
    {
        var display = this.props.lnPaginationSetting.split('{{options}}');
        var options = this.props.options.map(function (step)
        {
            return {
                value: step,
                label: step
            }
        });
        if (this.props.allowAll === true)
        {
            options.push({
                value: -1,
                label: this.props.lnPaginationOptionAll
            });
        }

        return dom.label({
            children: [
				display[0],
				meepInput.select({
				    value: this.props.step,
				    options: options,
				    onChange: this.handleChange
				}),
				display[1]
            ]

        });
    }
});
_stepSetting.lnMixin = _lnStepSetting;
_stepSetting.transferLnProps = function (props)
{
    if (this.props.hasOwnProperty('lnPaginationSetting'))
    {
        props.lnPaginationSetting = this.props.lnPaginationSetting;
    }
    if (this.props.hasOwnProperty('lnlnPaginationOptionAll'))
    {
        props.lnPaginationOptionAll = this.props.lnPaginationOptionAll;
    }
    return props;
};