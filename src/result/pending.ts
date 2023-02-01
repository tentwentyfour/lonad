import returnThis from '@utils/return-this';
import Exception from '@utils/exception';

import { pipe, property } from '@utils/utils';
import { Optional } from '@optional/index';
import { Result } from '@generated/result.generated';
import { AsyncResult } from '@generated/asyncResult.generated';

import { IResultCallbacks } from '@src/result.types';
import { isAsyncResult } from './result.utils';

export class PendingClass<T> extends AsyncResult<T> {

  promise: Promise<any>;
  isAsynchronous = true as const;

  constructor(promise: any) {
    super();
    this.promise = PendingClass.FindNextNonPending(promise);

    this.makePropertyNonEnumerable('isOk');
    this.makePropertyNonEnumerable('isError');
    this.makePropertyNonEnumerable('isAborted');
  }

  get(): any {
    return this.toPromise();
  }

  getOrElse(value?: any): Promise<any> {
    return pipe(this.callWrappedResultMethod('getOrElse'), property(<any>'promise'))(value) as any;
  }

  recover(λ: (x: any) => any): AsyncResult<any> {
    return this.callWrappedResultMethod('recover')(λ);
  }

  replace(value: any): AsyncResult<any> {
    return this.callWrappedResultMethod('replace')(value);
  }

  expectProperty(propertyName: string): AsyncResult<any> {
    return this.callWrappedResultMethod('expectProperty')(propertyName);
  }

  property(propertyName: string): AsyncResult<any> {
    return this.callWrappedResultMethod('property')(propertyName);
  }

  tap(λ: (x: T) => any): AsyncResult<T> {
    return this.callWrappedResultMethod('tap')(λ);
  }

  satisfies(predicate: (x: T) => any): Promise<boolean> {
    return pipe(this.callWrappedResultMethod('satisfies'), property(<any>'promise'))(predicate) as any;
  }

  valueEquals(value: T): Promise<boolean> {
    return pipe(this.callWrappedResultMethod('valueEquals'), property(<any>'promise'))(value) as any;
  }

  map(λ: (x: T) => any): AsyncResult<any> {
    return this.callWrappedResultMethod('map')(λ);
  }

  transform(λ: (x: T) => any): AsyncResult<any> {
    return this.map(λ);
  }

  expectMap(λ: (x: T) => any): any {
    return this.callWrappedResultMethod('expectMap')(λ);
  }

  flatMap(λ: (x: T) => any): any {
    return this.callWrappedResultMethod('flatMap')(λ);
  }

  merge(): Promise<T> {
    return pipe(this.callWrappedResultMethod('merge'), property(<any>'promise'))() as any;
  }

  reject(predicate: (x: T) => any): any {
    return this.callWrappedResultMethod('reject')(predicate);
  }

  filter(predicate: (x: T) => any): any {
    return this.callWrappedResultMethod('filter')(predicate);
  }

  match(callbacks: IResultCallbacks<T, any, any, any>): any {
    return pipe(this.callWrappedResultMethod('match'), property(<any>'promise'))(callbacks) as any;
  }

  abortOnErrorWith(λOrValue?: any): AsyncResult<T> {
    return this.callWrappedResultMethod('abortOnErrorWith')(λOrValue);
  }

  tapError(λ: (x: T) => any): AsyncResult<T> {
    return this.callWrappedResultMethod('tapError')(λ);
  }

  mapError(λ: (x: any) => any): AsyncResult<T> {
    return this.callWrappedResultMethod('mapError')(λ);
  }

  recoverWhen(predicate: (x: T) => any, λ: (x: T) => any): AsyncResult<T> {
    return this.callWrappedResultMethod('recoverWhen')(predicate, λ);
  }

  abortOnError(): AsyncResult<T> {
    return this.callWrappedResultMethod('abortOnError')();
  }

  asynchronous(): AsyncResult<T> {
    return returnThis.nullary.call(this) as any;
  }

  toPromise(): any {
    return this.promise.then(Result.toPromise);
  }

  toOptional(): Promise<Optional<T>> {
    return pipe(this.callWrappedResultMethod('toOptional'), property(<any>'promise'))() as any;
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
  private callWrappedResultMethod<Wrapped = Result<T>>(methodName: keyof Wrapped) {
    return (...parameters: any[]) => Result.Pending(this
      .promise
      .then((<any>Result)[methodName](...parameters))
      .catch(Result.Aborted));
  };

  /**
   * Makes a property non enumerable
   * @param propertyName The name of the property to make non enumerable
   * @throws {Exception} If the property is accessed
   */
  private makePropertyNonEnumerable(propertyName: string) {
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
  private static async FindNextNonPending<T>(promise: PromiseLike<Result<T>> | PromiseLike<T>): Promise<Result<T> | T> {
    const result = await promise;
    if (isAsyncResult(result) && result instanceof PendingClass) {
      return PendingClass.FindNextNonPending(result.promise);
    }
    return result as T;
  }
}
