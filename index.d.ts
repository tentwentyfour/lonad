type Nullable                             = null | undefined;
type Predicate<T>                         = (T) => boolean;
type Unwrapper<T, U>                      = (T) => U;
type SideEffectsFunction<T>               = (T) => any;
type NullaryValueFactory<U>               = ()  => U;
type TransformationFunction<T, U>         = (T) => U;
type NullableTransformationFunction<T, U> = (T) => U | Nullable;

interface OptionalMembers {
  isOptionalInstance: true;
  valuePresent:       boolean;
  valueAbsent:        boolean;
}

interface OptionalMatchClauses<T, U, V> {
  Some?: Unwrapper<T, U>;
  None?: NullaryValueFactory<V>;
}

interface ParsedOptional<T> extends OptionalMembers {
  value?: T;
}

export declare const Result: any;

export declare module Lonad {
  export interface Optional<T> extends OptionalMembers {
    nullableMap<U>(λ: NullableTransformationFunction<T, U>): Optional<U>;
    match<U, V>(clauses: OptionalMatchClauses<T, U, V>):     U | V;
    transform<U>(λ: TransformationFunction<T, U>):           Optional<U>;
    map<U>(λ: TransformationFunction<T, U>):                 Optional<U>;
    recover<U>(λ: NullaryValueFactory<U>):                   Optional<U>;
    optionalProperty<U>(property: string):                   Optional<U>;
    nullableProperty<U>(property: string):                   Optional<U>;
    flatMap<U>(λ: (T) => Optional<U>):                       Optional<U>;
    or<U>(replacement: Optional<U>):                         Optional<T> | Optional<U>;
    tap(λ: SideEffectsFunction<T>):                          Optional<T>;
    property<U>(property: string):                           Optional<U>;
    getOrElse<U>(replacement: U):                            T | U;
    satisfies(λ: Predicate<T>):                              boolean;
    valueEquals<U>(value: U):                                boolean;
    filter(λ: Predicate<T>):                                 Optional<T>;
    reject(λ: Predicate<T>):                                 Optional<T>;
    get(message?: string):                                   T;
    replace<U>(value: U):                                    Optional<U>;
  }
}

type OptionalTransformer<T, U> = (optional: Lonad.Optional<T>) => U;
type OptionalMatcher<T, U, V>  = (optional: Lonad.Optional<T>) => U | V;
type BindFunction<T, U>        = (T) => Lonad.Optional<U>;

type OptionalMapper<T, U> = OptionalTransformer<T, Lonad.Optional<U>>;

declare module Optional {
  export function Some<T>(value: T): Lonad.Optional<T>;
  export function None<T>():         Lonad.Optional<T>;

  export function fromParsedJson<T>(parsedJson: ParsedOptional<T>): Lonad.Optional<T>;
  export function first(optionals: Lonad.Optional<any>[]):          Lonad.Optional<any>;
  export function all(optionals: Lonad.Optional<any>[]):            Lonad.Optional<any[]>;
  export function fromNullable<T>(value: T | Nullable):             Lonad.Optional<T>;
  export function when<T>(truthy: any, value: T):                   Lonad.Optional<T>;

  export function nullableMap<T, U>(λ: NullableTransformationFunction<T, U>): OptionalMapper<T, U>;
  export function nullableMap<T, U>(
    λ:        NullableTransformationFunction<T, U>,
    optional: Lonad.Optional<T>
  ): Lonad.Optional<U>;

  export function match<T, U, V>(clauses: OptionalMatchClauses<T, U, V>): OptionalMatcher<T, U, V>;
  export function match<T, U, V>(
    clauses:  OptionalMatchClauses<T, U, V>,
    optional: Lonad.Optional<T>
  ): Lonad.Optional<U>;

  export function transform<T, U>(λ: TransformationFunction<T, U>): OptionalMapper<T, U>;
  export function transform<T, U>(
    λ:        TransformationFunction<T, U>,
    optional: Lonad.Optional<T>
  ): Lonad.Optional<U>;

  export function map<T, U>(λ: TransformationFunction<T, U>): OptionalMapper<T, U>;
  export function map<T, U>(
    λ:        TransformationFunction<T, U>,
    optional: Lonad.Optional<T>
  ): Lonad.Optional<U>;

  export function recover<T, U>(λ: NullaryValueFactory<U>): OptionalMapper<T, U>;
  export function recover<T, U>(
    λ:        NullaryValueFactory<U>,
    optional: Lonad.Optional<T>
  ): Lonad.Optional<U>;

  export function optionalProperty<T, U>(property: string): OptionalMapper<T, U>;
  export function optionalProperty<T, U>(
    property: string,
    optional: Lonad.Optional<T>
  ): Lonad.Optional<U>;

  export function nullableProperty<T, U>(property: string): OptionalMapper<T, U>;
  export function nullableProperty<T, U>(
    property: string,
    optional: Lonad.Optional<T>
  ): Lonad.Optional<U>;

  export function property<T, U>(property: string): OptionalMapper<T, U>;
  export function property<T, U>(
    property: string,
    optional: Lonad.Optional<T>
  ): Lonad.Optional<U>;

  export function flatMap<T, U>(λ: BindFunction<T, U>): OptionalMapper<T, U>;
  export function flatMap<T, U>(
    λ:        BindFunction<T, U>,
    optional: Lonad.Optional<T>
  ): Lonad.Optional<U>;

  export function tap<T>(λ: SideEffectsFunction<T>): OptionalMapper<T, T>;
  export function tap<T>(
    λ:        SideEffectsFunction<T>,
    optional: Lonad.Optional<T>
  ): Lonad.Optional<T>;

  export function or<T, U>(replacement: Lonad.Optional<U>): OptionalMapper<T, U>;
  export function or<T, U>(
    replacement: Lonad.Optional<U>,
    optional:    Lonad.Optional<T>
  ): Lonad.Optional<U>;

  export function getOrElse<T, U>(replacement: U): OptionalTransformer<T, T | U>;
  export function getOrElse<T, U>(
    replacement: U,
    optional:    Lonad.Optional<T>
  ): T | U;

  export function satisfies<T>(predicate: Predicate<T>): OptionalTransformer<T, boolean>;
  export function satisfies<T>(
    predicate: Predicate<T>,
    optional:  Lonad.Optional<T>
  ): boolean;

  export function valueEquals<T, U>(value: U): OptionalTransformer<T, boolean>;
  export function valueEquals<T, U>(
    value:     U,
    optional:  Lonad.Optional<T>
  ): boolean;

  export function filter<T>(predicate: Predicate<T>): OptionalMapper<T, T>;
  export function filter<T>(
    predicate: Predicate<T>,
    optional:  Lonad.Optional<T>
  ): Lonad.Optional<T>;

  export function reject<T>(predicate: Predicate<T>): OptionalMapper<T, T>;
  export function reject<T>(
    predicate: Predicate<T>,
    optional:  Lonad.Optional<T>
  ): Lonad.Optional<T>;

  export function get<T>(message: string): OptionalTransformer<T, T>;
  export function get<T>(
    message:   string,
    optional:  Lonad.Optional<T>
  ): OptionalTransformer<T, T>;

  export function replace<T, U>(replacement: U): OptionalMapper<T, U>;
  export function replace<T, U>(
    replacement: U,
    optional:    Lonad.Optional<T>
  ): Lonad.Optional<T>;
}
