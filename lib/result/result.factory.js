import { patchPrototype, instantiateWithFactory } from '../utils/factory';
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
export const Aborted = function makeAborted(message) {
    return instantiateWithFactory(AbortedClass, Aborted, message);
};
export const Error = function makeError(message) {
    return instantiateWithFactory(ErrorClass, Error, message);
};
export const Ok = function makeOk(value) {
    return instantiateWithFactory((OkClass), Ok, value);
};
export const Pending = function makePending(promise) {
    return instantiateWithFactory((PendingClass), Pending, promise);
};
patchFactoryFunctions();
