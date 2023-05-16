import { doTry, expect, fromPromise, tryAsync, when, isResult, isSyncResult, isAsyncResult } from '../result/result.utils';
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
export class Result {
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
