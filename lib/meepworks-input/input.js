/*
*	abstract input elements to provide generic functions such as:
* 		get/set value
*	 	isChecked/ setChecked
*	Implements complex input types:
*		tag inputs
*/
"use strict";

var react = require('react');
var core = require('meepworks-core');
var button = require('meepworks-button');

var dom = react.DOM;
var propTypes = react.PropTypes;

var _input = module.exports = {};


var _publicMixins = _input.mixins = {

};
var _cache = {
    readOnlyMsg: 'Warning: You supplied prop `value` without `onChange` handler or `readOnly` property. This component will be read only.',
    setValueError: 'Warning: setValue has no effect when `value` property is specified.',
    setCheckedError: 'Warning: setChecked has no effect when `checked` property is specified.',
    initialValueError: 'Warning: `initialValue` has no effect when `value` is defined.'
}
var _mixins = {
    /* base */
    base: {
        propTypes: {
            id: propTypes.string,
            name: propTypes.string,
            readOnly: propTypes.bool,
            onChange: propTypes.func,
            disabled: propTypes.bool,
        }
    },
    /* input.text, input.password, input.textarea */
    text: {
        propTypes: {
            value: function (props, propName, componentName)
            {
                if (props.hasOwnProperty(propName))
                {
                    if (typeof props.onChange !== 'function' && !props.readOnly)
                    {
                        console.log(_cache.readOnlyMsg);
                    }
                }
            },
            initialValue: propTypes.string
        },
        getInitialState: function ()
        {
            return {
                value: '',
                useState: true
            };
        },
        componentDidMount: function ()
        {
            if (this.props.hasOwnProperty('value'))
            {
                this.setState({
                    useState: false
                });
            }
            else
            {
                if (this.props.hasOwnProperty("initialValue"))
                {
                    this.setState({
                        value: this.props.initialValue
                    });
                }
            }
        },
        handleChange: function (e)
        {
            var val = e.target.value;
            if (val != this.getValue())
            {
                if (this.state.useState)
                {
                    this.setState({
                        value: val
                    });
                }
                if (this.props.onChange)
                {
                    this.props.onChange(e.target.value, e);
                }
            }
        },
        getValue: function ()
        {
            return this.state.useState ? this.state.value : this.props.value;
        },
        setValue: function (val)
        {
            if (this.state.useState)
            {
                this.setState({
                    value: val
                });
                return true;
            }
            console.log(_cache.setValueError);
            return false;
        },
    },

    /* focus handlers and blur handlers */
    focusBlur: {
        propTypes: {
            onBlur: propTypes.func,
            focus: propTypes.bool,
            onFocus: propTypes.func
        },
        componentDidMount: function ()
        {
            if (this.props.focus)
            {
                this.focus();
            }
        },
        componentDidUpdate: function ()
        {
            if (this.props.focus)
            {
                this.focus();
            }
        },
        handleFocus: function (e)
        {
            if (this.props.onFocus)
            {
                this.props.onFocus(e);
            }
        },
        handleBlur: function (e)
        {
            if (this.props.onBlur)
            {
                this.props.onBlur(e);
            }
        },
        focus: function ()
        {
            this.refs.input.getDOMNode().focus();
        }
    },
    keyDown: {
        propTypes: {
            onKeyDown: propTypes.func
        },
        handleKeyDown: function (e)
        {
            if (this.props.onKeyDown)
            {
                this.props.onKeyDown(e);
            }
        }
    }
};
var _genericRender = function (type)
{
    var props = {
        type: type,
        ref: 'input',
        //onChange: this.handleChange
    };
    
    if (this.props.id)
    {
        props.id = this.props.id;
    }
    if (this.props.name)
    {
        props.name = this.props.name;
    }
    if (this.props.disabled)
    {
        props.disabled = true;
    }
    if (this.props.className)
    {
        props.className = this.props.className;
    }
    if (this.props.readOnly)
    {
        props.readOnly = this.props.readOnly;
    }
    else
    {
        props.onChange = this.handleChange;
    }
    switch (type)
    {
        case 'text':
        case 'password':
        case 'textarea':
            props.value = this.getValue();
            props.onBlur = this.handleBlur;
            props.onKeyDown = this.handleKeyDown;
            props.onFocus = this.handleFocus;
            if (type == 'textarea')
            {
                return dom.textarea(props);
            }
            else
            {
                props.placeholder = this.props.placeholder;
                return dom.input(props);
            }
            break;
        case 'checkbox':
            if (props.hasOwnProperty('value'))
            {
                props.value = this.props.value;
            }
            props.checked = this.isChecked();
            return dom.input(props);
            break;
        case 'radio':
            if (props.hasOwnProperty('value'))
            {
                props.value = this.props.value;
            }
            if (!this.state.useState)
            {
                props.checked = this.props.checked;
            }
            return dom.input(props);
            break;
        case 'select':
            props.value = this.getValue();
            if (this.props.multi)
            {
                props.multiple = true;
            }
            props.children = this.props.options.map(function (item, idx)
            {
                return dom.option({
                    value: item.value,
                    children: item.label,
                    key: item.value + ':' + idx
                });
            });
            return dom.select(props);
            break;



    }
}
var _textInput = _input.text = core.createClass({
    mixins: [
	_mixins.base,
	_mixins.text,
	_mixins.focusBlur,
	_mixins.keyDown
    ],
    render: function ()
    {
        return _genericRender.call(this, 'text');
    }

});
var _passwordInput = _input.password = core.createClass({
    mixins: [
	_mixins.base,
	_mixins.text,
	_mixins.focusBlur,
	_mixins.keyDown
    ],
    render: function ()
    {
        return _genericRender.call(this, 'password');
    }
});
var _textarea = _input.textarea = core.createClass({
    mixins: [
	_mixins.base,
	_mixins.text,
	_mixins.focusBlur,
	_mixins.keyDown
    ],
    render: function ()
    {
        return _genericRender.call(this, 'textarea');
    }
});
/*
    checkbox
*/
var _checkbox = _input.checkbox = core.createClass({
    mixins: [
	_mixins.base
    ],
    propTypes: {
        checked: propTypes.bool,
        defaultChecked: propTypes.bool
    },
    getInitialState: function ()
    {
        return {
            useState: true,
            checked: false
        };
    },
    componentDidMount: function ()
    {
        if (this.props.hasOwnProperty('checked'))
        {
            this.setState({
                useState: false
            });
        }
        else
        {
            if (this.props.defaultChecked)
            {
                this.setState({
                    checked: true
                });
            }
        }
    },
    handleChange: function (e)
    {
        console.log('checkbox change');
        var checked = e.target.checked;
        if (this.isChecked() !== checked)
        {
            if (this.state.useState)
            {
                this.setState({
                    checked: checked
                });
            }
            if (this.props.onChange)
            {
                this.props.onChange(checked, e);
            }
        }
    },
    isChecked: function ()
    {
        return this.state.useState ? this.state.checked : this.props.checked;
    },
    setChecked: function (checked, e)
    {
        if (this.isChecked() !== checked)
        {
            if (this.state.useState)
            {
                this.setState({
                    checked: checked
                });
                return true;
            }
            console.log(_cache.setCheckedError);
        }
        return false;
    },
    render: function ()
    {
        console.log('render');
        return _genericRender.call(this, 'checkbox');
    }
});


var _radio = _input.radio = core.createClass({
    mixins: [
	_mixins.base
    ],
    propTypes: {
        checked: function (props, propName)
        {
            if (props.hasOwnProperty(propName))
            {
                if (typeof props.onChange !== 'function' && !props.readOnly)
                {
                    console.log(_cache.readOnlyMsg)
                }
            }
        }
    },
    getInitialState: function ()
    {
        return {
            useState: true	/* use browser's state */
        };
    },
    componentDidMount: function ()
    {
        if (this.props.hasOwnProperty('checked'))
        {
            this.setState({
                useState: false
            });
        }
    },
    isChecked: function ()
    {
        if (this.state.useState)
        {
            if (!this.isMounted())
            {
                return false;
            }
            else
            {
                return this.getDOMNode().checked;
            }
        }
        else
        {
            return this.props.checked;
        }
    },
    setChecked: function (checked)
    {
        if (checked != this.isChecked())
        {
            if (this.state.useState)
            {
                if (this.isMounted())
                {
                    this.getDOMNode().checked = checked;
                    return true;
                }
            }
            console.log(_cache.setCheckedError);
        }
        return false;
    },
    handleChange: function (e)
    {
        /* Similar to default html behavior, handleChange is only triggered on selection.*/
        var checked = e.target.checked;
        if (checked != this.isChecked() && this.props.onChange)
        {
            this.props.onChange(checked, e);
        }
    },
    render: function ()
    {
        return _genericRender.call(this, 'radio');
    }
});

var _arrayCheck = function (props, propName)
{
    if (props.hasOwnProperty(propName))
    {
        if (props.multi && !Array.isArray(props[propName]))
        {
            console.log('Warning: You have set `multi` to true, `' + propName + '` is expected to be an array.');
        }
    }
};

var _selectInput = _input.select = core.createClass({
    mixins: [
	_mixins.base,
	_mixins.focusBlur
    ],
    getDefaultProps: function ()
    {
        return {
            options: []
        };
    },
    propTypes: {
        options: propTypes.array,
        multi: propTypes.bool,
        value: _arrayCheck,
        initialValue: function (props, propName)
        {
            if (props.hasOwnProperty(propName))
            {
                if (props.hasOwnProperty('value'))
                {
                    console.log(_cache.initialValueError);
                }
                else
                {
                    _arrayCheck(props, propName);
                }
            }
        }
    },
    getInitialState: function ()
    {
        return {
            value: null,
            useState: true
        };
    },
    componentDidMount: function ()
    {
        if (this.props.hasOwnProperty('value'))
        {
            this.setState({
                useState: false
            });
        }
        else
        {
            if (this.props.hasOwnProperty('initialValue'))
            {
                this.setState({
                    value: this.props.initialValue
                });
            }
            else
            {
                this.setState({
                    value: this.props.multi ? [] : this.getDOMNode().value
                });
            }
        }
    },
    handleChange: function (e)
    {
        var value;
        if (this.props.multi)
        {
            value = [];
            for (var i = 0, len = e.target.children.length; i < len; i++)
            {
                if (e.target.children[i].selected)
                {
                    value.push(e.target.children[i].value);
                }
            }

        }
        else
        {
            value = e.target.value;
        }
        if (this.state.useState)
        {
            this.setState({
                value: value
            });
        }
        if (this.props.onChange)
        {
            this.props.onChange(value, e);
        }
    },
    getValue: function ()
    {
        return this.state.useState ? this.state.value : this.props.value;
    },
    setValue: function (val)
    {
        if (this.state.useState)
        {
            if (this.props.multi && !Array.isArray(val))
            {
                console.log('Error: You set a non-array value to a multiple selection input');
                return false;
            }
            this.setState({
                value: val
            });
            return true;
        }
        else
        {
            console.log(_cache.setValueError);
        }
        return false;
    },
    render: function ()
    {
        return _genericRender.call(this, 'select');
    }
});


var _tag = core.createClass({
    render: function ()
    {
        return dom.span({
            className: 'tag',
            children: [
			this.props.value,
			button({
			    label: 'x',
                buttonStyle: 'icon',
			    onClick: this.props.onRemove
			})
            ]
        })
    }
});

var _tagInput = _input.tag = core.createClass({
    mixins: [
	_mixins.base
    ],
    getDefaultProps: function ()
    {
        return {
            lnPlaceholder: 'add a tag'
        };
    },
    propTypes: {
        value: function (props, propName)
        {
            if (props.hasOwnProperty(propName))
            {
                if (typeof props.onChange !== 'function' && !props.readOnly)
                {
                    console.log(_cache.readOnlyMsg);
                }
                else
                {
                    propTypes.array(props, propName);
                }
            }
        },
        initialValue: function (props, propName)
        {
            if (props.hasOwnProperty(propName))
            {
                if (props.hasOwnProperty('value'))
                {
                    console.log(_cache.initialValueError);
                }
                else
                {
                    propTypes.array(props, propName);
                }
            }
        },
        multi: propTypes.bool,
        lnPlaceholder: propTypes.string
    },
    getInitialState: function ()
    {
        return {
            useState: true,
            value: [],
            focus: false,
            valid: true,
            inputValue: ''
        };

    },
    componentDidMount: function ()
    {
        if (this.props.hasOwnProperty('value'))
        {
            this.setState({
                useState: false
            });
        }
        else
        {
            if (this.props.hasOwnProperty('initialValue'))
            {
                this.setState({
                    value: this.props.initialValue
                });
            }
        }
    },
    handleFocus: function (e)
    {
        this.setState({
            focus: true
        });
    },
    handleBlur: function (e)
    {
        this.setState({
            focus: false
        });
        this.handleAddTag();
    },
    handleInputChange: function (val, e)
    {
        this.setState({
            inputValue: val
        });
        this.validateInput(val);
    },
    handleKeyDown: function (e)
    {
        if (e.which == 13)
        {
            this.handleAddTag();
        }
        else if (e.which == 8 && this.state.inputValue == '')
        {
            if (this.state.useState)
            {
                if (this.state.value.length > 0)
                {
                    this.removeTag(this.state.value[this.state.value.length - 1]);
                }
            }
            else
            {
                if (this.props.value.length > 0)
                {
                    this.removeTag(this.props.value[this.props.value.length - 1]);
                }
            }
        }
    },
    handleAddTag: function ()
    {
        var val = this.state.inputValue;
        if (val != '' && this.validateInput(val))
        {
            var newValue;
            if (this.state.useState)
            {
                newValue = this.state.value;
                newValue.push(val);
                this.setState({
                    value: newValue
                });

            }
            else
            {
                newValue = this.props.value.slice(0, this.props.value.length);
                newValue.push(val);
            }
            this.setState({
                inputValue: ''
            });
            if (this.props.onChange)
            {
                this.props.onChange(newValue);
            }
        }
    },
    validateInput: function (val)
    {
        if (this.getValue().indexOf(val) > -1)
        {
            this.setState({
                valid: false
            });
            return false;
        }
        if (!this.state.valid)
        {
            this.setState({
                valid: true
            });
        }
        return true;
    },
    getValue: function ()
    {
        return this.state.useState ? this.state.value : this.props.value;
    },
    setValue: function (val)
    {
        if (Array.isArray)
        {
            if (this.state.useState)
            {
                this.setState({
                    value: val
                });
                return true;
            }
            console.log(_cache.setValueError);
        }
        else
        {
            console.log('Error: tag input only accepts array values');
        }
        return false;
    },
    addTag: function (val)
    {
        this.refs.input.setValue(val);
        this.handleAddTag();
    },
    removeTag: function (val)
    {
        var newValue;
        if (this.state.useState)
        {
            var idx = this.state.value.indexOf(val);
            if (idx > -1)
            {
                this.state.value.splice(idx, 1);
                this.setState({
                    value: this.state.value
                });
                newValue = this.state.value;
            }
        }
        else
        {
            var idx = this.props.value.indexOf(val);
            if (idx > -1)
            {
                newValue = this.props.value.slice(0, this.props.value.length);
                newValue.splice(idx, 1);
            }
        }
        if (!this.state.valid)
        {
            this.validateInput(this.state.inputValue);
        }
        if (this.props.onChange)
        {
            this.props.onChange(newValue);
        }
    },
    render: function ()
    {
        var className = ['tagsinput'];
        if (this.props.className)
        {
            className.push(this.props.className);
        }
        if (this.state.focus)
        {
            className.push('focus');
        }
        var props = {
            className: className.join(' '),
            style: {
                height: this.props.multi ? 'auto' : '32px'
            },
            children: [_textInput({
                ref: 'hidden',
                name: this.props.name,
                className: 'hide',
                value: this.getValue().join(','),
                readOnly: true
            })],
            onClick: this.handleFocus
        };
        var self = this;
        this.getValue().forEach(function (val)
        {
            props.children.push(_tag({
                value: val,
                onRemove: self.removeTag.bind(self, val)
            }));
        });
        props.children.push(dom.div({
            children: _textInput({
                ref: 'input',
                id: this.props.id,
                placeholder: this.state.focus ? '' : this.props.lnPlaceholder,
                focus: this.state.focus,
                className: this.state.valid ? '' : 'not_valid',
                value: this.state.inputValue,
                onBlur: this.handleBlur,
                onKeyDown: this.handleKeyDown,
                onChange: this.handleInputChange
            })
        }));
        return dom.div(props);
    }

})