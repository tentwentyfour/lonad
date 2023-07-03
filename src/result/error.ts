import throwArgument from '@utils/throw-argument';
import { constant } from '@utils/utils';

import { Optional } from '@optional/index';

import { IResultCallbacks } from '@src/result.types';
import { Result } from '@generated/result.generated';
import { SyncResult } from '@generated/syncResult.generated';

import { TransformResult } from './result.utils';

export class ErrorClass extends SyncResult<any> {
  isError = true as const;

  error: any;

  constructor(error: any) {
    super();
    this.error = error;
  }

  get(): any {
    throw this.error;
  }

  getOrElse(value: any): any {
    return value;
  }

  recover(λ: any): any {
    return TransformResult(() => λ(this.error), Result.Ok);
  }

  recoverWhen(predicate: any, λ: any): any {
    return Result.Ok(this.error)
      .filter(predicate)
      .mapError(constant(this.error))
      .map(λ);
  }

  satisfies(): any {
    return false;
  }

  valueEquals(): boolean {
    return false;
  }

  merge(): any {
    return this.error;
  }

  match(callbacks: IResultCallbacks<any, any>): any {
    return (callbacks.Error || throwArgument)(this.error);
  }

  tapError(λ: (x: any) => void): any {
    return TransformResult(() => λ(this.error), constant(this));
  }

  mapError(λ: (x: any) => any): any {
    return TransformResult(() => λ(this.error), Result.Error);
  }

  abortOnError(): any {
    return Result.Aborted(this.error);
  }

  abortOnErrorWith(λOrValue?: any): any {
    return TransformResult(() => {
      if (typeof λOrValue === 'function') {
        return (<(error: any) => any>λOrValue)(this.error);
      }

      return λOrValue;
    }, Result.Aborted);
  }

  asynchronous(): any {
    return Result.Pending(Promise.resolve(this));
  }

  toPromise(): Promise<any> {
    return Promise.reject(this.error);
  }

  toOptional(): Optional<any> {
    return Optional.None();
  }
}
