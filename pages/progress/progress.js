"use strict";

var core = require('meepworks-core');
var react = require('react');
var meepForm = require('meepworks-form');
var meepApp = require('meepworks-app');
var meepInput = require('meepworks-input');
var meepPanel = require('meepworks-panel');


var dom = react.DOM;


var progress = module.exports = core.createClass({
	getInitialState: function ()
	{
		return {
			checked: false,
			value: ['123', 'abc'],
			col: true
		};
	},
	handleChange: function (val)
	{
		
		this.setState({
			value: val
		});
	},
	handleClose: function ()
	{
		console.log('close');
	},
	handleCollapse: function ()
	{
		this.setState({
			col: !this.state.col
		});
	},
	componentDidMount: function ()
	{
	    //this.state.timeout = setTimeout(this.test, 5000);
	    //this.state.interval = setInterval(this.test, 1000);
	},
	componentWillUnmount: function ()
	{
		if(this.state.timeout)
		{
			clearTimeout(this.state.timeout);
			this.state.timeout = null;
		}
		if(this.state.interval)
		{
		    clearInterval(this.state.interval);
		}
	},
	test: function ()
	{
		//this.refs['panel'].setCollapsed(false);
		// this.setState({
		// 	checked: 1
		// });
		 //this.refs.input.setValue(['1', '2']);
	    //console.log(this.refs.input.getValue());
	    this.setState({
	        checked: !this.state.checked
	    });
	},
	render: function ()
	{

		return meepApp({
			body: meepApp.body({
				content: meepPanel({
					ref: 'panel',
					canCollapse: true,
					//startCollapsed: true,
					canExpand: true,
					fullscreen: true,
					title: 'Default Panel',
					body: [
                        meepInput.checkbox({
                            checked: this.state.checked,
                            readOnly: true
                        }),
                        meepInput.checkbox({
                            checked: !this.state.checked,
                            readOnly: true
                        }),
                        dom.button({
                            children: 'test',
                            onClick: this.test
                        })
					],
					footer: 'footer',
					onClose: this.handleClose,
					animateCollapse: true
				})
			})
		});
	}
});