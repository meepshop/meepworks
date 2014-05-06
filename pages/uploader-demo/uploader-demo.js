var react = require('react');

var core = require('meepworks-core');
var app = require('meepworks-app');
var panel = require('meepworks-panel');
var uploader = require('meepworks-uploader');
var progress = require('meepworks-progress');

var dom = react.DOM;


module.exports = core.createClass({
    displayName: 'uploader-demo',
    getInitialState: function ()
    {
        return {
            progressId: null,
            progress: 0
        };
    },
    componentDidMount: function ()
    {
        var self = this;
        this.state.progressId = setInterval(function ()
        {
            var progress = self.state.progress;
            if (progress < 100)
            {
                progress += 5;
                if (progress > 100)
                {
                    progress = 100;
                    clearInterval(self.state.progressId);
                }
                self.setState({
                    progress: progress
                });

            }

        }, 1000);
    },
    componentWillUnmount: function ()
    {
        clearInterval(this.state.progressId);
    },
    render: function ()
    {
        return app({
            body: app.body({
                content: [
                    panel({
                        title: 'Test',
                        body: [
                            uploader()
                        ]
                    }),
                    panel({
                        title: 'Progress Bars',
                        canCollapse: true,
                        startCollapsed: true,
                        body: [
                            progress({
                                progress: this.state.progress,
                            }),
                            progress({
                                progress: this.state.progress,
                                bootstrapStyle: 'info'
                            }),
                            progress({
                                progress: this.state.progress,
                                bootstrapStyle: 'success'
                            }),
                            progress({
                                progress: this.state.progress,
                                bootstrapStyle: 'warning'
                            }),
                            progress({
                                progress: this.state.progress,
                                bootstrapStyle: 'danger'
                            })
                        ]
                    }),
                    panel({
                        title: 'Progress Bars (No Animation)',
                        canCollapse: true,
                        startCollapsed: true,
                        body: [
                            progress({
                                progress: this.state.progress,
                                style: 'striped',
                            }),
                            progress({
                                progress: this.state.progress,
                                style: 'striped',
                                bootstrapStyle: 'info'
                            }),
                            progress({
                                progress: this.state.progress,
                                style: 'striped',
                                bootstrapStyle: 'success'
                            }),
                            progress({
                                progress: this.state.progress,
                                style: 'striped',
                                bootstrapStyle: 'warning'
                            }),
                            progress({
                                progress: this.state.progress,
                                style: 'striped',
                                bootstrapStyle: 'danger'
                            })
                        ]
                    }),
                    panel({
                        title: 'Progress Bars (no styling)',
                        canCollapse: true,
                        startCollapsed: true,
                        body: [
                            progress({
                                progress: this.state.progress,
                                style: 'none',
                            }),
                            progress({
                                progress: this.state.progress,
                                style: 'none',
                                bootstrapStyle: 'info'
                            }),
                            progress({
                                progress: this.state.progress,
                                style: 'none',
                                bootstrapStyle: 'success'
                            }),
                            progress({
                                progress: this.state.progress,
                                style: 'none',
                                bootstrapStyle: 'warning'
                            }),
                            progress({
                                progress: this.state.progress,
                                style: 'none',
                                bootstrapStyle: 'danger'
                            })
                        ]
                    })
                ]
            })
        });
    }
});
