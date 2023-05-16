import pipe from 'lodash.flow';

/**
 * Checks if the given value is an object.
 * @param value The value to check
 * @returns True if the value is an object; false otherwise.
 */
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
/**
 * Checks if the given value is defined.
 * @param value The value to check
 * @returns True if the value is defined; false otherwise.
 */
function isDefined(value) {
    return value !== undefined;
}
/**
 * Checks if the given value is null.
 * @param value The value to check
 * @returns True if the value is null; false otherwise.
 */
function isNotNull(value) {
    return value !== null;
}
/**
 * Checks if the given value is not null or undefined.
 * @param value The value to check
 * @returns True if the value is not null or undefined; false otherwise.
 */
function isNotNullOrUndefined(value) {
    return isNotNull(value) && isDefined(value);
}
/**
 * Checks if the given object is a Promise.
 * @param object The object to check
 * @returns True if the object is a Promise; false otherwise.
 */
function isPromise(object) {
    return Boolean(object && object.then);
}
/**
 * Checks if the given value is a function.
 * @param value The value to check
 * @returns True if the value is a function; false otherwise.
 */
function isFunction(value) {
    return typeof value === 'function';
}

/**
 * Wraps a given value in an Optional
 * @param value The value to wrap in an Optional
 * @returns An Optional containing the value
 * @example
 * const optional = Optional.fromNullable(1);
 * // optional === Optional.Some(1)
 *
 * const optional = Optional.fromNullable(null);
 * // optional === Optional.None()
 */
function fromNullable(value) {
    return isNotNullOrUndefined(value)
        ? Optional.Some(value)
        : Optional.None();
}
/**
 * Converts a parsed object to an Optional
 * @param object The parsed object to convert to an Optional
 * @returns An Optional based on the object
 * @throws Error if the object is not an Optional
 * @example
 * const someObject = { isOptionalInstance: true, valuePresent: true, value: 1 };
 * const noneObject = { isOptionalInstance: true, valueAbsent: true };
 * const notOptionalObject = { val: 88 };
 *
 * const optional = Optional.fromParsedJson(someObject);
 * // optional === Optional.Some(1)
 *
 * const optional = Optional.fromParsedJson(noneObject);
 * // optional === Optional.None()
 *
 * const optional = Optional.fromParsedJson(notOptionalObject);
 * // throws Error
 */
function fromParsedJson(object) {
    if (!isOptional(object)) {
        throw new Error('fromParsedJson(object) expects an object obtained from JSON.parsing an Optional stringified with JSON.stringify');
    }
    return isSome(object)
        ? Optional.Some(object.value)
        : Optional.None();
}
/**
 * Checks if all the given optionals have a value.
 * @param optionals The optionals to combine
 * @returns An optional containing an array of the values of the optionals
 * @example
 * const optional1 = Optional.Some(1);
 * const optional2 = Optional.Some(2);
 * const optional3 = Optional.Some(3);
 * const optional4 = Optional.None();
 *
 * const optional = Optional.all([optional1, optional2, optional3]);
 * // optional === Optional.Some([1, 2, 3])
 *
 * const optional = Optional.all([optional1, optional2, optional3, optional4]);
 * // optional === Optional.None()
 */
function all(optionals) {
    if (optionals.some(isNone)) {
        return Optional.None();
    }
    return values(optionals);
}
/**
 * Function that returns an optional based on a truthy check
 * @param truthy The condition to test
 * @param value The value to wrap in an Optional
 * @returns An Optional containing the value if the condition is truthy, otherwise an empty Optional
 * @example
 * const optional = Optional.when(true, 1);
 * // optional === Optional.Some(1)
 *
 * const optional = Optional.when(false, 1);
 * // optional === Optional.None()
 */
function when$1(truthy, value) {
    return truthy ? Optional.Some(value) : Optional.None();
}
/**
 * Retrieves the first optional that has a value.
 * @param optionals The optionals to get the first value from
 * @returns The first optional that has a value, otherwise a none optional
 * @example
 * const optional1 = Optional.None();
 * const optional2 = Optional.Some(1);
 * const optional3 = Optional.None();
 * const optional4 = Optional.Some(3);
 *
 * const optional = Optional.first([optional1, optional2, optional3, optional4]);
 * // optional === Optional.Some(1)
 */
function first(optionals) {
    const firstIndex = optionals.findIndex(isSome);
    if (firstIndex === -1) {
        return Optional.None();
    }
    return optionals[firstIndex];
}
/**
 * Combines the values of the given optionals into an array.
 * Ignores optionals that do not have a value.
 * @param optionals The optionals to combine
 * @returns An optional containing an array of the values of the optionals
 * @example
 * const optional1 = Optional.Some(1);
 * const optional2 = Optional.Some(2);
 * const optional3 = Optional.Some(3);
 * const optional4 = Optional.None();
 *
 * const optional = Optional.values([optional1, optional2, optional3, optional4]);
 * // optional === Optional.Some([1, 2, 3])
 */
function values(optionals) {
    return Optional.Some(optionals
        .filter(isSome)
        .map((optional) => optional.get()));
}
/**
 * Checks if the given object is an Optional
 * @param optional The optional to check
 * @returns True if the given object is an Optional, otherwise false
 */
function isOptional(optional) {
    return Boolean(optional && optional.isOptionalInstance);
}
/**
 * Checks if the given object is an Optional and has a value
 * @param optional The optional to check
 * @returns True if the given object is an Optional and has a value, otherwise false
 * @example
 * const optional = Optional.Some(1);
 * // isSome(optional) === true
 * // isNone(optional) === false
 *
 * const optional = Optional.None();
 * // isSome(optional) === false
 * // isNone(optional) === true
 */
function isSome(optional) {
    return isOptional(optional) && optional.valuePresent;
}
/**
 * Checks if the given object is an Optional and does not have a value
 * @param optional The optional to check
 * @returns True if the given object is an Optional and does not have a value, otherwise false
 * @example
 * const optional = Optional.Some(1);
 * // isSome(optional) === true
 * // isNone(optional) === false
 *
 * const optional = Optional.None();
 * // isSome(optional) === false
 * // isNone(optional) === true
 */
function isNone(optional) {
    return isOptional(optional) && optional.valueAbsent;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function absorbRejectedPromises(value) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield value;
        }
        catch (_) {
            // Nothing to do here.
        }
    });
}
var returnThis = {
    nullary: function nullaryReturnThis() {
        return this;
    },
    unary: function unaryReturnThis(unusedArgument) {
        absorbRejectedPromises(unusedArgument);
        return this;
    },
    binary: function unaryReturnThis(unusedArgument, secondUnusedArgument) {
        absorbRejectedPromises(unusedArgument);
        absorbRejectedPromises(secondUnusedArgument);
        return this;
    },
    any: function anyReturnThis(...unusedArguments) {
        unusedArguments.forEach(absorbRejectedPromises);
        return this;
    }
};

class Optional {
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
Optional.when = when$1;
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

var throwArgument = (argument) => {
    throw argument;
};

class NoneClass extends Optional {
    constructor() {
        super();
        this.valueAbsent = true;
        this.valuePresent = false;
    }
    or(replacement) {
        return (isFunction(replacement))
            ? replacement()
            : replacement;
    }
    match(clauses) {
        return (clauses.None || throwArgument)(undefined);
    }
    satisfies(λ) {
        return false;
    }
    valueEquals() {
        return false;
    }
    get(message) {
        throw new Error(message || 'Cannot unwrap None instances');
    }
    getOrElse(replacement) {
        return replacement;
    }
    recover(λ) {
        return Optional.Some(λ());
    }
}

var Exception = Error;

const identity = (x) => x;
const constant = (x) => () => x;
const property = (propertyName) => (object) => object[propertyName];

class SomeClass extends Optional {
    constructor(someValue) {
        super();
        this.valuePresent = true;
        this.valueAbsent = false;
        this.value = someValue;
    }
    nullableMap(λ) {
        return Optional.fromNullable(λ(this.value));
    }
    match(clauses) {
        return (clauses.Some || identity)(this.value);
    }
    transform(λ) {
        return this.map(λ);
    }
    map(λ) {
        return Optional.Some(λ(this.value));
    }
    optionalProperty(property) {
        return isObject(this.value) ? this.value[property] : undefined;
    }
    nullableProperty(property) {
        return Optional.fromNullable(isObject(this.value) ? this.value[property] : undefined);
    }
    flatMap(λ) {
        return λ(this.value);
    }
    tap(λ) {
        λ(this.value);
        return this;
    }
    property(property) {
        return Optional.Some(isObject(this.value) ? this.value[property] : undefined);
    }
    satisfies(λ) {
        return Boolean(λ(this.value));
    }
    valueEquals(value) {
        return this.value === value;
    }
    filter(λ) {
        return λ(this.value) ? this : Optional.None();
    }
    reject(λ) {
        return !λ(this.value) ? this : Optional.None();
    }
    get() {
        return this.value;
    }
    getOrElse(replacement) {
        return this.value;
    }
    replace(value) {
        return Optional.Some(value);
    }
}

/**
 * Function assigns the prototype of the patch to the target object.
 * @param objectToPatch The object to patch
 * @param patch The prototype patch to apply
 */
function patchPrototype(objectToPatch, patch) {
    const oldPrototype = objectToPatch.prototype;
    objectToPatch.prototype = Object.create(patch.prototype);
    return Object.assign(objectToPatch.prototype, oldPrototype);
}
/**
 * Function instantiates an object and assigns the prototype of the factory to the new object.
 * @param constructor The constructor to instantiate
 * @param factory The factory function to use
 * @param args The arguments to pass to the constructor
 * @returns An instance of the constructor
 */
function instantiateWithFactory(constructor, factory, ...args) {
    const newInstance = new constructor(...args);
    Object.setPrototypeOf(newInstance, factory.prototype);
    return newInstance;
}

/**
 * Patch the function prototypes to inherit from their respective
 * Class prototypes
 */
function patchFactoryFunctions$1() {
    patchPrototype(Some, SomeClass);
    patchPrototype(None, NoneClass);
}
const Some = function makeSome(value) {
    return instantiateWithFactory((SomeClass), Some, value);
};
const None = function makeNone() {
    return instantiateWithFactory(NoneClass, None);
};
patchFactoryFunctions$1();

function addStaticProperties$1() {
    Optional.Some = Some;
    Optional.None = None;
}
addStaticProperties$1();

/**
 * Function that transforms a value into a result
 * @param λ The transformation function
 * @param wrapFunction The function that wraps the result of the transformation function
 * @param thisArg The context of the transformation function
 * @returns The result of the wrapped transformation function.
 * @example
 * const result = TransformResult(() => 2, Result.Ok);
 * // result === Result.Ok(2)
 *
 * const result = TransformResult((x) => x + 2, Result.Ok, 1);
 * // result === Result.Ok(3)
 *
 * const result = TransformResult(() => 5);
 * // result === 5
 */
function TransformResult(λ, wrapFunction = identity, thisArg) {
    try {
        const value = λ(thisArg);
        if (isPromise(value)) {
            return Result.Pending(value.then(wrapFunction, Result.Aborted));
        }
        return wrapFunction(value);
    }
    catch (error) {
        return Result.Aborted(error);
    }
}
function doTry(λ) {
    return TransformResult(λ, (value) => {
        if (isResult(value)) {
            return value;
        }
        let optional = value;
        if (!value || !isOptional(value)) {
            optional = Optional.fromNullable(value);
        }
        return optional.match({
            Some: Result.Ok,
            None: constant(Result.Error())
        });
    });
}
function tryAsync(λ) {
    return pipe(doTry, Result.asynchronous)(λ);
}
/**
 * Function that returns a result based on a truthy check
 * @param truthy The truthy value
 * @param value The value to return if truthy
 * @param error The error to return if falsy
 * @returns The result of the truthy check
 */
function when(truthy, value, error) {
    return truthy ? Result.Ok(value) : Result.Error(error);
}
/**
 * Function that returns a async result based on a given promise
 * @param promise The promise to convert to a result
 * @returns A AsyncResult based on the promise
 */
function fromPromise(promise) {
    return Result.Pending(isPromise(promise) ? promise.then(Result.Ok, Result.Error) : Result.Error());
}
function expect(value) {
    if (!isNotNullOrUndefined(value)) {
        return Result.Error();
    }
    if (!isObject(value)) {
        return Result.Ok(value);
    }
    if (isPromise(value)) {
        return Result.Pending(value.then(expect, Result.Aborted));
    }
    if (isResult(value)) {
        return value;
    }
    const optionalObject = (!isOptional(value))
        ? Optional.fromNullable(value)
        : value;
    return optionalObject.match({
        Some: (e) => Result.Ok(e),
        None: Result.Error
    });
}
/**
 * Function tests if an object is a Result
 * @param object The object to check
 * @returns True if the object is a Result
 * @example
 * const result = isResult(Result.Ok(1));
 * // result === true
 *
 * const result = isResult(Result.Error());
 * // result === true
 *
 * const result = isResult(5);
 * // result === false
 */
function isResult(object) {
    return Boolean(object && object.isResultInstance);
}
/**
 * Function tests if an object is a SyncResult
 * @param object The object to check
 * @returns True if the object is a SyncResult
 * @example
 * const result = isSyncResult(Result.Ok(1));
 * // result === true
 *
 * const result = isSyncResult(Result.Pending(1));
 * // result === false
 *
 * const result = isSyncResult(5);
 * // result === false
 */
function isSyncResult(object) {
    return isResult(object) && object.isAsynchronous === false;
}
/**
 * Function tests if an object is a AsyncResult
 * @param object The object to check
 * @returns True if the object is a AsyncResult
 * @example
 * const result = isAsyncResult(Result.Ok(1));
 * // result === false
 *
 * const result = isAsyncResult(Result.Pending(1));
 * // result === true
 *
 * const result = isAsyncResult(5);
 * // result === false
 */
function isAsyncResult(object) {
    return isResult(object) && object.isAsynchronous === true;
}

/**
 * The base class for all results.
 * The Result class is a combination of both the SyncResult
 * and AsyncResult classes. As such it can be used as a base.
 * @example
 * const syncResult = Result.Ok(1); // SyncResult<number>
 * const result = syncResult as Result<number>; // Result<number>
 * const returnedResult = result.get(); // number | Promise<number>
 *
 * // result is now a Result<number> which can be a SyncResult<number> or an
 * //   AsyncResult<number>. It is not known which one it is. Thus when
 * //   calling functions on it, the return type will be a union of both.
 */
class Result {
    constructor() {
        this.isResultInstance = true;
        this.isAsynchronous = false;
        this.isOk = false;
        this.isError = false;
        this.isAborted = false;
    }
}
Result.fromPromise = fromPromise;
Result.when = when;
Result.expect = expect;
Result.try = doTry;
Result.tryAsync = tryAsync;
Result.isResult = isResult;
Result.isSyncResult = isSyncResult;
Result.isAsyncResult = isAsyncResult;
/**
   * Returns the value of the result.
* If the result is not Ok, it will throw an error.
   */
Result.get = (...params) => {
    if (params.length < 1) {
        return (...subParams) => Result.get(...[...params, ...subParams]);
    }
    const instance = params.splice(0, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).get(...params);
};
/**
   * Returns the value of the result.
* If the result is not Ok, it will return the value provided.
   */
Result.getOrElse = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.getOrElse(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).getOrElse(...params);
};
/**
   * Recovers from an error if an error occurs.
   */
Result.recover = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.recover(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).recover(...params);
};
/**
   * Replace the value of the result.
* Will only replace the value if the result is Ok.
   */
Result.replace = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.replace(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).replace(...params);
};
/**
   * Returns the wrapped property value if the result contains an object.
* Will return an Error result if the property was not found.
   */
Result.expectProperty = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.expectProperty(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).expectProperty(...params);
};
/**
   * Returns the wrapped property value if the result contains an object.
* Will always return an Ok result even if the property was not found.
   */
Result.property = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.property(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).property(...params);
};
/**
   * Tap into the result and perform an action.
* Will only perform the action if the result is Ok.
   */
Result.tap = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.tap(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).tap(...params);
};
/**
   * Test if the result satisfies a predicate.
* Will only test the predicate if the result is Ok.
   */
Result.satisfies = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.satisfies(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).satisfies(...params);
};
/**
   * Test if the result value equals another value.
* Will only test the equality if the result is Ok.
   */
Result.valueEquals = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.valueEquals(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).valueEquals(...params);
};
/**
   * Map the result value.
* Will only map the value if the result is Ok.
* Will always return an Ok result even if the passed value is undefined.
   */
Result.map = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.map(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).map(...params);
};
/**
   * Map the result value.
* Will only map the value if the result is Ok.
* Will always return an Ok result even if the passed value is undefined.
   */
Result.transform = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.transform(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).transform(...params);
};
/**
   * Map the result value.
* Will only map the value if the result is Ok.
* Will return an Error result if the passed value is undefined.
   */
Result.expectMap = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.expectMap(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).expectMap(...params);
};
/**
   * Map the result value and flatten the result.
* Will only map the value if the result is Ok.
   */
Result.flatMap = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.flatMap(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).flatMap(...params);
};
/**
   * Returns the result value if it is Ok, otherwise returns the error value.
   */
Result.merge = (...params) => {
    if (params.length < 1) {
        return (...subParams) => Result.merge(...[...params, ...subParams]);
    }
    const instance = params.splice(0, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).merge(...params);
};
/**
   * Rejects the result if the predicate returns true.
* Will only test the predicate if the result is Ok.
   */
Result.reject = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.reject(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).reject(...params);
};
/**
   * Filters the result if the predicate returns true.
* Will only test the predicate if the result is Ok.
   */
Result.filter = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.filter(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).filter(...params);
};
/**
   * Match the result type and return a value.
   */
Result.match = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.match(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).match(...params);
};
/**
   * Aborts the excution if the result is an error with an error value.
   */
Result.abortOnErrorWith = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.abortOnErrorWith(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).abortOnErrorWith(...params);
};
/**
   * Tap the error value if result is an error.
   */
Result.tapError = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.tapError(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).tapError(...params);
};
/**
   * Map the error value if result is an error.
   */
Result.mapError = (...params) => {
    if (params.length < 2) {
        return (...subParams) => Result.mapError(...[...params, ...subParams]);
    }
    const instance = params.splice(1, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).mapError(...params);
};
/**
   * Recover the result if it is an error and the predicate returns true.
   */
Result.recoverWhen = (...params) => {
    if (params.length < 3) {
        return (...subParams) => Result.recoverWhen(...[...params, ...subParams]);
    }
    const instance = params.splice(2, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).recoverWhen(...params);
};
/**
   * Aborts the excution if the result is an error.
   */
Result.abortOnError = (...params) => {
    if (params.length < 1) {
        return (...subParams) => Result.abortOnError(...[...params, ...subParams]);
    }
    const instance = params.splice(0, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).abortOnError(...params);
};
/**
   * Converts the result to a asyncronous result.
   */
Result.asynchronous = (...params) => {
    if (params.length < 1) {
        return (...subParams) => Result.asynchronous(...[...params, ...subParams]);
    }
    const instance = params.splice(0, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).asynchronous(...params);
};
/**
   * Converts the result to a promise.
   */
Result.toPromise = (...params) => {
    if (params.length < 1) {
        return (...subParams) => Result.toPromise(...[...params, ...subParams]);
    }
    const instance = params.splice(0, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).toPromise(...params);
};
/**
   * Converts the result to an optional object.
   */
Result.toOptional = (...params) => {
    if (params.length < 1) {
        return (...subParams) => Result.toOptional(...[...params, ...subParams]);
    }
    const instance = params.splice(0, 1)[0];
    return (instance !== null && instance !== void 0 ? instance : Result.Ok()).toOptional(...params);
};

/**
 * A result that is not awaitable.
 * Contrary to the AsyncResult, this result object does not contain
 * a promise that can be awaited.
 * @template T The type of the value of the result
 * @see {@link AsyncResult} for an awaitable result
 * @see {@link Result} for a result that can be both asynchronous and synchronous
 * @example
 * const result = Result
 *  .expect('hello world');
 *
 * const value = result.get(); // 'hello world'
 */
class SyncResult extends Result {
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
    expectProperty(...args) {
        return returnThis.any.call(this, ...args);
    }
    property(...args) {
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
    map(...args) {
        return returnThis.any.call(this, ...args);
    }
    transform(...args) {
        return returnThis.any.call(this, ...args);
    }
    expectMap(...args) {
        return returnThis.any.call(this, ...args);
    }
    flatMap(...args) {
        return returnThis.any.call(this, ...args);
    }
    merge(...args) {
        return returnThis.any.call(this, ...args);
    }
    reject(...args) {
        return returnThis.any.call(this, ...args);
    }
    filter(...args) {
        return returnThis.any.call(this, ...args);
    }
    match(...args) {
        return returnThis.any.call(this, ...args);
    }
    abortOnErrorWith(...args) {
        return returnThis.any.call(this, ...args);
    }
    tapError(...args) {
        return returnThis.any.call(this, ...args);
    }
    mapError(...args) {
        return returnThis.any.call(this, ...args);
    }
    recoverWhen(...args) {
        return returnThis.any.call(this, ...args);
    }
    abortOnError(...args) {
        return returnThis.any.call(this, ...args);
    }
    asynchronous(...args) {
        return returnThis.any.call(this, ...args);
    }
    toPromise(...args) {
        return returnThis.any.call(this, ...args);
    }
    toOptional(...args) {
        return returnThis.any.call(this, ...args);
    }
}

class AbortedClass extends SyncResult {
    constructor(error) {
        super();
        this.isError = true;
        this.isAborted = true;
        this.error = error;
    }
    tapError(λ) {
        return TransformResult(() => λ(this.error), constant(this));
    }
    get() {
        throw this.error;
    }
    getOrElse(value) {
        return value;
    }
    satisfies() {
        return false;
    }
    valueEquals() {
        return false;
    }
    merge() {
        return this.error;
    }
    match(callbacks) {
        return (callbacks.Aborted || throwArgument)(this.error);
    }
    asynchronous() {
        return Result.Pending(Promise.resolve(this));
    }
    toPromise() {
        return Promise.reject(this.error);
    }
    toOptional() {
        return Optional.None();
    }
}

class ErrorClass extends SyncResult {
    constructor(error) {
        super();
        this.isError = true;
        this.error = error;
    }
    get() {
        throw this.error;
    }
    getOrElse(value) {
        return value;
    }
    recover(λ) {
        return TransformResult(() => λ(this.error), Result.Ok);
    }
    recoverWhen(predicate, λ) {
        return Result.Ok(this.error)
            .filter(predicate)
            .mapError(constant(this.error))
            .map(λ);
    }
    satisfies() {
        return false;
    }
    valueEquals() {
        return false;
    }
    merge() {
        return this.error;
    }
    match(callbacks) {
        return (callbacks.Error || throwArgument)(this.error);
    }
    tapError(λ) {
        return TransformResult(() => λ(this.error), constant(this));
    }
    mapError(λ) {
        return TransformResult(() => λ(this.error), Result.Error);
    }
    abortOnError() {
        return Result.Aborted(this.error);
    }
    abortOnErrorWith(λOrValue) {
        return TransformResult(() => {
            if (typeof λOrValue === 'function') {
                return λOrValue(this.error);
            }
            return λOrValue;
        }, Result.Aborted);
    }
    asynchronous() {
        return Result.Pending(Promise.resolve(this));
    }
    toPromise() {
        return Promise.reject(this.error);
    }
    toOptional() {
        return Optional.None();
    }
}

class OkClass extends SyncResult {
    constructor(someValue) {
        super();
        this.isOk = true;
        this.value = someValue;
    }
    get() {
        return this.value;
    }
    getOrElse() {
        return this.value;
    }
    replace(value) {
        return TransformResult(constant(value), Result.Ok);
    }
    expectProperty(propertyName) {
        return expect(this.value[propertyName]);
    }
    property(propertyName) {
        return Result.Ok(this.value[propertyName]);
    }
    tap(λ) {
        return TransformResult(() => λ(this.value), constant(this));
    }
    satisfies(predicate) {
        return TransformResult(() => predicate(this.value), Boolean);
    }
    valueEquals(value) {
        return this.value === value;
    }
    map(λ) {
        return TransformResult(() => λ(this.value), Result.Ok);
    }
    transform(λ) {
        return this.map(λ);
    }
    expectMap(λ) {
        return expect(λ(this.value));
    }
    flatMap(λ) {
        return TransformResult(() => λ(this.value), expect);
    }
    merge() {
        return this.value;
    }
    reject(predicate) {
        return TransformResult(() => predicate(this.value), (isTruthy) => (isTruthy
            ? Result.Error()
            : Result.Ok(this.value)));
    }
    filter(predicate) {
        return TransformResult(() => predicate(this.value), (isTruthy) => (isTruthy
            ? Result.Ok(this.value)
            : Result.Error()));
    }
    match(callbacks) {
        return (callbacks.Ok || identity)(this.value);
    }
    asynchronous() {
        return Result.Pending(Promise.resolve(this));
    }
    toPromise() {
        return Promise.resolve(this.value);
    }
    toOptional() {
        return Optional.Some(this.value);
    }
}

/**
 * A result that can be awaited.
 * Contrary to the SyncResult, this result object contains
 * a promise that can be awaited. When used, the entire current
 * chain of result will be converted to AsyncResult.
 * @template T The type of the value of the result
 * @see {@link SyncResult} for a synchronous version of this class
 * @see {@link Result} for a result that can be both asynchronous and synchronous
 * @example
 * const result = Result
 *  .expect(Promise.resolve('hello world'))
 *  .toPromise();
 *
 * const value = await result; // 'hello world'
 */
class AsyncResult extends Result {
}

class PendingClass extends AsyncResult {
    constructor(promise) {
        super();
        this.isAsynchronous = true;
        this.promise = PendingClass.FindNextNonPending(promise);
        this.makePropertyNonEnumerable('isOk');
        this.makePropertyNonEnumerable('isError');
        this.makePropertyNonEnumerable('isAborted');
    }
    get() {
        return this.toPromise();
    }
    getOrElse(value) {
        return pipe(this.callWrappedResultMethod('getOrElse'), property('promise'))(value);
    }
    recover(λ) {
        return this.callWrappedResultMethod('recover')(λ);
    }
    replace(value) {
        return this.callWrappedResultMethod('replace')(value);
    }
    expectProperty(propertyName) {
        return this.callWrappedResultMethod('expectProperty')(propertyName);
    }
    property(propertyName) {
        return this.callWrappedResultMethod('property')(propertyName);
    }
    tap(λ) {
        return this.callWrappedResultMethod('tap')(λ);
    }
    satisfies(predicate) {
        return pipe(this.callWrappedResultMethod('satisfies'), property('promise'))(predicate);
    }
    valueEquals(value) {
        return pipe(this.callWrappedResultMethod('valueEquals'), property('promise'))(value);
    }
    map(λ) {
        return this.callWrappedResultMethod('map')(λ);
    }
    transform(λ) {
        return this.map(λ);
    }
    expectMap(λ) {
        return this.callWrappedResultMethod('expectMap')(λ);
    }
    flatMap(λ) {
        return this.callWrappedResultMethod('flatMap')(λ);
    }
    merge() {
        return pipe(this.callWrappedResultMethod('merge'), property('promise'))();
    }
    reject(predicate) {
        return this.callWrappedResultMethod('reject')(predicate);
    }
    filter(predicate) {
        return this.callWrappedResultMethod('filter')(predicate);
    }
    match(callbacks) {
        return pipe(this.callWrappedResultMethod('match'), property('promise'))(callbacks);
    }
    abortOnErrorWith(λOrValue) {
        return this.callWrappedResultMethod('abortOnErrorWith')(λOrValue);
    }
    tapError(λ) {
        return this.callWrappedResultMethod('tapError')(λ);
    }
    mapError(λ) {
        return this.callWrappedResultMethod('mapError')(λ);
    }
    recoverWhen(predicate, λ) {
        return this.callWrappedResultMethod('recoverWhen')(predicate, λ);
    }
    abortOnError() {
        return this.callWrappedResultMethod('abortOnError')();
    }
    asynchronous() {
        return returnThis.nullary.call(this);
    }
    toPromise() {
        return this.promise.then(Result.toPromise);
    }
    toOptional() {
        return pipe(this.callWrappedResultMethod('toOptional'), property('promise'))();
    }
    /**
     * Calls a method on the wrapped result.
     * if the promise is rejected, the result will be aborted.
     * @param methodName The name of the method to call on the wrapped result
     * @returns A function that calls the method on the wrapped result
     * @example
     * const pending = Result.Pending(Result.Ok(1));
     * const method = pending.callWrappedResultMethod('get'); // Returns a function that calls Result.Ok(1).get()
     * const result = method(); // Returns 1
     */
    callWrappedResultMethod(methodName) {
        return (...parameters) => Result.Pending(this
            .promise
            .then(Result[methodName](...parameters))
            .catch(Result.Aborted));
    }
    ;
    /**
     * Makes a property non enumerable
     * @param propertyName The name of the property to make non enumerable
     * @throws {Exception} If the property is accessed
     */
    makePropertyNonEnumerable(propertyName) {
        Object.defineProperty(this, propertyName, {
            enumerable: false,
            get: () => {
                throw new Exception(`Cannot access '${propertyName}' of Result.Pending`);
            },
        });
    }
    /**
     * Finds the next non-pending result in a promise chain
     * @param promise The promise to unwrap
     * @returns The unwrapped promise
     * @example
     * const pending = Result.Pending(
     *  Result.Pending(
     *    Promise.resolve(
     *      'Hello World'
     *    )
     *  )
     * );
     * const result = await FindNextNonPending(pending.promise); // Returns 'Hello World'
     */
    static FindNextNonPending(promise) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield promise;
            if (isAsyncResult(result) && result instanceof PendingClass) {
                return PendingClass.FindNextNonPending(result.promise);
            }
            return result;
        });
    }
}

/**
 * Patch the function prototypes to inherit from their respective
 * Class prototypes
 */
function patchFactoryFunctions() {
    patchPrototype(Ok, OkClass);
    patchPrototype(Error$1, ErrorClass);
    patchPrototype(Aborted, AbortedClass);
    patchPrototype(Pending, PendingClass);
}
const Aborted = function makeAborted(message) {
    return instantiateWithFactory(AbortedClass, Aborted, message);
};
const Error$1 = function makeError(message) {
    return instantiateWithFactory(ErrorClass, Error$1, message);
};
const Ok = function makeOk(value) {
    return instantiateWithFactory((OkClass), Ok, value);
};
const Pending = function makePending(promise) {
    return instantiateWithFactory((PendingClass), Pending, promise);
};
patchFactoryFunctions();

function addStaticProperties() {
    Result.Ok = Ok;
    Result.Error = Error$1;
    Result.Aborted = Aborted;
    Result.Pending = Pending;
}
addStaticProperties();

export { AsyncResult, Optional, Result, SyncResult };
//# sourceMappingURL=lonad-bundle.es.js.map
