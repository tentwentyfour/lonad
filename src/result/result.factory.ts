import { patchPrototype, instantiateWithFactory } from '@utils/factory';
import { Result } from '@generated/result.generated';
import { SyncResult } from '@generated/syncResult.generated';
import { AsyncResult } from '@generated/asyncResult.generated';
import { AbortedClass } from './aborted';
import { ErrorClass } from './error';
import { OkClass } from './ok';
import { PendingClass } from './pending';


/**
 * Patch the function prototypes to inherit from their respective
 * Class prototypes
 */
function patchFactoryFunctions() {
  patchPrototype(Ok, OkClass);
  patchPrototype(Error, ErrorClass);
  patchPrototype(Aborted, AbortedClass);
  patchPrototype(Pending, PendingClass);
}

export const Aborted = function makeAborted(message?: any): SyncResult<any> {
  return instantiateWithFactory(AbortedClass, Aborted, message);
};

export const Error = function makeError(message?: any): SyncResult<any> {
  return instantiateWithFactory(ErrorClass, Error, message);
};

export const Ok = function makeOk<T>(value?: T): SyncResult<T> {
  return instantiateWithFactory(OkClass<T>, Ok, value);
};

export const Pending = function makePending<T>(promise: PromiseLike<Result<T>> | PromiseLike<T>): AsyncResult<T> {
  return instantiateWithFactory(PendingClass<T>, Pending, promise);
};

patchFactoryFunctions();
