import { IResultCallbacks } from '../result.types';
import { AsyncResult } from './asyncResult.generated';
import { Result } from './result.generated';
import { Optional } from './optional.generated';
import { IfAnyOrUnknown } from '../utils/types';
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
export declare abstract class SyncResult<T = any> extends Result<T> {
    /**
  * Returns the value of the result.
  * If the result is not Ok, it will throw an error.
  * @throws Error if the result is not Ok
  * @returns The value of the result
  * @example
  * const result = Result.Ok(1);
  * const value = result.get(); // 1
  */
    get(): T;
    /**
  * Returns the value of the result.
  * If the result is not Ok, it will return the value provided.
  * @param value The value to return if the result is not Ok
  * @returns The value of the result or the provided value
  * @example
  * const result = Result.Ok(1);
  * const value = result.getOrElse(2); // 1
  *
  * const result = Result.Error(1);
  * const value = result.getOrElse(2); // 2
  */
    getOrElse<Y = T>(value?: Y): T | Y;
    getOrElse<Y>(value?: Y): T | Y;
    /**
  * Recovers from an error if an error occurs.
  * @param λ The function to recover with
  * @returns A new result with the recovered value
  * @example
  * const result = Result.Error(1);
  * const recovered = result.recover(() => 5); // Result.Ok(5)
  *
  * const result = Result.Ok(1);
  * const recovered = result.recover(() => 5); // Result.Ok(1)
  */
    recover<R = T>(λ: (x: any) => PromiseLike<R>): AsyncResult<T | R>;
    recover<R = T>(λ: (x: any) => R): SyncResult<T | R>;
    recover<R = T>(λ: (x: any) => R): Result<T | R>;
    /**
  * Replace the value of the result.
  * Will only replace the value if the result is Ok.
  * @param value The value to replace the result with
  * @returns A new result with the replaced value
  * @example
  * const result = Result.Ok(1);
  * const replaced = result.replace(5); // Result.Ok(5)
  *
  * const result = Result.Error(1);
  * const replaced = result.replace(5); // Result.Error(1)
  */
    replace<Y = T>(value: PromiseLike<Y>): AsyncResult<Y>;
    replace<Y = T>(value: Y): SyncResult<Y>;
    replace<Y = T>(value: Y | PromiseLike<Y>): Result<Y>;
    /**
  * Returns the wrapped property value if the result contains an object.
  * Will return an Error result if the property was not found.
  * @param propertyName The name of the property to get
  * @returns A new result with the property value
  * @example
  * const result = Result.Ok({ name: "John" });
  * const name = result.expectProperty("name"); // Result.Ok("John")
  *
  * const result = Result.Ok({ name: "John" });
  * const name = result.expectProperty("age"); // Result.Error()
  */
    expectProperty<Y extends keyof T = keyof T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(propertyName: Y): SyncResult<V>;
    expectProperty<Y extends keyof T = keyof T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(propertyName: Y): Result<V>;
    expectProperty(propertyName: IfAnyOrUnknown<T, any, never>): SyncResult<any>;
    expectProperty(propertyName: IfAnyOrUnknown<T, any, never>): Result<any>;
    /**
  * Returns the wrapped property value if the result contains an object.
  * Will always return an Ok result even if the property was not found.
  * @param propertyName The name of the property to get
  * @returns A new result with the property value
  * @example
  * const result = Result.Ok({ name: "John" });
  * const name = result.property("name"); // Result.Ok("John")
  *
  * const result = Result.Ok({ name: "John" });
  * const name = result.property("age"); // Result.Ok(undefined)
  */
    property<Y extends keyof T = keyof T, U = Y extends keyof T ? T[Y] : any>(propertyName: Y): SyncResult<U>;
    property<Y extends keyof T = keyof T, U = Y extends keyof T ? T[Y] : any>(propertyName: Y): Result<U>;
    property(propertyName: IfAnyOrUnknown<T, any, never>): SyncResult<any>;
    property(propertyName: IfAnyOrUnknown<T, any, never>): Result<any>;
    /**
  * Tap into the result and perform an action.
  * Will only perform the action if the result is Ok.
  * @param λ The action to perform
  * @returns The result
  * @example
  * const result = Result.Ok(1);
  * const tapped = result.tap(x => console.log(x)); // Logs: "1"
  *
  * const result = Result.Error(1);
  * const tapped = result.tap(x => console.log(x)); // No logs!
  */
    tap(λ: (x: T) => PromiseLike<any>): AsyncResult<T>;
    tap(λ: (x: T) => any): SyncResult<T>;
    tap(λ: (x: T) => any): Result<T>;
    /**
  * Test if the result satisfies a predicate.
  * Will only test the predicate if the result is Ok.
  * @param predicate The predicate to test
  * @returns A boolean result
  * @example
  * const result = Result.Ok(1);
  * const satisfied = result.satisfies(x => x === 1); // true
  *
  * const result = Result.Error(1);
  * const satisfied = result.satisfies(x => x === 1); // false
  */
    satisfies(predicate: (x: T) => PromiseLike<boolean | T>): Promise<boolean>;
    satisfies(predicate: (x: T) => boolean | T): boolean;
    /**
  * Test if the result value equals another value.
  * Will only test the equality if the result is Ok.
  * @param value The value to test equality with
  * @returns A boolean result
  * @example
  * const result = Result.Ok(1);
  * const satisfied = result.valueEquals(1); // true
  *
  * const result = Result.Error(1);
  * const satisfied = result.valueEquals(1); // false
  */
    valueEquals<Y = T>(value: Y): boolean;
    valueEquals<Y = any>(value: Y): boolean;
    /**
  * Map the result value.
  * Will only map the value if the result is Ok.
  * Will always return an Ok result even if the passed value is undefined.
  * @param λ The function to map the value to
  * @returns A new result with the mapped value
  * @see {@link transform} Alias
  * @example
  * const result = Result.Ok(1);
  * const mapped = result.map((x) => ({age: x})); // Result.Ok({age: 1})
  *
  * const result = Result.Ok(1);
  * const mapped = result.map((x) => undefined); // Result.Ok(undefined)
  *
  * const result = Result.Error(1);
  * const mapped = result.map((x) => ({age: x})); // Result.Error(1)
  */
    map<Y = T>(λ: (x: T) => PromiseLike<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
    map<Y = T>(λ: (x: T) => Y): SyncResult<IfAnyOrUnknown<Y, any, Y>>;
    map<Y = T>(λ: (x: T) => Y | PromiseLike<Y>): Result<IfAnyOrUnknown<Y, any, Y>>;
    map<Y>(λ: (x: T) => PromiseLike<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
    map<Y>(λ: (x: T) => Y): SyncResult<IfAnyOrUnknown<Y, any, Y>>;
    map<Y>(λ: (x: T) => Y | PromiseLike<Y>): Result<IfAnyOrUnknown<Y, any, Y>>;
    /**
  * Map the result value.
  * Will only map the value if the result is Ok.
  * Will always return an Ok result even if the passed value is undefined.
  * @param λ The function to map the value to
  * @returns A new result with the mapped value
  * @see {@link map} Alias
  * @example
  * const result = Result.Ok(1);
  * const mapped = result.map((x) => ({age: x})); // Result.Ok({age: 1})
  *
  * const result = Result.Ok(1);
  * const mapped = result.map((x) => undefined); // Result.Ok(undefined)
  *
  * const result = Result.Error(1);
  * const mapped = result.map((x) => ({age: x})); // Result.Error(1)
  */
    transform<Y = T>(λ: (x: T) => PromiseLike<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
    transform<Y = T>(λ: (x: T) => Y): SyncResult<IfAnyOrUnknown<Y, any, Y>>;
    transform<Y = T>(λ: (x: T) => Y | PromiseLike<Y>): Result<IfAnyOrUnknown<Y, any, Y>>;
    /**
  * Map the result value.
  * Will only map the value if the result is Ok.
  * Will return an Error result if the passed value is undefined.
  * @param λ The function to map the value to
  * @returns A new result with the mapped value
  * @example
  * const result = Result.Ok(1);
  * const mapped = result.expectMap((x) => ({age: x})); // Result.Ok({age: 1})
  *
  * const result = Result.Ok(1);
  * const mapped = result.expectMap((x) => undefined); // Result.Error()
  *
  * const result = Result.Error(1);
  * const mapped = result.expectMap((x) => ({age: x})); // Result.Error(1)
  */
    expectMap<Y = T>(λ: (x: T) => PromiseLike<Optional<Y>>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    expectMap<Y = T>(λ: (x: T) => PromiseLike<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    expectMap<Y = T>(λ: (x: T) => Optional<Y>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    expectMap<Y = T>(λ: (x: T) => AsyncResult<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    expectMap<Y = T>(λ: (x: T) => SyncResult<Y>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    expectMap<Y = T>(λ: (x: T) => Result<Y>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
    expectMap<Y = T>(λ: (x: T) => Y): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    /**
  * Map the result value and flatten the result.
  * Will only map the value if the result is Ok.
  * @param λ The function to flat map the value to
  * @returns A new result with the flat mapped value
  * @example
  * const result = Result.Ok(1);
  * const mapped = result.flatMap((x) => 5)); // Result.Ok(5)
  *
  * const result = Result.Error(1);
  * const mapped = result.flatMap((x) => 5)); // Result.Error(1)
  *
  * const result = Result.Ok(1);
  * const mapped = result.flatMap((x) => Result.Ok(5)); // Result.Ok(5)
  */
    flatMap<Y = T>(λ: (x: T) => PromiseLike<Optional<Y>>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    flatMap<Y = T>(λ: (x: T) => PromiseLike<Result<Y>>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    flatMap<Y = T>(λ: (x: T) => PromiseLike<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    flatMap<Y = T>(λ: (x: T) => Optional<Y>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    flatMap<Y = T>(λ: (x: T) => AsyncResult<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    flatMap<Y = T>(λ: (x: T) => SyncResult<Y>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    flatMap<Y = T>(λ: (x: T) => Result<Y>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
    flatMap<Y = T>(λ: (x: T) => Y): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    flatMap<Y>(λ: (x: T) => PromiseLike<Optional<Y>>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    flatMap<Y>(λ: (x: T) => PromiseLike<Result<Y>>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    flatMap<Y>(λ: (x: T) => PromiseLike<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    flatMap<Y>(λ: (x: T) => Optional<Y>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    flatMap<Y>(λ: (x: T) => AsyncResult<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    flatMap<Y>(λ: (x: T) => SyncResult<Y>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    flatMap<Y>(λ: (x: T) => Result<Y>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
    flatMap<Y>(λ: (x: T) => Y): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    /**
  * Returns the result value if it is Ok, otherwise returns the error value.
  * @returns The result value or the error value
  * @example
  * const result = Result.Ok(5);
  * const value = result.merge(); // 5
  *
  * const result = Result.Error(10);
  * const value = result.merge(); // 10
  */
    merge(): T;
    /**
  * Rejects the result if the predicate returns true.
  * Will only test the predicate if the result is Ok.
  * @param predicate The predicate to test
  * @returns A new result
  * @example
  * const result = Result.Ok(1);
  * const rejected = result.reject(x => x === 1); // Result.Error()
  */
    reject(predicate: (x: T) => PromiseLike<boolean>): AsyncResult<T>;
    reject(predicate: (x: T) => boolean): SyncResult<T>;
    reject(predicate: (x: T) => boolean | PromiseLike<boolean>): Result<T>;
    /**
  * Filters the result if the predicate returns true.
  * Will only test the predicate if the result is Ok.
  * @param predicate The predicate to test
  * @returns A new result
  * @example
  * const result = Result.Ok(1);
  * const filtered = result.filter(x => x === 1); // Result.Ok(1)
  *
  * const result = Result.Ok(1);
  * const filtered = result.filter(x => x === 2); // Result.Error(2)
  */
    filter<O extends T>(predicate: (x: T) => x is O): SyncResult<O>;
    filter(predicate: (x: T) => PromiseLike<boolean>): AsyncResult<T>;
    filter(predicate: (x: T) => boolean): SyncResult<T>;
    filter(predicate: (x: T) => boolean | PromiseLike<boolean>): Result<T>;
    /**
  * Match the result type and return a value.
  * @param callbacks The callbacks to match
  * @returns The matched value
  * @example
  * const result = Result.Ok(1);
  * const value = result.match({
  *  Ok: (x) => 10,
  *  Error: (x) => 15
  * }); // 10
  *
  * const result = Result.Error(1);
  * const value = result.match({
  *  Ok: (x) => 10,
  *  Error: (x) => 15
  * }); // 15
  */
    match<out_ok = T, out_error = T, out_abort = T>(callbacks: IResultCallbacks<T, out_ok, out_error, out_abort>): out_ok | out_error | out_abort;
    match(callbacks: IResultCallbacks<T, T, T, T>): any;
    /**
  * Aborts the excution if the result is an error with an error value.
  * @param λOrValue The function or value to set as error message if the result is an error
  * @returns A new result
  * @example
  * const result = Result.Ok(1);
  * const aborted = result.abortOnError(); // Result.Ok(1)
  *
  * const result = Result.Error(1);
  * const aborted = result.abortOnError(); // Result.Aborted()
  *
  * const result = Result.Error(1);
  * const aborted = result.abortOnError('Error'); // Result.Aborted('Error')
  */
    abortOnErrorWith(): SyncResult<T>;
    abortOnErrorWith<Y = any>(λOrValue: PromiseLike<any> | ((error: any) => PromiseLike<any>)): AsyncResult<T>;
    abortOnErrorWith<Y = any>(λOrValue: Y | ((error: any) => any)): SyncResult<T>;
    abortOnErrorWith<Y = any>(λOrValue: Y | ((error: any) => any)): Result<T>;
    /**
  * Tap the error value if result is an error.
  * @param λ The function to tap the error value with
  * @returns A new result
  * @example
  * const result = Result.Ok(1);
  * const tapped = result.tapError(x => console.log(x)); // No logs!
  *
  * const result = Result.Error(1);
  * const tapped = result.tapError(x => console.log(x)); // Logs: "1"
  */
    tapError(λ: (x: any) => PromiseLike<any>): AsyncResult<T>;
    tapError(λ: (x: any) => any): SyncResult<T>;
    tapError(λ: (x: any) => any): Result<T>;
    /**
  * Map the error value if result is an error.
  * @param λ The function to map the error value to
  * @returns A new result
  * @example
  * const result = Result.Ok(1);
  * const mapped = result.mapError(x => 10); // Result.Ok(1)
  *
  * const result = Result.Error(1);
  * const mapped = result.mapError(x => 10); // Result.Error(10)
  */
    mapError(λ: (x: any) => PromiseLike<any>): AsyncResult<T>;
    mapError(λ: (x: any) => any): SyncResult<T>;
    mapError(λ: (x: any) => any): Result<T>;
    /**
  * Recover the result if it is an error and the predicate returns true.
  * @param predicate The predicate to test
  * @param λ The function to recover the result with
  * @returns A new result
  * @example
  * const result = Result.Ok(1);
  * const recovered = result.recoverWhen(x => true, x => 10); // Result.Ok(1)
  *
  * const result = Result.Error(1);
  * const recovered = result.recoverWhen(x => true, x => 10); // Result.Ok(10)
  *
  * const result = Result.Error(1);
  * const recovered = result.recoverWhen(x => false, x => 10); // Result.Error(1)
  */
    recoverWhen<Y = T>(predicate: (x: T) => PromiseLike<boolean | T>, λ: (x: T) => PromiseLike<Y>): AsyncResult<T | Y>;
    recoverWhen<Y = T>(predicate: (x: T) => PromiseLike<boolean | T>, λ: (x: T) => Y): AsyncResult<T | Y>;
    recoverWhen<Y = T>(predicate: (x: T) => boolean | T, λ: (x: T) => PromiseLike<Y>): AsyncResult<T | Y>;
    recoverWhen<Y = T>(predicate: (x: T) => boolean | T, λ: (x: T) => Y): SyncResult<T | Y>;
    recoverWhen<Y = T>(predicate: (x: T) => boolean | T | PromiseLike<boolean | T>, λ: (x: T) => Y): Result<T | Y>;
    /**
  * Aborts the excution if the result is an error.
  * @returns A new result
  * @example
  * const result = Result.Ok(1);
  * const aborted = result.abortOnError(); // Result.Ok(1)
  *
  * const result = Result.Error(1);
  * const aborted = result.abortOnError(); // Result.Aborted()
  */
    abortOnError(): SyncResult<T>;
    /**
  * Converts the result to a asyncronous result.
  * @returns A new async result
  * @example
  * const result = Result.Ok(1);
  * const async = result.asynchronous(); // Result.Pending(Result.Ok(1))
  *
  * const result = Result.Error(1);
  * const async = result.asynchronous(); // Result.Pending(Result.Error(1))
  */
    asynchronous(): AsyncResult<T>;
    /**
  * Converts the result to a promise.
  * @returns A promise
  * @example
  * const result = Result.Ok(1);
  * const promise = result.promise(); // Promise<1>
  */
    toPromise(): Promise<T>;
    /**
  * Converts the result to an optional object.
  * @returns An optional
  * @example
  * const result = Result.Ok(1);
  * const optional = result.toOptional(); // Optional.Some(1)
  *
  * const result = Result.Error(1);
  * const optional = result.toOptional(); // Optional.None
  */
    toOptional(): Optional<T>;
}
