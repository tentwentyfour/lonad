const some                  = require('lodash.some');
const identity              = require('lodash.identity');
const throwArgument         = require('./throw-argument');
const unaryReturnThis       = require('./return-this').unary;
const defineStaticFunctions = require('helpbox/source/demethodify-prototype');

class Optional {}

let Some;
let None;
let fromNullable;

None = function makeNone() {
  return Object.assign(Object.create(None.prototype), {
    isOptionalInstance: true,
    valueAbsent:        true,
    valuePresent:       false
  });
};

None.prototype = Object.create(Optional.prototype);

Object.assign(None.prototype, {
  optionalProperty: unaryReturnThis,
  nullableProperty: unaryReturnThis,
  map:              unaryReturnThis,
  transform:        unaryReturnThis,
  filter:           unaryReturnThis,
  reject:           unaryReturnThis,
  flatMap:          unaryReturnThis,
  property:         unaryReturnThis,
  nullableMap:      unaryReturnThis,
  tap:              unaryReturnThis,

  satisfies(_) {
    return false;
  },

  valueEquals(_) {
    return false;
  },

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

  get(message) {
    throw new Error(message || 'Cannot unwrap None instances');
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

  tap(λ) {
    λ(this.value);

    return this;
  },

  satisfies(predicate) {
    return Boolean(predicate(this.value));
  },

  valueEquals(value) {
    return this.value === value;
  },

  nullableMap(λ) {
    return Optional.fromNullable(λ(this.value));
  },

  property(propertyName) {
    return Some(this.value[propertyName]);
  },

  optionalProperty(propertyName) {
    return this.value[propertyName];
  },

  nullableProperty(propertyName) {
    return fromNullable(this.value[propertyName]);
  },

  get(_) {
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

  reject(predicate) {
    if (!predicate(this.value)) {
      return this;
    }

    return None();
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

fromNullable = value => {
  if (value === null || value === undefined) {
    return None();
  }

  return Some(value);
};

const fromParsedJson = object => {
  if (!object || !object.isOptionalInstance) {
    throw new Error('fromParsedJson(object) expects an object obtained from JSON.parsing an Optional stringified with JSON.stringify');
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

  return Some(optionals.map(Optional.get(undefined)));
};

const when = (truthy, value) => {
  if (truthy) {
    return Some(value);
  }

  return None();
};

const first = optionals => {
  const firstIndex = optionals.findIndex(optional => optional.valuePresent);

  if (firstIndex === -1) {
    return Optional.None();
  }

  return optionals[firstIndex];
};

[['transform', 'map']].forEach(([alias, method]) => {
  Some.prototype[alias] = Some.prototype[method];
  None.prototype[alias] = None.prototype[method];
});

defineStaticFunctions(Some.prototype, Optional);

Object.assign(Optional, { Some, None, fromNullable, fromParsedJson, all, when, first });

module.exports = Optional;
