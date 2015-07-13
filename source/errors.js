

class GenericError extends Error {
  constructor(msg) {
    super(msg);
    this.name = this.constructor.name;
    this.msg = msg;
    this.message = msg;
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, this);
    }
  }
  static toString() {
    return this.name;
  }
}


export class AppLoadFailed extends GenericError {
  constructor(err) {
    super();
    this.name = this.constructor.name;
    this.msg = 'Failed to import an application';
    this.message = this.msg;
    this.stack = err.stack;
    this.cause = err;
  }
}

export class LocaleLoadFailed extends GenericError {
  constructor(err) {
    super();
    this.name = this.constructor.name;
    this.msg = 'Failed to import an locale file';
    this.message = this.msg;
    this.stack = err.stack;
    this.cause = err;
  }
}

