import { Result } from '../generated/result.generated';
import { Optional } from '../optional/index';
import { isOptional } from '../optional/optional.utils';
import { constant, identity, pipe } from '../utils/utils';
import { isNotNullOrUndefined, isObject, isPromise } from '../utils/conditional';
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
export function TransformResult(λ, wrapFunction = identity, thisArg) {
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
export function doTry(λ) {
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
export function tryAsync(λ) {
    return pipe(doTry, Result.asynchronous)(λ);
}
/**
 * Function that returns a result based on a truthy check
 * @param truthy The truthy value
 * @param value The value to return if truthy
 * @param error The error to return if falsy
 * @returns The result of the truthy check
 */
export function when(truthy, value, error) {
    return truthy ? Result.Ok(value) : Result.Error(error);
}
/**
 * Function that returns a async result based on a given promise
 * @param promise The promise to convert to a result
 * @returns A AsyncResult based on the promise
 */
export function fromPromise(promise) {
    return Result.Pending(isPromise(promise) ? promise.then(Result.Ok, Result.Error) : Result.Error());
}
export function expect(value) {
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
export function isResult(object) {
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
export function isSyncResult(object) {
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
export function isAsyncResult(object) {
    return isResult(object) && object.isAsynchronous === true;
}
