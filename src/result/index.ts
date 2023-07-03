import { Result } from '@generated/result.generated';

import { AbortedClass } from './aborted';
import { ErrorClass } from './error';
import { OkClass } from './ok';
import { PendingClass } from './pending';

import { Ok, Error, Aborted, Pending } from './result.factory';

function addStaticProperties() {
  Result.Ok = Ok;
  Result.Error = Error;
  Result.Aborted = Aborted;
  Result.Pending = Pending;
}

addStaticProperties();

export {
  OkClass,
  ErrorClass,
  AbortedClass,
  PendingClass,
  Result
};
