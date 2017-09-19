const some                  = require('lodash.some');
const identity              = require('lodash.identity');
const throwArgument         = require('./throw-argument');
const unaryReturnThis       = require('./return-this').unary;
const defineStaticFunctions = require('helpbox/source/demethodify-prototype');

class Optional {}

let Some;
let None;

None = function makeNone() {
  return Object.assign(Object.create(None.prototype), {
    isOptionalInstance: true,
    valueAbsent:        true,
    valuePresent:       false
  });
};

None.prototype = Object.create(Optional.prototype);

Object.assign(None.prototype, {
  map:     unaryReturnThis,
  filter:  unaryReturnThis,
  flatMap: unaryReturnThis,

  or(λOrOptional) {
    if (typeof λOrOptional === 'function') {
      return λOrOptional();
    }

    return λOrOptional;
  },

  recover(λ) {
    return Some(λ());
  },

  getOrElse(elseValue) {
    return elseValue;
  },

  get() {
    throw new Error('Cannot unwrap None instances');
  },

  match(callbacks) {
    return (callbacks.None || throwArgument)();
  }
});

Some = function newSome(value) {
  return Object.assign(Object.create(Some.prototype), {
    value,

    isOptionalInstance: true,
    valuePresent:       true,
    valueAbsent:        false
  });
};

Some.prototype = Object.create(Optional.prototype);

Object.assign(Some.prototype, {
  or:      unaryReturnThis,
  recover: unaryReturnThis,

  get() {
    return this.value;
  },

  getOrElse(elseValue) {
    return this.value;
  },

  map(λ) {
    return Some(λ(this.value));
  },

  flatMap(λ) {
    return λ(this.value);
  },

  filter(predicate) {
    if (predicate(this.value)) {
      return this;
    }

    return None();
  },

  match(callbacks) {
    return (callbacks.Some || identity)(this.value);
  }
});

const fromNullable = value => {
  if (value === null || value === undefined) {
    return None();
  }

  return Some(value);
};

const fromParsedJson = object => {
  if (!object || !object.isOptionalInstance) {
    return Optional.fromNullable(object);
  }

  if (object.valueAbsent) {
    return None();
  }

  return Some(object.value);
};

const all = optionals => {
  if (some(optionals, 'valueAbsent')) {
    return None();
  }

  return Some(optionals.map(Optional.get));
};

const when = truthy => {
  if (truthy) {
    return Some();
  }

  return None();
};

defineStaticFunctions(Some.prototype, Optional);

Object.assign(Optional, { Some, None, fromNullable, fromParsedJson, all, when });

module.exports = Optional;
