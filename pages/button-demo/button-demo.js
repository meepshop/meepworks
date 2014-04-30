var react = require('react');
var core = require('meepworks-core');
var meepPanels = require('meepworks-panel');
var meepButton = require('meepworks-button');
var meepIcon = require('meepworks-icon');
var router = require('meepworks-router');
var meepApp = require('meepworks-app');
var dom = react.DOM;

var imgIcon = meepIcon({
    img: '/images/favicon.ico'
});


var buttonDemo = module.exports = core.createClass({
    render: function ()
    {
        var content = [
		dom.div({
		    children: [
			dom.h3({ children: 'Default Buttons' }),
			dom.br(),
			meepButton.buttonToolbar({
			    children: [
				meepButton({
				    label: 'Default'
				}),
				meepButton({
				    label: 'Primary',
				    bootstrapStyle: 'primary'
				}),
				meepButton({
				    label: 'Success',
				    bootstrapStyle: 'success'
				}),
				meepButton({
				    label: 'Info',
				    bootstrapStyle: 'info'
				}),
				meepButton({
				    label: 'Warning',
				    bootstrapStyle: 'warning'
				}),
				meepButton({
				    label: 'Danger',
				    bootstrapStyle: 'danger'
				}),
				meepButton({
				    label: 'Link',
				    bootstrapStyle: 'link'
				})
			    ]
			})
		    ]
		}),
		dom.div({
		    children: [
			dom.h3({ children: 'Flat Buttons' }),
			dom.br(),
			meepButton.buttonToolbar({
			    children: [
				meepButton({
				    buttonStyle: 'flat',
				    label: 'Default'
				}),
				meepButton({
				    buttonStyle: 'flat',
				    label: 'Primary',
				    bootstrapStyle: 'primary'
				}),
				meepButton({
				    buttonStyle: 'flat',
				    label: 'Success',
				    bootstrapStyle: 'success'
				}),
				meepButton({
				    buttonStyle: 'flat',
				    label: 'Info',
				    bootstrapStyle: 'info'
				}),
				meepButton({
				    buttonStyle: 'flat',
				    label: 'Warning',
				    bootstrapStyle: 'warning'
				}),
				meepButton({
				    buttonStyle: 'flat',
				    label: 'Danger',
				    bootstrapStyle: 'danger'
				}),
				meepButton({
				    buttonStyle: 'flat',
				    label: 'Link',
				    bootstrapStyle: 'link'
				})
			    ]
			})
		    ]
		}),
		dom.div({
		    children: [
			dom.h3({ children: 'Ion Buttons' }),
			dom.br(),
			meepButton.buttonToolbar({
			    children: [
				meepButton({
				    buttonStyle: 'ion',
				    label: 'Default'
				}),
				meepButton({
				    buttonStyle: 'ion',
				    label: 'Primary',
				    bootstrapStyle: 'primary'
				}),
				meepButton({
				    buttonStyle: 'ion',
				    label: 'Success',
				    bootstrapStyle: 'success'
				}),
				meepButton({
				    buttonStyle: 'ion',
				    label: 'Info',
				    bootstrapStyle: 'info'
				}),
				meepButton({
				    buttonStyle: 'ion',
				    label: 'Warning',
				    bootstrapStyle: 'warning'
				}),
				meepButton({
				    buttonStyle: 'ion',
				    label: 'Danger',
				    bootstrapStyle: 'danger'
				}),
				meepButton({
				    buttonStyle: 'ion',
				    label: 'Link',
				    bootstrapStyle: 'link'
				})
			    ]
			})
		    ]
		}),
		dom.div({
		    children: [
			dom.h3({ children: 'Icon Buttons' }),
			dom.br(),
			meepButton({
			    label: 'Icon',
			    buttonStyle: 'icon'
			}),
			meepButton({
			    label: dom.i({ className: 'ion-navicon-round' }),
			    buttonStyle: 'icon'
			})
		    ]
		}),
		dom.div({
		    children: [
			dom.h3({ children: 'Block Buttons' }),
			dom.br(),
			meepButton({
			    buttonStyle: 'icon',
			    label: 'Icon',
			    block: true
			}),
			meepButton({
			    label: 'Default',
			    block: true
			}),
			meepButton({
			    label: 'Flat',
			    buttonStyle: 'flat',
			    bootstrapStyle: 'primary',
			    block: true
			}),
			meepButton({
			    label: 'Ion',
			    buttonStyle: 'ion',
			    bootstrapStyle: 'success',
			    block: true
			})
		    ]
		}),
        dom.div({
            children: [
            dom.h3({ children: 'Button Size' }),
            dom.br(),
            meepButton.buttonToolbar({
                children: [
                meepButton({
                    label: 'Large',
                    size: 'lg'
                }),
                meepButton({
                    label: 'Default'
                }),
                meepButton({
                    label: 'Small',
                    size: 'sm'
                }),
                meepButton({
                    label: 'Extra Small',
                    size: 'xs'
                })
                ]
            })
            ]
        }),
meepButton.buttonToolbar({
    children: [
	dom.h3({ children: 'Dropdowns & DropUps' }),
	dom.br(),
	meepButton.menuButton({
	    label: 'Drop Down',
	    animate: true,
	    dropdownMenu: [
		{
		    label: 'item 1'
		},
		{
		    label: 'item 2'
		}
	    ]
	}),
	meepButton.menuButton({
	    label: 'Drop Up',
	    dropUp: true,
	    animate: true,
	    dropdownMenu: [
		{
		    label: 'item 1'
		},
		meepButton.menuDivider,
		{
		    label: 'item 2'
		}
	    ]
	}),
	meepButton.menuButton({
	    label: meepIcon.ionicon({
	        name: 'ion-ios7-arrow-up'
	    }),
	    tooltip: 'test',
	    tooltipPosition: 'top',
	    buttonStyle: 'icon',
	    dropUp: true,
	    animate: false,
	    dropdownMenu: [
		{
		    label: 'item 1',
		    onClick: function (e) { console.log('test'); },
		    tooltip: 'test2'
		},
		meepButton.menuDivider,
		{
		    label: 'item 2'
		}
	    ]
	}),
	meepButton.splitButton({
	    bootstrapStyle: 'primary',
	    alignRight: true,
	    dropUp: true,
	    dropdownMenu: [
		{
		    label: 'action 1',
		    onClick: function ()
		    {
		        console.log('action 1');
		    }
		},
		{
		    label: 'action 2',
		    onClick: function ()
		    {
		        console.log('action 2');
		    }
		},
		meepButton.menuDivider,
		{
		    label: 'Return to Index',
		    link: '/index.html'
		}
	    ]
	}),
    meepButton.extended({
        label: 'Upload',
        icon: meepIcon.ionicon({
            name: 'ion-ios7-cloud-upload-outline'
        })
    })
    ]
}),
            dom.h3(null, 'Button Groups'),
            meepButton.buttonToolbar({
                children: [
            meepButton.buttonGroup({
                children: [
                    meepButton({
                        label: 'btn1'
                    }),
                    meepButton({
                        label: 'btn2'
                    }),
                    meepButton({
                        label: 'btn3'
                    })
                ]
            }),
            meepButton.buttonGroup({
                children: [
                    meepButton({
                        label: 'btn1'
                    }),
                    meepButton({
                        label: 'btn2',
                        tooltip: 'test'
                    }),
                    meepButton({
                        label: 'btn3',
                        tooltip: 'test'
                    })
                ]
            })
                ]
            })

        ];

        return meepApp({
            body: meepApp.body({
                content: content
            })
        });
    }
});