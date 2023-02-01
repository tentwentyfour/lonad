import { Optional } from '@generated/optional.generated';
import {
  IOptionalMatchClauses,
  NullableTransformationFunction,
  Predicate,
  SideEffectsFunction,
  SomeType,
  TransformationFunction,
} from '@src/optional.types';

import { identity } from '@utils/utils';
import { isObject } from '@utils/conditional';

export class SomeClass<T> extends Optional<T> implements SomeType<T> {
  valuePresent = true as const;
  valueAbsent = false as const;

  value: T;

  constructor(someValue?: T) {
    super();
    this.value = someValue!;
  }

  nullableMap<U>(λ: NullableTransformationFunction<T, U>): Optional<U> {
    return Optional.fromNullable(λ(this.value)) as any;
  }

  match<U, V>(clauses: IOptionalMatchClauses<T, U, V>): U | V {
    return (clauses.Some || identity)(<any> this.value);
  }

  transform<U>(λ: TransformationFunction<T, U>): Optional<U> {
    return this.map(λ);
  }

  map<U>(λ: TransformationFunction<T, U>): Optional<U> {
    return Optional.Some(λ(this.value));
  }

  optionalProperty(property: string | symbol | number): any {
    return isObject(this.value) ? this.value[property] : undefined;
  }


  nullableProperty(property: string | symbol | number): any {
    return Optional.fromNullable(isObject(this.value) ? this.value[property] : undefined);
  }

  flatMap<U>(λ: TransformationFunction<T, U>): U {
    return λ(this.value);
  }

  tap(λ: SideEffectsFunction<T>): Optional<T> {
    λ(this.value);

    return this;
  }

  property(property: string | symbol | number): any {
    return Optional.Some(isObject(this.value) ? this.value[property] : undefined);
  }

  satisfies(λ: Predicate<T>): boolean {
    return Boolean(λ(this.value));
  }

  valueEquals(value: T): boolean;
  valueEquals<U>(value: U): boolean;
  valueEquals(value: any): boolean {
    return this.value === value;
  }

  filter(λ: Predicate<T>): Optional<T> {
    return λ(this.value) ? this : Optional.None();
  }

  reject(λ: Predicate<T>): Optional<T> {
    return !λ(this.value) ? this : Optional.None();
  }

  get(): T {
    return this.value;
  }

  getOrElse(replacement?: any): any {
    return this.value;
  }

  replace<U>(value: U): Optional<U> {
    return Optional.Some(value);
  }
}
