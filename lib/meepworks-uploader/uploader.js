


var react = require('react');
var core = require('meepworks-core');
var progress = require('meepworks-progress');
var button = require('meepworks-button');
var icon = require('meepworks-icon');

var dom = react.DOM;
var propTypes = react.PropTypes;




var _uploader = module.exports = core.createClass({
    getInitialState: function ()
    {
        return {
            files: {}
        };
    },
    handleClick: function (e)
    {
        this.refs.input.getDOMNode().click();
    },
    handleFileSelect: function (e)
    {
        var file = this.refs.input.getDOMNode().files[0];
        if (file)
        {
            if (!this.state.files[file.name])
            {
                this.state.files[file.name] = file;
                this.forceUpdate();
            }
            else if (this.state.files[file.name].lastModifiedDate < file.lastModifiedDate)
            {
                this.state.files[file.name] = file;
                this.forceUpdate();
            }
        }
    },
    getFiles: function ()
    {
        var list = [];
        for(var name in this.state.files)
        {
            list.push(dom.li(null, _fileUpload({ key: 'file-' + name, file: this.state.files[name] })));
        }
        return dom.ul({ className: 'list-unstyled',  children: list });
    },
    render: function ()
    {
        return dom.div(null, 
            dom.div({
                onClick: this.handleClick
            }, 'Upload'),
        dom.input({
            ref: 'input',
            className: 'hide',
            type: 'file',
            onChange: this.handleFileSelect
        }), this.getFiles());
    }
});

var _fileUploadLnMixin = {
    propTypes: {
        lnFileUploadCancel: propTypes.string,
        lnFileUploadDismiss: propTypes.string
    }
};
var _fileUpload = _uploader.fileUpload = core.createClass({
    mixins: [
        _fileUploadLnMixin
    ],
    getDefaultProps: function ()
    {
        return {
            lnFileUploadCancel: 'Cancel',
            lnFileUploadDismiss: 'Dismiss'
        };
    },
    propTypes: {

    },
    getInitialState: function ()
    {
        return {
            progress: 0,
            intervalId: null,
            completed: false
        };
    },
    progress: function ()
    {
        if(this.state.progress <100)
        {
            this.state.progress++;
            if(this.state.progress >=100)
            {
                clearInterval(this.state.intervalId);
                this.state.completed = true;
            }
            this.forceUpdate();
        }
        
    },
    componentDidMount: function ()
    {
        this.state.intervalId = setInterval(this.progress, 200);
    },
    componentWillUnmount: function ()
    {
        clearInterval(this.state.intervalId);
    },
    render: function ()
    {

        // should style the component based on container size instead of screen size.

        var progressProps = {
            progress: this.state.progress
        };
        var btnProps = {
            size: 'xs'
        };
        if (this.state.completed)
        {
            progressProps.bootstrapStyle = 'success';
            progressProps.style = 'none';


            btnProps.bootstrapStyle = 'success';
            btnProps.label = this.props.lnFileUploadDismiss;
            btnProps.icon = icon.ionicon({ name: 'ion-checkmark-round' });
        }
        else
        {
            btnProps.bootstrapStyle = 'danger';
            btnProps.label = this.props.lnFileUploadCancel;
            btnProps.icon = icon.ionicon({ name: 'ion-close-round' });
        }
        



        return dom.div({
            //className: 'container-fluid'
        },
        dom.div({
            className: 'col-lg-6 col-md-6'
        },
        dom.div({ className: 'col-xs-10 text-muted' }, this.props.file.name),
        dom.div({ className: 'col-xs-2 text-muted' }, core.formatSize(this.props.file.size)),
        dom.div({ className: 'clearfix visible-xs'})
        ),
        dom.div({
            className: 'col-lg-6 col-md-6'
        },
        dom.div({
            className: 'col-xs-10'
        },
        progress(progressProps)),
        button.buttonToolbar({
            className: 'col-xs-2',
            children: button.extended(btnProps)
        })
        
        ));
    }
});

var _fileStat = _uploader.fileStat = core.createClass({
    getDefaultProps: function ()
    {
        return {
            file: null
        };
    },
    shouldComponentUpdate: function (nextProps, nextState)
    {
        if(this.props.file == nextProps.file)
        {
            return false;
        }
        return true;
    },
    render: function ()
    {
        if (this.props.file)
        {
            console.log(this.props.file);
        }

        return dom.li(null, this.props.file.name);
    }

});


