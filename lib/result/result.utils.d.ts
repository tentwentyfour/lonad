import { AsyncResult } from '../generated/asyncResult.generated';
import { Result } from '../generated/result.generated';
import { SyncResult } from '../generated/syncResult.generated';
import { Optional } from '../optional/index';
import { IfAnyOrUnknown } from '../utils/types';
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
export declare function TransformResult<I, O = any, T extends Result<any> = Result>(λ: (x?: T) => Promise<I> | I, wrapFunction?: ((x: I) => O), thisArg?: T): Result<O> | O;
export declare function doTry<T = any>(λ: () => PromiseLike<Optional<T>> | PromiseLike<T>): AsyncResult<T>;
export declare function doTry<T = any>(λ: () => Optional<T> | T): SyncResult<T>;
export declare function tryAsync<T = any>(λ: (x: Result<T>) => PromiseLike<T> | PromiseLike<Optional<T>>): AsyncResult<T>;
export declare function tryAsync<T = any>(λ: (x: Result<T>) => Optional<T> | T): AsyncResult<T>;
/**
 * Function that returns a result based on a truthy check
 * @param truthy The truthy value
 * @param value The value to return if truthy
 * @param error The error to return if falsy
 * @returns The result of the truthy check
 */
export declare function when<T, Y>(truthy: any, value?: T, error?: Y): SyncResult<any>;
/**
 * Function that returns a async result based on a given promise
 * @param promise The promise to convert to a result
 * @returns A AsyncResult based on the promise
 */
export declare function fromPromise<T = any>(promise: Promise<T>): AsyncResult<T>;
/**
 * Function that returns a result based on a given value
 * @param value The value to convert to a result
 * @returns A Result based on the value
 * @example
 * const result = expect(1);
 * // result === Result.Ok(1)
 *
 * const result = expect(null);
 * // result === Result.Error()
 *
 * const result = expect(Optional.Some(1));
 * // result === Result.Ok(1)
 *
 * const result = expect(Optional.None());
 * // result === Result.Error()
 *
 * const result = expect(Result.Ok(1));
 * // result === Result.Ok(1)
 *
 * const result = expect(Promise.resolve(1));
 * // result === Result.Pending(1)
 */
export declare function expect<T = any>(value: PromiseLike<Optional<T>>): AsyncResult<IfAnyOrUnknown<T, any, T & {}>>;
export declare function expect<T = any>(value: Optional<T>): SyncResult<IfAnyOrUnknown<T, any, T & {}>>;
export declare function expect<T = any>(value: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<T, any, T & {}>>;
export declare function expect<T = any>(value: SyncResult<T>): SyncResult<IfAnyOrUnknown<T, any, T & {}>>;
export declare function expect<T = any>(value: Result<T>): Result<IfAnyOrUnknown<T, any, T & {}>>;
export declare function expect<T = any>(value: PromiseLike<T>): AsyncResult<IfAnyOrUnknown<T, any, T & {}>>;
export declare function expect<T = any>(value: T): SyncResult<IfAnyOrUnknown<T, any, T & {}>>;
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
export declare function isResult<T = any>(object: any): object is Result<T>;
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
export declare function isSyncResult<T = any>(object: any): object is SyncResult<T>;
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
export declare function isAsyncResult<T = any>(object: any): object is AsyncResult<T>;
