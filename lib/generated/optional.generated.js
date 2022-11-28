import { fromNullable, all, values, first, fromParsedJson, when, isOptional, isSome, isNone } from '../optional/optional.utils';
import returnThis from '../utils/return-this';
export class Optional {
    constructor() {
        this.isOptionalInstance = true;
        this.valuePresent = false;
        this.valueAbsent = false;
    }
    nullableMap(...args) {
        return returnThis.any.call(this, ...args);
    }
    or(...args) {
        return returnThis.any.call(this, ...args);
    }
    match(...args) {
        return returnThis.any.call(this, ...args);
    }
    transform(...args) {
        return returnThis.any.call(this, ...args);
    }
    map(...args) {
        return returnThis.any.call(this, ...args);
    }
    optionalProperty(...args) {
        return returnThis.any.call(this, ...args);
    }
    nullableProperty(...args) {
        return returnThis.any.call(this, ...args);
    }
    property(...args) {
        return returnThis.any.call(this, ...args);
    }
    flatMap(...args) {
        return returnThis.any.call(this, ...args);
    }
    tap(...args) {
        return returnThis.any.call(this, ...args);
    }
    satisfies(...args) {
        return returnThis.any.call(this, ...args);
    }
    valueEquals(...args) {
        return returnThis.any.call(this, ...args);
    }
    filter(...args) {
        return returnThis.any.call(this, ...args);
    }
    reject(...args) {
        return returnThis.any.call(this, ...args);
    }
    get(...args) {
        return returnThis.any.call(this, ...args);
    }
    getOrElse(...args) {
        return returnThis.any.call(this, ...args);
    }
    recover(...args) {
        return returnThis.any.call(this, ...args);
    }
    replace(...args) {
        return returnThis.any.call(this, ...args);
    }
}
Optional.fromNullable = fromNullable;
Optional.fromParsedJson = fromParsedJson;
Optional.all = all;
Optional.values = values;
Optional.when = when;
Optional.first = first;
Optional.isOptional = isOptional;
Optional.isSome = isSome;
Optional.isNone = isNone;
/**
   * Maps the value of the Optional to a new value.
   */
Optional.nullableMap = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.nullableMap(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).nullableMap(...params);
};
/**
   * Returns the original optional if it is present, or the return value of the provided replacement function if the original value is not present.
   */
Optional.or = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.or(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).or(...params);
};
/**
   * Pattern matches on the optional value and returns the result of executing the corresponding function for the matching case.
   */
Optional.match = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.match(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).match(...params);
};
/**
   * Maps the value of the Optional to a new value.
   */
Optional.transform = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.transform(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).transform(...params);
};
/**
   * Maps the value of the Optional to a new value.
   */
Optional.map = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.map(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).map(...params);
};
Optional.optionalProperty = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.optionalProperty(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).optionalProperty(...params);
};
Optional.nullableProperty = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.nullableProperty(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).nullableProperty(...params);
};
Optional.property = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.property(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).property(...params);
};
/**
   * Maps the value of the Optional to a new value.
   */
Optional.flatMap = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.flatMap(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).flatMap(...params);
};
/**
   * Executes a function if the Optional is present.
   */
Optional.tap = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.tap(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).tap(...params);
};
/**
   * Checks whether the Optional satisfies a predicate.
   */
Optional.satisfies = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.satisfies(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).satisfies(...params);
};
/**
   * Checks whether the Optional's value is equal to another value.
   */
Optional.valueEquals = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.valueEquals(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).valueEquals(...params);
};
/**
   * Checks whether the Optional's value passes a predicate.
   */
Optional.filter = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.filter(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).filter(...params);
};
/**
   * Checks whether the Optional's value fails a predicate.
   */
Optional.reject = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.reject(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).reject(...params);
};
/**
   * Get the value or throw.
   */
Optional.get = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.get(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).get(...params);
};
/**
   * Get the value or return a default value.
   */
Optional.getOrElse = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.getOrElse(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).getOrElse(...params);
};
/**
   * Recovers from a None Optional.
   */
Optional.recover = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.recover(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).recover(...params);
};
/**
   * Replace the value of the Optional.
   */
Optional.replace = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Optional.replace(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Optional.Some()).replace(...params);
}; /**
* Maps the value of the Optional to a new value.
* @param λ A function that takes the value of the Optional and returns a new value.
* @returns An Optional containing the new value.
* @example
* const optional = Optional.Some(5);
* const newOptional = optional.nullableMap(x => x + 1);
* // newOptional === Optional.Some(6)
*
* const optional = Optional.Some(5);
* const newOptional = optional.nullableMap(x => undefined);
* // newOptional === Optional.None()
*
* const optional = Optional.None();
* const newOptional = optional.nullableMap(x => x + 1);
* // newOptional === Optional.None()
*/
