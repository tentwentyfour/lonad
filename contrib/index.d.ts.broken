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

export interface Optional<T> extends OptionalMembers {
  nullableMap<U>(λ: NullableTransformationFunction<T, U>): Optional<U>;
  or<U>(replacement: (() => Optional<U>) | Optional<U>):   Optional<T> | Optional<U>;
  match<U, V>(clauses: OptionalMatchClauses<T, U, V>):     U | V;
  transform<U>(λ: TransformationFunction<T, U>):           Optional<U>;
  map<U>(λ: TransformationFunction<T, U>):                 Optional<U>;
  recover<U>(λ: NullaryValueFactory<U>):                   Optional<U>;
  optionalProperty<U>(property: string):                   Optional<U>;
  nullableProperty<U>(property: string):                   Optional<U>;
  flatMap<U>(λ: (T) => Optional<U>):                       Optional<U>;
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

type OptionalTransformer<T, U> = (optional: Optional<T>) => U;
type OptionalMatcher<T, U, V>  = (optional: Optional<T>) => U | V;
type BindFunction<T, U>        = (T) => Optional<U>;

type OptionalMapper<T, U> = OptionalTransformer<T, Optional<U>>;

interface OptionalModule {
  <T>(): Optional<T>;

  Some<T>(value: T): Optional<T>;
  None<T>():         Optional<T>;

  fromParsedJson<T>(parsedJson: ParsedOptional<T>): Optional<T>;
  first(optionals: Optional<any>[]):          Optional<any>;
  all(optionals: Optional<any>[]):            Optional<any[]>;
  fromNullable<T>(value: T | Nullable):             Optional<T>;
  when<T>(truthy: any, value: T):                   Optional<T>;

  nullableMap<T, U>(λ: NullableTransformationFunction<T, U>): OptionalMapper<T, U>;
  nullableMap<T, U>(
    λ:        NullableTransformationFunction<T, U>,
    optional: Optional<T>
  ): Optional<U>;

  match<T, U, V>(clauses: OptionalMatchClauses<T, U, V>): OptionalMatcher<T, U, V>;
  match<T, U, V>(
    clauses:  OptionalMatchClauses<T, U, V>,
    optional: Optional<T>
  ): Optional<U>;

  transform<T, U>(λ: TransformationFunction<T, U>): OptionalMapper<T, U>;
  transform<T, U>(
    λ:        TransformationFunction<T, U>,
    optional: Optional<T>
  ): Optional<U>;

  map<T, U>(λ: TransformationFunction<T, U>): OptionalMapper<T, U>;
  map<T, U>(
    λ:        TransformationFunction<T, U>,
    optional: Optional<T>
  ): Optional<U>;

  recover<T, U>(λ: NullaryValueFactory<U>): OptionalMapper<T, U>;
  recover<T, U>(
    λ:        NullaryValueFactory<U>,
    optional: Optional<T>
  ): Optional<U>;

  optionalProperty<T, U>(property: string): OptionalMapper<T, U>;
  optionalProperty<T, U>(
    property: string,
    optional: Optional<T>
  ): Optional<U>;

  nullableProperty<T, U>(property: string): OptionalMapper<T, U>;
  nullableProperty<T, U>(
    property: string,
    optional: Optional<T>
  ): Optional<U>;

  property<T, U>(property: string): OptionalMapper<T, U>;
  property<T, U>(
    property: string,
    optional: Optional<T>
  ): Optional<U>;

  flatMap<T, U>(λ: BindFunction<T, U>): OptionalMapper<T, U>;
  flatMap<T, U>(
    λ:        BindFunction<T, U>,
    optional: Optional<T>
  ): Optional<U>;

  tap<T>(λ: SideEffectsFunction<T>): OptionalMapper<T, T>;
  tap<T>(
    λ:        SideEffectsFunction<T>,
    optional: Optional<T>
  ): Optional<T>;

  or<T, U>(replacement: (() => Optional<U>) | Optional<U>): OptionalMapper<T, U>;
  or<T, U>(
    replacement: (() => Optional<U>) | Optional<U>,
    optional:    Optional<T>
  ): Optional<U>;

  getOrElse<T, U>(replacement: U): OptionalTransformer<T, T | U>;
  getOrElse<T, U>(
    replacement: U,
    optional:    Optional<T>
  ): T | U;

  satisfies<T>(predicate: Predicate<T>): OptionalTransformer<T, boolean>;
  satisfies<T>(
    predicate: Predicate<T>,
    optional:  Optional<T>
  ): boolean;

  valueEquals<T, U>(value: U): OptionalTransformer<T, boolean>;
  valueEquals<T, U>(
    value:     U,
    optional:  Optional<T>
  ): boolean;

  filter<T>(predicate: Predicate<T>): OptionalMapper<T, T>;
  filter<T>(
    predicate: Predicate<T>,
    optional:  Optional<T>
  ): Optional<T>;

  reject<T>(predicate: Predicate<T>): OptionalMapper<T, T>;
  reject<T>(
    predicate: Predicate<T>,
    optional:  Optional<T>
  ): Optional<T>;

  get<T>(message: string): OptionalTransformer<T, T>;
  get<T>(
    message:   string,
    optional:  Optional<T>
  ): OptionalTransformer<T, T>;

  replace<T, U>(replacement: U): OptionalMapper<T, U>;
  replace<T, U>(
    replacement: U,
    optional:    Optional<T>
  ): Optional<T>;
}

export declare const Result:   any;
export declare const Optional: OptionalModule;
