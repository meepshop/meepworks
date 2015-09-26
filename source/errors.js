

export class GenericError extends Error {
  constructor(err) {
    super();
    this.name = this.constructor.name;
    this.msg = this.message ='GenericError';
    this.statck = err.stack;
    this.cause = err;
  }
  static toString() {
    return this.name;
  }
}


export class AppLoadFailed extends GenericError {
  constructor(err) {
    super(err);
    this.msg = this.message = 'Failed to import an application';
  }
}

export class LocaleLoadFailed extends GenericError {
  constructor(err) {
    super(err);
    this.msg = this.message = 'Failed to import an locale file';
  }
}

