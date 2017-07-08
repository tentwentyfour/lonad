const defineStaticFunctions = require('./define-static-functions');
const unaryReturnThis       = require('./unary-return-this');
const identity              = require('lodash.identity');
const property              = require('lodash.property');
const constant              = require('lodash.constant');
const pipe                  = require('lodash.flow');
const Exception             = require('./exception');
const Optional              = require('./optional');

const { Some, None } = Optional;
const isPromise      = object => Boolean(object && object.then);

class Result {}

let Aborted;
let Pending;
let Error;
let Ok;

const findNextNonPending = promise => {
  return promise.then(result => {
    if (result && result.isAsynchronous) {
      return findNextNonPending(result.promise);
    }

    return result;
  });
};

const transformResult = (λ, wrapFunction = identity) => {
  try {
    const value = λ(this);

    if (isPromise(value)) {
      return Pending(value.then(wrapFunction, Error));
    }

    return wrapFunction(value);
  } catch (error) {
    return Error(error);
  }
};

Ok = function newOk(value) {
  return Object.assign(Object.create(Ok.prototype), {
    value,

    isResultInstance: true,
    isOk:             true,
    isError:          false,
    isAborted:        false,
    isAsynchronous:   false
  });
};

Ok.prototype = Object.create(Result.prototype);

Object.assign(Ok.prototype, {
  mapError: unaryReturnThis,
  recover:  unaryReturnThis,

  abortIfError() {
    return this;
  },

  merge() {
    return this.value;
  },

  map(λ) {
    return transformResult(() => λ(this.value), Ok);
  },

  flatMap(λ) {
    return transformResult(() => λ(this.value));
  },

  filter(predicate) {
    return transformResult(
      () => predicate(this.value),
      isTrue => (isTrue ? Ok(this.value) : Error())
    );
  },

  match(callbacks) {
    return (callbacks.Ok || identity)(this.value);
  },

  asynchronous() {
    return Pending(Promise.resolve(this));
  },

  toPromise() {
    return Promise.resolve(this.value);
  },

  toOptional() {
    return Some(this.value);
  }
});

Error = function createError(error) {
  return Object.assign(Object.create(Error.prototype), {
    error,

    isResultInstance: true,
    isError:          true,
    isAborted:        false,
    isOk:             false,
    isAsynchronous:   false
  });
};

Error.prototype = Object.create(Result.prototype);

Object.assign(Error.prototype, {
  map:     unaryReturnThis,
  filter:  unaryReturnThis,
  flatMap: unaryReturnThis,

  merge() {
    return this.error;
  },

  mapError(λ) {
    return transformResult(() => λ(this.error), Error);
  },

  recover(λ) {
    return transformResult(() => λ(this.error), Ok);
  },

  match(callbacks) {
    return (callbacks.Error || identity)(this.error);
  },

  abortIfError() {
    return Aborted(this.error);
  },

  asynchronous() {
    return Pending(Promise.resolve(this));
  },

  toPromise() {
    return Promise.reject(this.error);
  },

  toOptional() {
    return None();
  }
});

Aborted = function createAborted(error) {
  return Object.assign(Object.create(Aborted.prototype), {
    error,

    isResultInstance: true,
    isError:          true,
    isAborted:        true,
    isOk:             false,
    isAsynchronous:   false
  });
};

Aborted.prototype = Object.create(Result.prototype);

Object.assign(Aborted.prototype, {
  map:          unaryReturnThis,
  flatMap:      unaryReturnThis,
  filter:       unaryReturnThis,
  mapError:     unaryReturnThis,
  recover:      unaryReturnThis,

  abortIfError() {
    return this;
  },

  merge() {
    return this.error;
  },

  match(callbacks) {
    return (callbacks.Aborted || callbacks.Error || identity)(this.error);
  },

  asynchronous() {
    return Pending(Promise.resolve(this));
  },

  toPromise() {
    return Promise.reject(this.error);
  },

  toOptional() {
    return None();
  }
});

Pending = function createPending(promise) {
  let self = Object.assign(Object.create(Pending.prototype), {
    promise:          findNextNonPending(promise),
    isResultInstance: true,
    isAsynchronous:   true
  });

  ['isOk', 'isError', 'isAborted'].forEach(propertyName => {
    Object.defineProperty(self, propertyName, {
      enumerable: false,
      get:        () => { throw new Exception(`Cannot access '${propertyName}' of Result.Pending`); }
    });
  });

  return self;
};

Pending.prototype = Object.create(Pending.prototype);

const callWrappedResultMethod = methodName => {
  return function doCallWrappedResultMethod(...parameters) {
    return Pending(
      this.promise.then(Result[methodName](...parameters), Error)
    );
  };
};

Object.assign(Pending.prototype, {
  asynchronous: unaryReturnThis,
  map:          callWrappedResultMethod('map'),
  filter:       callWrappedResultMethod('filter'),
  recover:      callWrappedResultMethod('recover'),
  flatMap:      callWrappedResultMethod('flatMap'),
  mapError:     callWrappedResultMethod('mapError'),
  abortIfError: callWrappedResultMethod('abortIfError'),
  match:        pipe(callWrappedResultMethod('match'), property('promise')),
  merge:        pipe(callWrappedResultMethod('merge'), property('promise')),
  toPromise:    pipe(callWrappedResultMethod('toPromise'), property('promise')),
  toOptional:   pipe(callWrappedResultMethod('toOptional'), property('promise'))
});

const doTry = λ => transformResult(λ, value => {
  if (value && value.isResultInstance) {
    return value;
  }

  if (!value || !value.isOptionalInstance) {
    value = Optional.fromNullable(value);
  }

  return value.match({
    Some: Ok,
    None: constant(Error())
  });
});

const expect = optionalOrResult => {
  if (optionalOrResult.isResultInstance) {
    return optionalOrResult;
  }

  return optionalOrResult.match({
    Some: Ok,
    None: Error
  });
};

const fromPromise = promise => {
  return Pending(promise.then(Ok, Error));
};

defineStaticFunctions(Result, { Ok, Error });

Object.assign(Result, {
  Ok,
  Error,
  expect,
  Pending,
  Aborted,
  fromPromise,

  try:      doTry,
  tryAsync: pipe(doTry, Result.asynchronous)
});

module.exports = Result;
