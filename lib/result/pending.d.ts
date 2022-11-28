import { Optional } from '../optional/index';
import { AsyncResult } from '../generated/asyncResult.generated';
import { IResultCallbacks } from '../result.types';
export declare class PendingClass<T> extends AsyncResult<T> {
    promise: Promise<any>;
    isAsynchronous: true;
    constructor(promise: any);
    get(): any;
    getOrElse(value?: any): Promise<any>;
    recover(λ: (x: any) => any): AsyncResult<any>;
    replace(value: any): AsyncResult<any>;
    expectProperty(propertyName: string): AsyncResult<any>;
    property(propertyName: string): AsyncResult<any>;
    tap(λ: (x: T) => any): AsyncResult<T>;
    satisfies(predicate: (x: T) => any): Promise<boolean>;
    valueEquals(value: T): Promise<boolean>;
    map(λ: (x: T) => any): AsyncResult<any>;
    transform(λ: (x: T) => any): AsyncResult<any>;
    expectMap(λ: (x: T) => any): any;
    flatMap(λ: (x: T) => any): any;
    merge(): Promise<T>;
    reject(predicate: (x: T) => any): any;
    filter(predicate: (x: T) => any): any;
    match(callbacks: IResultCallbacks<T, any, any, any>): any;
    abortOnErrorWith(λOrValue?: any): AsyncResult<T>;
    tapError(λ: (x: T) => any): AsyncResult<T>;
    mapError(λ: (x: any) => any): AsyncResult<T>;
    recoverWhen(predicate: (x: T) => any, λ: (x: T) => any): AsyncResult<T>;
    abortOnError(): AsyncResult<T>;
    asynchronous(): AsyncResult<T>;
    toPromise(): any;
    toOptional(): Promise<Optional<T>>;
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
    private callWrappedResultMethod;
    /**
     * Makes a property non enumerable
     * @param propertyName The name of the property to make non enumerable
     * @throws {Exception} If the property is accessed
     */
    private makePropertyNonEnumerable;
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
    private static FindNextNonPending;
}
