import { Optional } from '@generated/optional.generated';
import { NoneClass } from './none';
import { SomeClass } from './some';
import { None, Some } from './optional.factory';

function addStaticProperties() {
  Optional.Some = Some;
  Optional.None = None;
}

addStaticProperties();

export {
  SomeClass,
  NoneClass,

  Optional,
};
