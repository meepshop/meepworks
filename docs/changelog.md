Change Log
===

#v0.14.0 **2016 July 20**

Now react-router was upgrade to version 2.6.0

1. Remove `this.props.history`
2. Use `this.context.router` instead `this.props.history`
3. Use `this.props.router.push` instead pushState and `this.props.history.replace`
4. Exposed all api in meepworks/index.js

#v0.13.0
**2016 July 19**

Test meepworks framework and useful for new developer easily to know the meepshop work flow.

1. Migrate gulp server to webpack dev server
2. Deprecate test-server (remove next version) and remove gulp server file
3. Add new webpack test server

#v0.12.0
**2016 July 19**

1. Migrate old source code
2. Fix child component error log
3. remove gulp file, remove jspm file

#v0.11.43
**2015 Dec 08**

1. Implement loadingComponent render for sererRouter when using clientRender mode.

#v0.11.35
**2015 Oct 23**

1. Rethrow Action errors instead of trapping them.

#v0.11.14
**2015 Oct 1**

1. Fix error where stores are not rehydrated on client-side
2. Fix error when some css would have multiple links in the header

#v0.11.7
**2015 Sep 30**

1. Allow setting preload css to false to speed up dev process.

#v0.11.4
**2015 Sep 30**

1. Allow application to have undefined path.


#v0.11.4
**2015 Sep 30**

1. Fix bug where onEnter gets triggered on client-side before app init.

#v0.11.3
**2015 Sep 30**

1. Add try catch around onEnter, onLeave, and title.

#v0.11.2
**2015 Sep 30**

1. Properly provide helper functions for onEnter, onLeave, title().

#v0.11.1
**2015 Sep 30**

1. Initialize application context with browser's locale settings. Ignore koa context's locale property.
2. Put koa context's initialData into application context.

#v0.11.0
**2015 Sep 30**

1. Rewrote to use React 0.14.x and React-router 1.0.x.
2. Separate Application with Application view component.
3. Rely mostly on react-router's async features to do dynamic loading.



#v0.10.27
**2015 Aug 28**

1. Bump versions. Especially to make meepworks compatible with jspm 0.16.x

#v0.10.26
**2015 Aug 28**

1. Add PureRenderComponent that automatically check props and state for shouldComponentUpdate.

#v0.10.18
**2015 Jul 29**

1. Revert setLocale changes.

#v0.10.17
**2015 Jul 29**

1. setLocale no longer forceUpdate the root. It will now emit a 'locale-change' event via appContext. Apps that should respond to such event should implement handlers for it.

#v0.10.15
**2015 Jul 28**

1. Allow route's appPath to be undefined, this is useful for apps that should handle multiple routes.
2. Changed the internal handling for getting titles, titles should now update on navigation even if the handler is the same component.

#v0.10.5
**2015 Jun 25**

1. Fixed context.baseURL and context.appURL bugs

#v0.10.4
**2015 Jun 23**

1. Redesign the framework to use react-router for routing.
2. Introduced the use of contexts.
3. Unified Application component and application manifest.


#v0.9.0
**2015 Jun. 04**

1. Bumped dependency versions.

Breaking Changes:

1. ServerAppDriver no longer wraps koa, and is based purely on koa-router. The mounting syntax is thus different.

#v0.8.3
**2015 May 20**

1. Fix error where creating multiple locale objects with the same path result in errors.

#v0.8.2
**2015 May 5**

1. Fix title template subsitution

#v0.8.1
**2015 Apr. 30**

1. Allow actions to handle multiple parameters.

#v0.8.0
**2015 Apr. 29**

1. Bump versions to use latest babel and jspm
2. Fix firefox error
3. Modify load-locales module to accomodate latest \_\_dirname implementation in nodelibs.

#v0.7.17
*2015 Apr. 13*

1. Allow route titles to be functions

#v0.7.16
*2015 Apr. 13*

1. Remove test code

#v0.7.15
*2015 Apr. 10*

1. Added static subscribe and unsubscribe methods for Locale

#v0.7.14
*2015 Apr. 10*

1. Added ReplaceState action to page-actions, this allows the target route to replace the current route in the history stack

#v0.7.13
*2015 Apr. 8*

1. Make viewport meta to disable scaling by default
2. Allow html and viewport component to be substituted.

#v0.7.11
*2015 Apr. 7*

1. Check if request header's accept-language is null before trying to parse it


#v0.7.10
*2015 Apr. 7*

1. Add page-actions


#v0.7.9
*2015 Apr. 7*

1. Expose ctx to actions and add ctx getter/setter

#v0.7.8
*2015 Mar. 30*

1. Fix bug where RouterStore.route and RouterStore.url return undefined.

#v0.7.7
*2015 Mar. 27*

1. Defaults to App.title for all routes if the route doesn't have title defined, and '' if App.title is undefined.


#v0.7.6
*2015 Mar. 25*

1. Provide formatNumber, formatDecimal, formatCurrency, and formatDateTime as static functions on Locale module.

#v0.7.5
*2015 Mar. 25*

1. Fix a bug where newly initialized stores would be rehydrated with 'undefined' in client-app-driver.

#v0.7.3
*2015 Mar. 25*

1. Fix a bug where the title of the home route is not being set properly

#v0.7.2
*2015 Mar. 23*

1. Actions do not have to specify symbols anymore, action symbols will be automatically generated and cached.

#v0.7.1
*2015 Mar. 22*

1. Fix the bug that when version is not specified, traceCss appends '?undefined' after the css file names


#v0.7.0

1. [Breaking] Nested subapps should now specify routes as if it were the root applicaiton.
2. LocaleStore would try to normalize locale codes to avoid errors.

#v0.6.2
*2015 Mar. 18*

1. Bump packages to latest versions, including greasebox@0.9.0
2. Remove debug dependency
3. Implement locale support
4. Remove the need to use Action.symbol mostly
5. Add subscribe/unsubscribe funciton to StoreBase for listening to changes

*known issues:*

1. Mounting application to arbitary mount point is broken
2. Hosting jspm_packages folder in arbitary mount point is also broken

#v0.5.0
*2015 Mar. 12*

1. Add standalone-driver to run application on client only
2. Fix mounting app to specific path error
3. Upgrade react to 0.13.0, supporting es6 class style components.

#v0.4.6

1. fix error where css files from jspm_packages would also be handled with app version

#v0.4.5

1. server AppDriver would append versions to traced css if they are not from jspm_packages.

#v0.4.3

1. RequireFilter is now a class
2. Requirefilter would return url friendly paths with versions
3. Cache buster is built into app-loader's initial scripts


#v0.3.19

*2015 Mar. 06*

1. client-app-driver now changes document.title after excuting Navigate action.
