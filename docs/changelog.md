Change Log
===



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
