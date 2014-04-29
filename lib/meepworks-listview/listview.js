"use strict";
var react = require('react');
var core = require('meepworks-core');
var pagination = require('meepworks-pagination');
var button = require('meepworks-button');
var input = require('meepworks-input');
var icon = require('meepworks-icon');
var tip = require('meepworks-tip');

var dom = react.DOM;
var animation = react.addons.CSSTransitionGroup;
var propTypes = react.PropTypes;


var _mixins = {
    listview: {
        getDefaultProps: function ()
        {
            return {
                columns: []
            };
        },
        propTypes: {
            columns: propTypes.array,
            className: propTypes.string
        }
    }
};
/*
    _listivew is an component for displaying data
*/
var _lnListview = {
    propTypes: {
        lnListviewNoData: propTypes.string,
        lnListviewDisplayButton: propTypes.string,
        lnListivewDisplayButtonTip: propTypes.string
    }
};
var _listview = module.exports = core.createClass({
    mixins: [
        _lnListview,
        _mixins.listview
    ],
    getDefaultProps: function ()
    {
        return {
            data: [],
            lnListviewNoData: 'No Data',
            lnListviewDisplayButton: 'Display',
            lnListivewDisplayButtonTip: 'Select columns to display',
            rowBody: []
        };
    },
    propTypes: {
        data: propTypes.array,
        onSort: propTypes.func,
        rowBody: propTypes.array    //array mapping of rowBodies to append to each row
    },
    getInitialState: function ()
    {
        return {
            selected: [],
            display: [],
            showDisplay: false
        };
    },
    componentDidMount: function ()
    {
        var state = this.state;
        /* Start with showing all the columns */
        this.props.columns.forEach(function (column, idx)
        {
            state.display.push([column.fieldname, idx]);
        });
        this.forceUpdate();
    },
    componentWillReceiveProps: function (nextProps)
    {
        /* update display menu with new idx if columns changed */
        var display = [];
        var oldDisplay = this.state.display;
        nextProps.columns.forEach(function (column, idx)
        {
            for (var i = 0; i < oldDisplay.length; i++)
            {
                if (column.fieldname == oldDisplay[i][0])
                {
                    oldDisplay[i][1] = idx;
                    display.push(oldDisplay[i]);
                    oldDisplay.splice(i, 1);
                    break;
                }
            }
        });
        this.setState({
            display: display
        });
    },
    handleSelect: function (idx)
    {
        if (idx == -1)	//header checkbox
        {
            var selectedAll = (this.state.selected.length > 0 && this.state.selected.length == this.props.data.length);

            this.state.selected.splice(0, this.state.selected.length);

            if (!selectedAll)
            {
                this.props.data.forEach(function (data, idx)
                {
                    this.state.selected.push(idx);
                }, this);
            }

            this.setState({
                selected: this.state.selected
            });
        }
        else
        {
            var selIdx = this.state.selected.indexOf(idx);
            if (selIdx == -1)
            {
                this.state.selected.push(idx);
            }
            else
            {
                this.state.selected.splice(selIdx, 1);
            }
            this.setState({
                selected: this.state.selected
            });
        }
    },
    getSelected: function ()
    {
        var self = this;
        return this.state.selected.map(function (idx)
        {
            return self.props.data[idx];
        });
    },
    clearSelected: function ()
    {
        this.state.selected.splice(0, this.state.selected.length);
        this.setState({
            selected: this.state.selected
        });
    },
    handleSort: function (fieldname)
    {
        if (this.props.onSort)
        {
            this.props.onSort(fieldname);
        }
        else
        {
            console.log('Warning: `onSort` handler is not set for `listview`. Sorting will not take effect.');
        }
    },
    handleRowClick: function (idx, e)
    {
        if(typeof this.props.onRowClick)
        {
            this.props.onRowClick(this.props.data[idx], idx, e);
        }
    },
    renderHeaders: function ()
    {
        var self = this;
        var headers = [];

        /* render checkbox */
        if (this.props.selectable === true)
        {
            headers.push(_columnHeader({
                key: 'selectBox',
                fieldname: 'selectBox',
                className: 'listview-select',
                label: input.checkbox({
                    onChange: this.handleSelect.bind(this, -1),
                    checked: (this.state.selected.length > 0
							&& this.state.selected.length == this.props.data.length)
                })
            }));
        }
        /* render columns */
        this.state.display.forEach(function (item, idx)
        {
            var column = self.props.columns[item[1]];
            var columnProps = core.transferProps(column, {
                key: column.fieldname + ':' + idx
            });
            if (column.canSort === true)
            {
                columnProps.onSort = self.handleSort.bind(self, column.fieldname);
            }
            headers.push(_columnHeader(columnProps));
        });
        return dom.thead(null,
            dom.tr({
                children: headers
            }));
    },
    renderData: function ()
    {
        var colSpan = this.state.display.length + (this.props.selectable ? 1 : 0);
        var self = this;
        var body = [];
        if (this.props.data.length > 0)
        {
            var odd = true;
            this.props.data.forEach(function (data, idx)
            {
                var content = [];
                /* render checkbox */
                if (self.props.selectable)
                {
                    content.push(dom.td({
                        children: input.checkbox({
                            onChange: self.handleSelect.bind(self, idx),
                            checked: (self.state.selected.indexOf(idx) > -1)
                        })
                    }));
                }
                self.state.display.forEach(function (item)
                {
                    var fieldname = item[0];
                    var props = {
                        key: fieldname + ':' + idx
                    };

                    if (data.hasOwnProperty(fieldname))
                    {
                        props.children = data[fieldname];
                    }
                    content.push(dom.td(props));
                });
                var className = ['hover'];
                if (odd)
                {
                    className.push('odd');
                }
                odd = !odd;
                body.push(dom.tr({
                    key: 'row:' + idx,
                    className: className.join(' '),
                    children: content,
                    onClick: self.handleRowClick.bind(self, idx)
                }));

                /* rowBody */
                if (self.props.rowBody[idx])
                {
                    body.push(dom.tr({
                        key: 'rowBody:' + idx,
                        className: 'rowBody'
                    }, dom.td({
                        colSpan: colSpan
                    }, self.props.rowBody[idx])));
                }

            });
        }
        else
        {
            body = dom.tr({
                className: 'hover odd',
                children: dom.td({
                    colSpan: colSpan,
                    children: this.props.lnListviewNoData

                })
            });
        }
        return dom.tbody({
            key: 'listview-body',
            children: body
        });

    },
    handleSelectDisplay: function (columnIdx, displayIdx)
    {
        if (displayIdx > -1)
        {
            this.state.display.splice(displayIdx, 1);
        }
        else
        {
            this.state.display.push([this.props.columns[columnIdx].fieldname, columnIdx]);
            this.state.display.sort(function (a, b)
            {
                if (a[1] == b[1])
                {
                    return 0;
                }
                else
                {
                    return a[1] > b[1] ? 1 : -1;
                }
            });
        }
        this.setState({
            display: this.state.display
        });
    },
    renderDisplayMenu: function ()
    {
        var self = this;
        var menu = this.props.columns.map(function (column, columnIdx)
        {
            /* check if column is displayed */

            var displayIdx = -1;
            self.state.display.every(function (item, idx)
            {

                if (item[0] === column.fieldname)
                {
                    displayIdx = idx;
                    return false;
                }
                return true;
            });

            return {
                label: [
                    input.checkbox({
                        checked: displayIdx > -1,
                        readOnly: true
                    }),
                    ' ' + column.label
                ],
                active: displayIdx > -1,
                onClick: self.handleSelectDisplay.bind(self, columnIdx, displayIdx)
            };

        });



        return menu;
    },
    render: function ()
    {
        var self = this;
        var className = ['listview'];
        if (this.props.className)
        {
            className.push(this.props.className);
        }
        var props = {
            className: className.join(' ')
        };

        var displayDiv = dom.div({
            className: 'help-block'
        },
        button.menuButton({
            className: 'pull-right',
            label: this.props.lnListviewDisplayButton,
            size: 'xs',
            tooltip: this.props.lnListviewDisplayButtonTip,
            tooltipPosition: 'top',
            dropdownMenu: this.renderDisplayMenu(),
            hideOnAction: false
        })
        );

        var table = _table({
            border: false,
            children: [
                this.renderHeaders(),
                this.renderData()
            ]
        });


        return dom.div(props, displayDiv, table);
    }
});

/* listview.extended:
    The extended listview is an implementation of datatables-like component.
    The queryFn is required for the extended listview to fetch data.
    
*/
var _extended = _listview.extended = core.createClass({
    mixins: [
        _lnListview,
        _mixins.listview,
        pagination.lnMixins,    //propType checking for multilingual properties
        pagination.statusDisplay.lnMixins,
        pagination.stepSetting.lnMixins
    ],
    propTypes: {
        queryFn: propTypes.func.isRequired,
        paginationOptions: propTypes.arrayOf(propTypes.number),
        paginationAllowAll: propTypes.bool,
        initialData: propTypes.array,
        rowBodyFn: propTypes.func
        /* if exist, will pass data into this function
            and put the returned item into the next row
        */
    },
    getInitialState: function ()
    {
        return {
            page: 0,
            count: 0,
            step: 0,
            sort: '',
            filter: '',
            queryCount: 0,
            filterId: null,
            data: [],
            rowBody: []
        };
    },
    componentDidMount: function ()
    {
        if (this.props.hasOwnProperty('initialData'))
        {
            this.setData(this.props.initialData);
        }
        else
        {
            this.queryData({
                step: this.state.step,
                page: this.state.page
            });
        }
    },
    queryData: function (params)
    {
        if (this.props.hasOwnProperty('queryFn'))
        {
            if (params.hasOwnProperty('page'))
            {
                params.sort = this.state.sort;
                params.step = this.state.step;
                params.filter = this.state.filter;
            }
            else if (params.hasOwnProperty('sort'))
            {
                params.page = 0;
                params.step = this.state.step;
                params.filter = this.state.filter;
            }
            else if (params.hasOwnProperty('filter'))
            {
                params.page = 0;
                params.step = this.state.step;
                params.sort = this.state.sort;
            }
            else if (params.hasOwnProperty('step'))
            {
                params.page = 0;
                params.sort = this.state.sort;
                params.filter = this.state.filter;
            }
            else
            {
                return;
            }
            var self = this;
            var token = ++this.state.queryCount;
            this.props.queryFn(params, function (data)
            {
                if (token == self.state.queryCount)
                {
                    self.setData(data)
                }
            });
        }
    },
    setData: function (data)
    {
        if (data.hasOwnProperty('page') && data.page != this.state.page)
        {
            this.state.page = data.page;
        }
        if (data.hasOwnProperty('step') && data.step != this.state.step)
        {
            this.state.step = data.step;
        }
        if (data.hasOwnProperty('count'))
        {
            this.state.count = data.count;
        }
        if (data.hasOwnProperty('sort'))
        {
            this.state.sort = data.sort;
        }
        if (data.hasOwnProperty('items'))
        {
            this.state.data = data.items;
        }
        this.forceUpdate();
    },
    getSelected: function ()
    {
        return this.refs.listview.getSelected();
    },
    clearSelected: function ()
    {
        this.refs.listview.clearSelected();
    },
    handleFilter: function (filter)
    {
        /* add no delay version */
        var self = this;
        if (this.state.filterId)
        {
            clearTimeout(this.state.filterId);
        }
        this.state.filterId = setTimeout(function ()
        {
            self.state.filterId = null;
            self.queryData({
                filter: filter
            });
        }, 300);
    },
    handleSort: function (fieldname)
    {
        this.clearSelected();
        var sort = this.state.sort.split(':');
        if (sort[0] != fieldname)
        {
            sort[0] = fieldname;
            sort[1] = 'asc';
        }
        else
        {
            if (sort[1] == 'asc')
            {
                sort[1] = 'desc';
            }
            else
            {
                sort[1] = 'asc';
            }
        }
        this.queryData({
            sort: sort.join(':')
        });

    },
    handleStepChange: function (step)
    {
        this.clearSelected();
        this.queryData({
            step: step
        });
    },
    handlePageChange: function (page)
    {
        this.clearSelected();
        this.queryData({
            page: page
        });
    },
    handleRowClick: function (data, idx, e)
    {
        var rIdx = this.state.rowBody.indexOf(idx);
        if(rIdx>-1)
        {
            this.state.rowBody.splice(rIdx, 1);
        }
        else
        {
            this.state.rowBody.push(idx);
        }
        this.forceUpdate();
    },
    render: function ()
    {
        var self = this;
        var props = {
            children: []
        };


        var paginationSettingProps = pagination.stepSetting.transferLnProps.call(this, {
            step: this.state.step,
            onChange: this.handleStepChange
        });
        if (this.props.hasOwnProperty('paginationOptions'))
        {
            paginationSettingProps.options = this.props.paginationOptions;
        }
        if (this.props.hasOwnProperty('paginationAllowAll'))
        {
            paginationSettingProps.allowAll = this.props.paginationAllowAll;
        }
        props.children.push(
            dom.div({
                className: 'help-block',
                children: [
                    dom.div({
                        className: 'pull-left',
                        children: pagination.stepSetting(paginationSettingProps)
                    }),
                    dom.div({
                        className: 'pull-right',
                        children: input.text({
                            onChange: this.handleFilter
                        })
                    }),
                    dom.div({
                        className: 'clearfix'
                    })
                ]
            }));


        /* display data using _listview */
        var sort = this.state.sort.split(':');
        var listviewProps = {
            key: 'listview',
            ref: 'listview',
             //selectable: this.props.selectable,
            columns: this.props.columns.map(function (column)
            {
                var tmp = core.transferProps(column, {});
                if (column.fieldname === sort[0])
                {
                    tmp.sort = sort[1];
                }
                return tmp;
            }),
            onRowClick: this.handleRowClick,
            data: this.state.data
        };
        if (typeof this.props.rowBodyFn === 'function')
        {
            listviewProps.rowBody = this.state.data.map(function (item, idx)
            {
                if(self.state.rowBody.indexOf(idx)>-1)
                {
                    return self.props.rowBodyFn(item);
                }
                return null;
            });
        }
        listviewProps.onSort = this.handleSort;
        props.children.push(_listview(listviewProps));


        var paginationProps = pagination.transferLnProps.call(this, {
            page: this.state.page,
            step: this.state.step,
            count: this.state.count,
            onChange: this.handlePageChange
        });
        props.children.push(
            dom.div({
                className: 'help-block',
                children: [
                    dom.div({
                        className: 'pull-left',
                        children: pagination.statusDisplay(
                            pagination.statusDisplay.transferLnProps.call(this, {
                                page: this.state.page,
                                count: this.state.count,
                                step: this.state.step
                            }))
                    }),
                    dom.div({
                        className: 'pull-right',
                        children: pagination(paginationProps)
                    }),
                    dom.div({
                        className: 'clearfix'
                    })
                ]
            }));

        return dom.div(props);
    }
});

var _table /*= module.exports.table*/ = core.createClass({
    getDefaultProps: function ()
    {
        return {
            border: true,
            striped: false,
            hover: false,
            condense: false	 //default padding to 5px instead of 8px
        };
    },
    propTypes: {
        border: propTypes.bool,
        striped: propTypes.bool,
        hover: propTypes.bool,
        condense: propTypes.bool

    },
    render: function ()
    {
        var className = ['table'];
        if (this.props.border)
        {
            className.push('table-bordered');
        }
        if (this.props.striped)
        {
            className.push('table-striped');
        }
        if (this.props.hover)
        {
            className.push('table-hover');
        }
        if (this.props.condense)
        {
            className.push('table-condensed');
        }
        var props = {
            className: className.join(' '),
            children: this.props.children
        };
        return dom.table(props);
    }
});

//var _rowBody = core.createClass({
//    render: function ()
//    {
//        return dom.tr(null, dom.td({}));
//    }
//})

var _columnHeader /* = _listview.columnHeader */ = core.createClass({
    getDefaultProps: function ()
    {
        return {
            label: ''
        };
    },
    propTypes: {
        fieldname: propTypes.string.isRequired,
        className: propTypes.string,
        canSort: propTypes.bool,
        sort: propTypes.oneOf(['asc', 'desc']),
        onSort: propTypes.func
    },
    render: function ()
    {
        var className = [];
        if (this.props.className)
        {
            className.push(this.props.className);
        }
        if (this.props.canSort)
        {
            className.push('sorting');
        }
        if (this.props.sort === 'asc' || this.props.sort === 'desc')
        {
            className.push(this.props.sort);
        }
        var props = {
            className: className.join(' '),
            children: this.props.label,
            onClick: this.props.onSort
        };
        return dom.th(props);
    }
});


