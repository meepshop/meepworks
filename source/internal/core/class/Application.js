import asyncMap from 'greasebox/async-map'

import Locale from '../../../locale'
import { LocaleLoadError } from '../../warning/errors'

import component_checker from '../../core/component-mount/component-checker'
import router_checker from '../../core/component-mount/router-checker'

import {
  isFunction
} from '../../utils/type-checker'

import {
  warning
} from '../../warning/type-error-log'

import ApplicationHOC from '../../core/higher-level-container/application-hoc.react'

const _ChildRoutes = Symbol('_ChildRoutes')
const _Component = Symbol('_Component')
const _LoadingComponent = Symbol('_LoadingComponent')
const _ComponentPath = Symbol('_ComponentPath')
const _Locale = Symbol('_Locale')
const _Ctx = Symbol('_Ctx')
const _CtxObject = Symbol('_CtxObject')
const _Routes = Symbol('_Routes')
const _LoadingRoutes = Symbol('_LoadingRoutes')
const _RouteObject = Symbol('_RouteObject')
const _IsLoaded = Symbol('_IsLoaded')


export default class Application {
  constructor(ctx) {
    this[_Ctx] = ctx
    this[_ChildRoutes] = this.childRoutes
    this[_ComponentPath] = this.component
    this[_Locale] = new Locale(ctx, this.locale)
    this[_IsLoaded] = false
    this[_CtxObject] = {
      context: {
        ctx,
        locale: this[_Locale]
      },
      runAction(action) {
        return this.context.ctx.runAction(action)
      },
      getStore(Store) {
        return Store.getInstance(this.context.ctx)
      },
      get locale() {
        return this.context.locale.locale
      },
      setLocale(l) {
        return this.context.locale.setLocale(l)
      },
      tmpl(key, params) {
        return this.context.locale(key, params)
      },
      formatNumber(...args) {
        return this.context.locale.formatNumber(...args)
      },
      formatCurrency(...args) {
        return this.context.locale.formatCurrency(...args)
      },
      formatDateTime(...args) {
        return this.context.locale.formatDateTime(...args)
      }
    }
  }
  get path() {
    return void 0
  }
  get childRoutes() {
    return []
  }
  get component() {
    throw new Error('Application must define a relative path to component')
  }
  get dirname() {
    throw new Error('Application must define dirname')
  }
  get locale() {
    return void 0
  }
  get stores() {
    return []
  }
  title() {
    return void 0
  }
  async onEnter() {
    // overload this function to define onEnter hook handlers
  }
  onLeave() {
    // overload this function to define onLeave hook handlers
  }
  /**
   * @param {Object} - nextLocation
   */
  routerWillLeave() {
    // overload this function to define routerWillLeave lifecycle method.
    // this allow leave confirmations to be done.
  }
  get routes() {
    if (!this[_RouteObject]) {
      const own = this
      this[_RouteObject] = {
        path: own.path,
        getChildRoutes: (location, cb) => {
          if (this[_Routes]) {
            router_checker(this[_Routes], cb)
          } else if (this[_LoadingRoutes]) {
            (async () => {
              await this[_LoadingRoutes]
              router_checker(this[_Routes], cb)
            })()
          } else {
            this[_LoadingRoutes] = (async () => {
              let childRoutes = []
              childRoutes = await asyncMap(this[_ChildRoutes], r => {
                try {
                  const child = new r(this[_Ctx])
                  return child.routes
                } catch (err) {
                  warning(err)
                }
                return false
              })
              this[_Routes] = childRoutes.filter(r => !!r)
              router_checker(this[_Routes], cb)
            })()
          }
        },
        onEnter: (nextState, replaceState, cb) => {
          _onEnter_initializer(nextState, replaceState, cb, own)
        },
        onLeave: () => {
          _onLeave_initializer(own)
        },
        getComponent: (location, cb) => {
          _mainly_component_initializer(location, Application, cb, own)
        }
      }
    }
    return this[_RouteObject]
  }
}

/**
 * meepworks-initialize-class-application-mainly-component
 *
 * @param {object} location
 * @param {object} applicationInstance - application class instance
 * @param {fn} cb - this function is instead component method
 * @param {own} own - High Level Context Container by (route)
 */
function _mainly_component_initializer(location, applicationInstance, cb, own) {
  if (own[_Component]) {
    component_checker(own[_Component], cb)
  } else if (own[_LoadingComponent]) {
    (async () => {
      await own[_LoadingComponent]
      component_checker(own[_Component], cb)
    })()
  } else {
    own[_LoadingComponent] = (async () => {
      let Comp
      try {
        Comp = own[_ComponentPath]
      } catch (err) {
        warning(err, cb)
      }
      own[_Component] = ApplicationHOC(Comp, applicationInstance, own[_CtxObject], own)
      component_checker(own[_Component], cb)
    })()
  }
}

/**
 * meepworks-initialize-class-application-onLeave
 *
 * @param {object} own - High Level Context Container by (route)
 */
function _onLeave_initializer(own) {
  if (own.onLeave !== Application.prototype.onLeave &&
      isFunction(own.onLeave)
    ) {
    own.onLeave.bind(own[_CtxObject])
  }
}

/**
 * meepworks-initialize-class-application-getChildRoutes
 * initialize getChildRoutes
 *
 * @param {object} location - react-router location object
 * @param {Function} cb
 * @param {object} own - High Level Context Container by (route)
 */
function _getChildRoutes_initializer(location, cb, own) { /* eslint no-unused-vars: 0 */
  if (own[_Routes]) {
    router_checker(own[_Routes], cb)
  } else if (own[_LoadingRoutes]) {
    (async () => {
      await own[_LoadingRoutes]
      router_checker(own[_Routes], cb)
    })()
  } else {
    own[_LoadingRoutes] = (async () => {
      let childRoutes = []
      childRoutes = await asyncMap(own[_ChildRoutes], r => {
        try {
          const child = new r(own[_Ctx])
          return child.routes
        } catch (err) {
          warning(err)
        }
        return false
      })
      own[_Routes] = childRoutes.filter(r => !!r)
      router_checker(own[_Routes], cb)
    })()
  }
}

/**
 * meepworks-initialize-class-application-onEnter
 * initialize onEnter
 *
 * @param {object} nextState - High Level Container state
 * @param {Function} replaceState
 * @param {Function} cb
 * @param {object} own - High Level Context Container by (route)
 */
function _onEnter_initializer(nextState, replaceState, cb, own) {
  (async () => {
    try {
      await own[_Locale].loadLocales()
    } catch (err) {
      let errInfo
      if (!(err instanceof LocaleLoadError)) {
        errInfo = new LocaleLoadError(err)
      }
      warning(errInfo)
    }

    /*
     * avoid store instance run second time
     * setting isLoaded to condition store loader
     */
    if (!own[_IsLoaded]) {
      _store_mapper(own.stores, own[_Ctx]) /* eslint no-use-before-define: 0 */
    }

    if (own.path &&
        own.onEnter !== Application.prototype.onEnter &&
        isFunction(own.onEnter)
      ) {
      try {
        await own.onEnter.call(own[_CtxObject], nextState, replaceState)
        cb()
      } catch (err) {
        warning(err)
      }
    } else {
      cb()
    }
    own[_IsLoaded] = true
  })()
}

/**
 * meepworks-store-mapper
 * private method,
 * set context instance for store,
 * help you to get the store when you get the store data from children router
 * @param {Array} stores
 * @param {Object} global context
 * @returns {Array} new store extends with context
 */
function _store_mapper(stores, context) {
  return stores.forEach((s) => {
    s.getInstance(context)
  })
}
