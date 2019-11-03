const defineStaticFunctions = require('helpbox/source/demethodify-prototype');
const throwArgument         = require('./throw-argument');
const returnThis            = require('./return-this');
const Exception             = require('./exception');
const Optional              = require('./optional');
const { cond }              = require('ramda');

const { identity, constant, pipe, property } = require('./utils');

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
      return Pending(value.then(wrapFunction, Aborted));
    }

    return wrapFunction(value);
  } catch (error) {
    return Aborted(error);
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
  abortOnErrorWith: returnThis.unary,
  mapError:         returnThis.unary,
  recover:          returnThis.unary,
  recoverWhen:      returnThis.binary,
  abortOnError:     returnThis.nullary,

  get() {
    return this.value;
  },

  replace(value) {
    return transformResult(constant(value), Ok);
  },

  tap(λ) {
    return transformResult(() => λ(this.value), constant(this));
  },

  satisfies(predicate) {
    return transformResult(() => predicate(this.value), Boolean);
  },

  valueEquals(value) {
    return this.value === value;
  },

  getOrElse(_) {
    return this.value;
  },

  expectProperty(propertyName) {
    return Result.expect(this.value[propertyName]);
  },

  property(propertyName) {
    return Ok(this.value[propertyName]);
  },

  merge() {
    return this.value;
  },

  chain(λ) {
    try {
      const value = λ(this.value);
    
      return decideWrapper(value);
    } catch (error) {
      return Result.Aborted(error);
    }
  },

  reject(predicate) {
    return transformResult(
      ()       => predicate(this.value),
      isTruthy => (isTruthy ? Error() : Ok(this.value))
    );
  },

  filter(predicate) {
    return transformResult(
      ()       => predicate(this.value),
      isTruthy => (isTruthy ? Ok(this.value) : Error())
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
  tap:              returnThis.unary,
  chain:            returnThis.unary,
  filter:           returnThis.unary,
  reject:           returnThis.unary,
  replace:          returnThis.unary,
  property:         returnThis.unary,
  expectProperty:   returnThis.unary,

  get() {
    throw this.error;
  },

  satisfies(_) {
    return false;
  },

  valueEquals(_) {
    return false;
  },

  getOrElse(value) {
    return value;
  },

  recoverWhen(predicate, λ) {
    return Ok(this.error)
    .chain(λ)
    .filter(predicate);
  },

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
    return (callbacks.Error || throwArgument)(this.error);
  },

  abortOnError() {
    return Aborted(this.error);
  },

  abortOnErrorWith(λOrValue) {
    return transformResult(() => {
      if (typeof λOrValue === 'function') {
        return λOrValue(this.error);
      }

      return λOrValue;
    }, Aborted);
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
  toOptional:       None,
  tap:              returnThis.unary,
  chain:            returnThis.unary,
  filter:           returnThis.unary,
  reject:           returnThis.unary,
  recover:          returnThis.unary,
  mapError:         returnThis.unary,
  property:         returnThis.unary,
  replace:          returnThis.unary,
  expectProperty:   returnThis.unary,
  abortOnErrorWith: returnThis.unary,
  recoverWhen:      returnThis.binary,
  abortOnError:     returnThis.nullary,

  get() {
    throw this.error;
  },

  satisfies(_) {
    return false;
  },

  valueEquals(_) {
    return false;
  },

  getOrElse(value) {
    return value;
  },

  merge() {
    return this.error;
  },

  match(callbacks) {
    return (callbacks.Aborted || throwArgument)(this.error);
  },

  asynchronous() {
    return Pending(Promise.resolve(this));
  },

  toPromise() {
    return Promise.reject(this.error);
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
      this
      .promise
      .then(Result[methodName](...parameters))
      .catch(Aborted)
    );
  };
};

Object.assign(Pending.prototype, {
  asynchronous:     returnThis.nullary,
  tap:              callWrappedResultMethod('tap'),
  chain:            callWrappedResultMethod('chain'),
  filter:           callWrappedResultMethod('filter'),
  reject:           callWrappedResultMethod('reject'),
  recover:          callWrappedResultMethod('recover'),
  replace:          callWrappedResultMethod('replace'),
  mapError:         callWrappedResultMethod('mapError'),
  property:         callWrappedResultMethod('property'),
  recoverWhen:      callWrappedResultMethod('recoverWhen'),
  abortOnError:     callWrappedResultMethod('abortOnError'),
  expectProperty:   callWrappedResultMethod('expectProperty'),
  abortOnErrorWith: callWrappedResultMethod('abortOnErrorWith'),
  match:            pipe(callWrappedResultMethod('match'), property('promise')),
  merge:            pipe(callWrappedResultMethod('merge'), property('promise')),
  satisfies:        pipe(callWrappedResultMethod('satisfies'), property('promise')),
  getOrElse:        pipe(callWrappedResultMethod('getOrElse'), property('promise')),
  toOptional:       pipe(callWrappedResultMethod('toOptional'), property('promise')),
  valueEquals:      pipe(callWrappedResultMethod('valueEquals'), property('promise')),

  get() {
    return this.toPromise();
  },

  toPromise() {
    return this.promise.then(Result.toPromise);
  }
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

const fromPromise = promise => {
  return Pending(promise.then(Ok, Error));
};

const expect = optionalOrResultOrPromise => {
  if ([null, undefined].includes(optionalOrResultOrPromise)) {
    return Error();
  } else if (typeof optionalOrResultOrPromise !== 'object') {
    return Ok(optionalOrResultOrPromise);
  }

  if (isPromise(optionalOrResultOrPromise)) {
    return Pending(optionalOrResultOrPromise.then(
      Result.expect,
      Result.Aborted
    ));
  }

  if (optionalOrResultOrPromise.isResultInstance) {
    return optionalOrResultOrPromise;
  }

  if (!optionalOrResultOrPromise.isOptionalInstance) {
    optionalOrResultOrPromise = Optional.fromNullable(optionalOrResultOrPromise);
  }

  return optionalOrResultOrPromise.match({
    Some: Ok,
    None: Error
  });
};

const when = (truthy, value, error) => {
  if (truthy) {
    return Ok(value);
  }

  return Error(error);
};

const decideWrapper = cond([
  [value => [null, undefined].includes(value), constant(Error())],
  [value => typeof value !== 'object',         value => Ok(value)],
  [value => isPromise(value),                  value => Result.Pending(value.then(Result.expect, Aborted))],
  [value => value.isResultInstance,            value => value],
  [value => value.isOptionalInstance,          value => value.match({ Some: Ok, None: Error })],
  [constant(true),                             value => Optional.fromNullable(value).match({ Some: Ok, None: Error })]
]);

[['transform', 'chain']].forEach(([alias, method]) => {
  Ok.prototype[alias]      = Ok.prototype[method];
  Error.prototype[alias]   = Error.prototype[method];
  Pending.prototype[alias] = Pending.prototype[method];
  Aborted.prototype[alias] = Aborted.prototype[method];
});

defineStaticFunctions(Ok.prototype, Result);

Object.assign(Result, {
  Ok,
  when,
  Error,
  expect,
  Pending,
  Aborted,
  fromPromise,

  try:      doTry,
  tryAsync: pipe(doTry, Result.asynchronous)
});

module.exports = Result;
