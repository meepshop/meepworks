export class GenericError extends Error {
  constructor(err) {
    super()
    this.name = this.constructor.name
    this.msg = this.message = 'GenericError'
    this.stack = err.stack
    this.cause = err
  }
  static toString() {
    return this.name
  }
}

export class AppLoadError extends GenericError {
  constructor(err) {
    super(err)
    this.msg = this.message = 'Error loading application'
  }
}

export class LocaleLoadError extends GenericError {
  constructor(err) {
    super(err)
    this.msg = this.message = 'Error loading locale'
  }
}

export class ActionError extends GenericError {
  constructor(err) {
    super(err)
    this.msg = this.message = 'Failed to run action'
  }
}
