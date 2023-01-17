import { Result } from '../generated/result.generated';
import { SyncResult } from '../generated/syncResult.generated';
import { AsyncResult } from '../generated/asyncResult.generated';
export declare const Aborted: (message?: any) => SyncResult<any>;
export declare const Error: (message?: any) => SyncResult<any>;
export declare const Ok: <T>(value?: T | undefined) => SyncResult<T>;
export declare const Pending: <T>(promise: PromiseLike<Result<T>> | PromiseLike<T>) => AsyncResult<T>;
