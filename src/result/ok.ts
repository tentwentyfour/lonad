import { identity, constant } from '@utils/utils';

import { Optional } from '@optional/index';

import { IResultCallbacks } from '@src/result.types';
import { Result } from '@generated/result.generated';
import { SyncResult } from '@generated/syncResult.generated';

import { expect, TransformResult } from './result.utils';

export class OkClass<T> extends SyncResult<T> {
  isOk = true as const;

  value: T;

  constructor(someValue?: T) {
    super();
    this.value = someValue!;
  }

  get(): T {
    return this.value;
  }

  getOrElse<Y>(): T | Y {
    return this.value;
  }

  replace(value: any): any {
    return TransformResult(constant(value), Result.Ok);
  }

  expectProperty(propertyName: string): any {
    return expect((this.value as any)[propertyName]);
  }

  property(propertyName: string): any {
    return Result.Ok((this.value as any)[propertyName]);
  }

  tap(λ: (x: T) => void): any {
    return TransformResult(() => λ(this.value), constant(this));
  }

  satisfies(predicate: (x: T) => any): any {
    return TransformResult(() => predicate(this.value), Boolean);
  }

  valueEquals(value: T): boolean {
    return this.value === value;
  }

  map(λ: (x: T) => any): any {
    return TransformResult(() => λ(this.value), Result.Ok);
  }

  transform(λ: (x: T) => any): any {
    return this.map(λ);
  }

  expectMap(λ: (x: T) => any): any {
    return expect(λ(this.value));
  }

  flatMap(λ: (x: T) => any): any {
    return TransformResult(() => λ(this.value), expect);
  }

  merge(): T {
    return this.value;
  }

  reject(predicate: (x: T) => any): any {
    return TransformResult(
      () => predicate(this.value),
      (isTruthy) => (isTruthy
        ? Result.Error()
        : Result.Ok(this.value)
      )
    );
  }

  filter(predicate: (x: T) => any): any {
    return TransformResult(
      () => predicate(this.value),
      (isTruthy) => (isTruthy
        ? Result.Ok(this.value)
        : Result.Error()
      )
    );
  }

  match(callbacks: IResultCallbacks<any, any>): any {
    return (callbacks.Ok || identity)(this.value);
  }

  asynchronous(): any {
    return Result.Pending(Promise.resolve(this));
  }

  toPromise(): Promise<T> {
    return Promise.resolve(this.value);
  }

  toOptional(): Optional<T> {
    return Optional.Some(this.value);
  }
}
