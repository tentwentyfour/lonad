import { patchPrototype, instantiateWithFactory } from '../utils/factory';
import { NoneClass } from './none';
import { SomeClass } from './some';
/**
 * Patch the function prototypes to inherit from their respective
 * Class prototypes
 */
function patchFactoryFunctions() {
    patchPrototype(Some, SomeClass);
    patchPrototype(None, NoneClass);
}
export const Some = function makeSome(value) {
    return instantiateWithFactory((SomeClass), Some, value);
};
export const None = function makeNone() {
    return instantiateWithFactory(NoneClass, None);
};
patchFactoryFunctions();
