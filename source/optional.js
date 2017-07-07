const identity             = require('lodash.identity');
const unaryReturnThis      = require('./unary-return-this');
const defineStaticFunctions = require('./define-static-functions');

class Optional {}

let None = function None() {
  return Object.assign(Object.create(None.prototype), {
    isOptionalInstance: true,
    valueAbsent:        true,
    valuePresent:       false
  });
};

None.prototype = Object.create(Optional.prototype);

Object.assign(None.prototype, {
  map:    unaryReturnThis,
  filter:  unaryReturnThis,
  flatMap: unaryReturnThis,

  getOrElse(elseValue) {
    return elseValue;
  },

  get() {
    throw new Error('Cannot unwrap None instances');
  },

  match(callbacks) {
    return (callbacks.None || identity)();
  }
});

const Some = function Some(value) {
  return Object.assign(Object.create(Some.prototype), {
    value,

    isOptionalInstance: true,
    valuePresent:       true,
    valueAbsent:        false
  });
};

Some.prototype = Object.create(Optional.prototype);

Object.assign(Some.prototype, {
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

const fromJson = object => {
  if (!object.isOptionalInstance) {
    throw new Error('The deserialized value is not an Optional instance');
  }

  if (object.valueAbsent) {
    return None();
  }

  return Some(object.value);
};

defineStaticFunctions(Optional, { Some, None });

Object.assign(Optional, { Some, None, fromNullable, fromJson });

module.exports = Optional;
