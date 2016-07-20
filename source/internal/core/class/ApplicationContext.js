import Dispatcher from '../dispatch/dispatcher'
import Emitter from 'component-emitter'
import { ActionError } from '../../warning/errors'

import {
  isObject
} from '../../utils/type-checker'

import {
  warning
} from '../../warning/type-error-log'

const _Dispatcher = Symbol('Dispatcher')
const _Init = Symbol('Init')
const _Stores = Symbol('Stores')
const _Title = Symbol('Title')
const _Locale = Symbol('Locale')
const _StoreId = Symbol('StoreId')
const _AcceptLanguage = Symbol('AcceptLanguage')
const _LocaleMapping = Symbol('LocaleMapping')
const _StoreData = Symbol('StoreData')
const _Files = Symbol('Files')
const _InitialData = Symbol('InitialData')

export default class ApplicationContext {
  constructor({
    initialData = {},
    locale = 'en_US',
    acceptLanguage = [],
    localeMapping = {},
    storeData = [],
    storeId
  }) {
    this[_Dispatcher] = Dispatcher.getInstance(this)
    this[_Title] = []
    this[_Stores] = new Set()
    this[_Init] = false
    this[_Locale] = locale
    this[_StoreId] = storeId
    this[_AcceptLanguage] = acceptLanguage
    this[_LocaleMapping] = localeMapping
    this[_StoreData] = storeData.reverse()
    this[_Files] = new Set()
    this[_InitialData] = initialData
  }
  async runAction(action) {
    if (!isObject(action)) {
      warning(`got the action [${action}] - type of [${typeof action}] ,the action must be object, please checkout your action type.`)
      return
    }

    action.ctx = this
    try {
      this[_Dispatcher].dispatch({
        action: action.constructor,
        payload: await action.action(action.payload)
      })
    } catch (err) {
      const errlog = new ActionError(err)
      warning(errlog)
    }
  }
  getStore(Store) {
    return Store.getInstance(this)
  }
  get title() {
    return this[_Title].slice().pop()
  }
  pushTitle(title) {
    this[_Title].push(title)
  }
  popTitle() {
    return this[_Title].pop()
  }
  get stores() {
    return this[_Stores]
  }
  get locale() {
    return this[_Locale]
  }
  get storeId() {
    return this[_StoreId]
  }
  set locale(locale) {
    this[_Locale] = locale
  }

  get acceptLanguage() {
    return this[_AcceptLanguage]
  }

  get localeMapping() {
    return this[_LocaleMapping]
  }

  get init() {
    return this[_Init]
  }
  set init(init) {
    this[_Init] = !!init
  }

  get storeData() {
    if (this[_StoreData].length > 0) {
      return this[_StoreData].pop()
    }
    return false
  }

  get files() {
    return this[_Files]
  }

  get initialData() {
    return this[_InitialData]
  }
}

Emitter(ApplicationContext.prototype)
