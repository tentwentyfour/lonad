import { Optional } from '@generated/optional.generated';
import {
  IOptionalMatchClauses,
  NoneType,
  NullaryValueFactory,
  Predicate,
} from '@src/optional.types';

import throwArgument from '@utils/throw-argument';
import { isFunction } from '@utils/conditional';

export class NoneClass extends Optional<any> implements NoneType {
  valueAbsent = true as const;
  valuePresent = false as const;

  constructor(){
    super();
  }

  or<U>(replacement: (() => Optional<U>) | Optional<U>): Optional<U> {
    return (isFunction(replacement))
      ? replacement()
      : replacement;
  }

  match<U, V>(clauses: IOptionalMatchClauses<any, U, V>): U | V {
    return (clauses.None || throwArgument)(undefined);
  }

  satisfies(λ: Predicate<any>): boolean {
    return false;
  }

  valueEquals(): boolean {
    return false;
  }

  get(message?: string): never {
    throw new Error(message || 'Cannot unwrap None instances');
  }

  getOrElse<U>(replacement?: U): U;
  getOrElse(replacement?: any): any {
    return replacement;
  }

  recover<U>(λ: NullaryValueFactory<U>): Optional<U> {
    return Optional.Some(λ());
  }
}
