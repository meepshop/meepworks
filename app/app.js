window.onload=function ()
{
    var core = require('meepworks-core');
    var react = require('react');
    var meepMenu = require('meepworks-menu');
    var meepNav = require('meepworks-nav');
    var meepWrapper = require('meepworks-wrapper');
    var router = require('meepworks-router');
    var moduleHolder = require('meepworks-module');


    var buttonDemo = require('button-demo');
    var iconDemo = require('icon-demo');
    var progress = require('progress');
    var listViewDemo = require('listview-demo');
    require('syrena-admin').start();


    //example menu use
    //passing in router for nav to utilize routing triggers
    var nav = meepNav({
        menu: [
        {
            label: 'Progress',
            link: '/index.html'
        },
        {
            label: 'UI Elements',
            menu: [
            {
                label: 'Button Demo',
                link: '?button-demo'
            },
            {
                label: 'Icon Demo',
                link: '?icon-demo'
            },
            {
                label: 'Listview Demo',
                link: '?listview-demo'
            }
            ]
        }
        ],
        router: router
    });

    var app = meepWrapper({
        menu: meepMenu.sideMenu({
            label: 'Meep Works',
            link: '/index.html',
            nav: nav
        }),
        transition: 'fade',
    }, document.getElementById('viewport'));


    // app.setProps({
    //     module: moduleHolder({
    //     title: 'Test Module',
    //     module: react.DOM.div({
    //         children: 'module content'
    //     })
    // })
    // });

//perhaps there's a more elegant way to do this.
router('?button-demo', function ()
{
    app.setProps({
        content: buttonDemo({
            key: 'button-demo'
        }),
        title: 'Button Demo'
    });

});
router('/index.html', function ()
{
    app.setProps({
        content: progress({
            key: 'progress'
        }),
        title: 'Progress'
    });
});
router('?icon-demo', function ()
{
    app.setProps({
        content: iconDemo({
            key: 'icon-demo'
        }),
        title: 'Icon Demo'
    });
});
router('?listview-demo', function ()
{
    app.setProps({
        content: listViewDemo({
            key: 'listview-demo'
        }),
        title: 'Listview Demo'
    });
});
router.init({});



};