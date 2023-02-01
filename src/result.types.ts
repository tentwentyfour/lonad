/* eslint-disable @typescript-eslint/ban-types */
import { AsyncResult } from '@generated/asyncResult.generated';
import { SyncResult } from '@generated/syncResult.generated';
import { Result } from '@generated/result.generated';
import { Optional } from '@optional/index';
import { IfAny, IfAnyOrUnknown } from '@utils/types';

export type Expression<In = any, Return = In>             = (arg: In) => Return;
export type ExpressionPromise<In = any, Return = In>      = (arg: In) => PromiseLike<Return>;

export type CallBack<TIn = any, TResult = TIn> = (value: TIn) => TResult;

export type IResultCallbacks<
TIn = any,
TResult_ok = TIn,
TResult_error = TIn,
TResult_aborted = TIn
> = {
  Ok?: CallBack<TIn, TResult_ok>;
  Error?: CallBack<any, TResult_error>;
  Aborted?: CallBack<any, TResult_aborted>;
}

export interface IResultBase {
  isResultInstance: true;
  isOk: boolean;
  isError: boolean;
  isAborted: boolean;
  isAsynchronous: boolean;
}

export interface IResult<T> extends IResultBase {
  /**
   * Returns the value of the result.
   * If the result is not Ok, it will throw an error.
   * @throws Error if the result is not Ok
   * @returns The value of the result
   * @example
   * const result = Result.Ok(1);
   * const value = result.get(); // 1
   */
  get(): T | Promise<T>;

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
  getOrElse<Y = T>(value?: Y): T | Y | Promise<T> | Promise<Y>;

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
  recover<R = T>(λ: (x: any) => R): SyncResult<T | R> | AsyncResult<T | R>;
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
  replace<Y = T>(value: Y): SyncResult<Y> | AsyncResult<Y>;
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
  expectProperty(propertyName: IfAny<T, any, never>): SyncResult<any> | AsyncResult<any>;
  expectProperty(propertyName: IfAny<T, any, never>): Result<any>;
  expectProperty<
    Y extends keyof T,
    U = Y extends keyof T ? T[Y] : any,
    V = U extends Optional<infer X> ? X : U
  >(propertyName: Y):
    SyncResult<IfAnyOrUnknown<V, any, V & {}>> |
    AsyncResult<IfAnyOrUnknown<V, any, V & {}>>;
  expectProperty<
    Y extends keyof T,
    U = Y extends keyof T ? T[Y] : any,
    V = U extends Optional<infer X> ? X : U
  >(propertyName: Y): Result<IfAnyOrUnknown<V, any, V & {}>>;

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
  property(propertyName: IfAny<T, any, never>): SyncResult<any> | AsyncResult<any>;
  property(propertyName: IfAny<T, any, never>): Result<any>;
  property<Y extends keyof T>(propertyName: Y): SyncResult<Y extends keyof T ? T[Y]: any> | AsyncResult<Y extends keyof T ? T[Y]: any>;
  property<Y extends keyof T>(propertyName: Y): Result<Y extends keyof T ? T[Y]: any>;


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
  tap(λ: (x: T) => any): SyncResult<T> | AsyncResult<T>;
  tap(λ: (x: T) => any | PromiseLike<any>): Result<T>;

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
  satisfies(predicate: (x: T) => PromiseLike<T | boolean>): Promise<boolean>;
  satisfies(predicate: (x: T) => T | boolean): boolean | Promise<boolean>;

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
  valueEquals(value: T): boolean | Promise<boolean>;

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
  map<Y = T>(λ: (x: T) => Y): SyncResult<IfAnyOrUnknown<Y, any, Y>> | AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
  map<Y = T>(λ: (x: T) => Y | PromiseLike<Y>): Result<IfAnyOrUnknown<Y, any, Y>>;

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
  transform<Y = T>(λ: (x: T) => Y): SyncResult<IfAnyOrUnknown<Y, any, Y>> | AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
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

  expectMap<Y = T>(λ: (x: T) => PromiseLike<Optional<T>>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
  expectMap<Y = T>(λ: (x: T) => PromiseLike<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
  expectMap<Y = T>(λ: (x: T) => Optional<Y>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
  expectMap<Y = T>(λ: (x: T) => AsyncResult<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
  expectMap<Y = T>(λ: (x: T) => SyncResult<Y>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
  expectMap<Y = T>(λ: (x: T) => Result<Y>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
  expectMap<Y = T>(λ: (x: T) => Y): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>> | AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
  expectMap<Y = T>(λ: (x: T) => Y | PromiseLike<Y>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;

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
  flatMap<Y = T>(λ: (x: T) => SyncResult<Y>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>> | AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
  flatMap<Y = T>(λ: (x: T) => Result<Y>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
  flatMap<Y = T>(λ: (x: T) => Y): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>> | AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
  flatMap<Y = T>(λ: (x: T) => PromiseLike<Optional<IfAnyOrUnknown<Y, any, Y>>> | PromiseLike<Result<IfAnyOrUnknown<Y, any, Y>>> | PromiseLike<IfAnyOrUnknown<Y, any, Y>> | Optional<IfAnyOrUnknown<Y, any, Y>> | Result<IfAnyOrUnknown<Y, any, Y>> | IfAnyOrUnknown<Y, any, Y>): Result<Y & {}>;

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
  merge(): T | Promise<T>;

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
  reject(predicate: (x: T) => boolean): SyncResult<T> | AsyncResult<T>;
  reject(predicate: (x: T) => PromiseLike<boolean> | boolean): Result<T>;

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
  filter<O extends T>(predicate: (x: T) => x is O): SyncResult<O> | AsyncResult<O>;
  filter(predicate: (x: T) => PromiseLike<boolean>): AsyncResult<T>;
  filter(predicate: (x: T) => boolean): SyncResult<T> | AsyncResult<T>;
  filter(predicate: (x: T) => PromiseLike<boolean> | boolean): Result<T>;

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
  match<
  out_ok = T,
  out_error = T,
  out_abort = T,
  >(callbacks: IResultCallbacks<T, out_ok, out_error, out_abort>)
    : out_ok | out_error | out_abort |
      Promise<out_ok | out_error | out_abort>;
  match(callbacks: IResultCallbacks<T>): any;

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
  abortOnErrorWith(): SyncResult<T> | AsyncResult<T>;
  abortOnErrorWith<Y = any>(λOrValue: ((error: any) => PromiseLike<any>) | PromiseLike<any>): AsyncResult<T>
  abortOnErrorWith<Y = any>(λOrValue: ((error: any) => any) | Y): SyncResult<T> | AsyncResult<T>;
  abortOnErrorWith<Y = any>(λOrValue: ((error: any) => any) | Y): Result<T>;

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
  tapError(λ: (x: any) => PromiseLike<void>): AsyncResult<T>;
  tapError(λ: (x: any) => void): SyncResult<T> | AsyncResult<T>;
  tapError(λ: (x: any) => PromiseLike<void> | void): Result<T>;

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
  mapError(λ: (x: any) => any): SyncResult<T> | AsyncResult<T>;
  mapError(λ: (x: any) => PromiseLike<any> | any): Result<T>;


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
  recoverWhen<Y = T>(predicate: (x: T) => PromiseLike<T | boolean>, λ: (x: T) => Y): AsyncResult<Y>;
  recoverWhen<Y = T>(predicate: (x: T) => T | boolean, λ: (x: T) => PromiseLike<Y>): AsyncResult<Y>;
  recoverWhen<Y = T>(predicate: (x: T) => PromiseLike<T | boolean>, λ: (x: T) => PromiseLike<Y>): AsyncResult<Y>;
  recoverWhen<Y = T>(predicate: (x: T) => T | boolean, λ: (x: T) => Y): SyncResult<Y> | AsyncResult<Y>;
  recoverWhen<Y = T>(predicate: (x: T) => T | boolean | PromiseLike<T | boolean>, λ: (x: T) => Y): Result<Y>;

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
  abortOnError(): SyncResult<T> | AsyncResult<T>;

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
  toOptional(): Optional<T> | Promise<Optional<T>>;
}

export interface IOK<T = any> extends IResult<T> {
  value: T;

  isOk: true;
  isError: false;
  isAborted: false;
  isAsynchronous: false;
}

export interface IError<T> extends IResult<T> {
  error: any;

  isError: true;
}

export interface IAborted<T> extends IError<T> {
  isAborted: true;
}


export interface IPending<T, Wrapped extends IResult<T> = IResult<T>> extends IResultBase {
  promise: Promise<Wrapped>;

  isAsynchronous: true;
}


export type createOkType = <T = any>(value?: T) => SyncResult<T>;
export type createErrorType = (message?: any) => SyncResult<any>;
export type createAbortedType = (message?: any) => SyncResult<any>;
export type createPendingType = <T = any>(promise: PromiseLike<Result<T>> | PromiseLike<T>) => AsyncResult<T>;
