import throwArgument from '@utils/throw-argument';

import { Optional } from '@optional/index';

import { IResultCallbacks } from '@src/result.types';
import { Result } from '@generated/result.generated';
import { SyncResult } from '@generated/syncResult.generated';
import { TransformResult } from './result.utils';
import { constant } from '@utils/utils';

export class AbortedClass extends SyncResult<any> {
  isError = true as const;
  isAborted = true as const;

  error: any;

  constructor(error: any) {
    super();
    this.error = error;
  }

  tapError(λ: any): any {
    return TransformResult(() => λ(this.error), constant(this));
  }

  get(): any {
    throw this.error;
  }

  getOrElse(value: any): any {
    return value;
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
    return (callbacks.Aborted || throwArgument)(this.error);
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
