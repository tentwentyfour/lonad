import { patchPrototype, instantiateWithFactory } from '@utils/factory';
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


export const Some = function makeSome<T>(value?: T): SomeClass<T> {
  return instantiateWithFactory(SomeClass<T>, Some, value);
};

export const None = function makeNone(): NoneClass {
  return instantiateWithFactory(NoneClass, None);
};

patchFactoryFunctions();
