import { Optional } from '@generated/optional.generated';
import { IfAnyOrUnknown, IfAny, IfNullOrUndefined } from '@utils/types';

export type Predicate<T>                          = (element: T) => boolean | T;
export type Unwrapper<T, U>                       = (element: T) => U;
export type SideEffectsFunction<T>                = (element: T) => any;
export type NullaryValueFactory<U>                = ()  => U;
export type TransformationFunction<T, U>          = (element: T) => U;
export type NullableTransformationFunction<T, U>  = (element: T) => U | null | undefined;

type OptionalTransformer<T, U> = (optional: Optional<T>) => U;
type OptionalMatcher<T, U, V>  = (optional: Optional<T>) => U | V;
type BindFunction<T, U>        = (t: T) => Optional<U>;

type OptionalMapper<T, U> = OptionalTransformer<T, Optional<U>>;

export type NoneType = {
  isOptionalInstance: true;
  valueAbsent: true;
  valuePresent: false;
};

export type SomeType<T> = {
  isOptionalInstance: true;
  valueAbsent: false;
  valuePresent: true;
  value: T;
};

export interface IOptionalMembers {
  isOptionalInstance: true;
  valuePresent:       boolean;
  valueAbsent:        boolean;
  value?: any;
}

export interface IResultMembers {
  isResultInstance: true;
  isOk:             boolean;
  isError:          boolean;
  isAborted:        boolean;
  isAsynchronous:   boolean;
}

export interface IOptionalMatchClauses<T, some_optional = undefined, none_optional = undefined> {
  Some?: Unwrapper<T, some_optional>;
  None?: NullaryValueFactory<none_optional>;
}

export interface IParsedOptional<T> extends IOptionalMembers {
  value?: T;
}

export interface IOptional<T = any> extends IOptionalMembers {
  /**
   * Maps the value of the Optional to a new value.
   * @param λ A function that takes the value of the Optional and returns a new value.
   * @returns An Optional containing the new value.
   * @example
   * const optional = Optional.Some(5);
   * const newOptional = optional.nullableMap(x => x + 1);
   * // newOptional === Optional.Some(6)
   *
   * const optional = Optional.Some(5);
   * const newOptional = optional.nullableMap(x => undefined);
   * // newOptional === Optional.None()
   *
   * const optional = Optional.None();
   * const newOptional = optional.nullableMap(x => x + 1);
   * // newOptional === Optional.None()
   */
  nullableMap<U = T>(λ: NullableTransformationFunction<T, U>):          Optional<U>;

  /**
   * Returns the original optional if it is present, or the return value of the provided replacement function if the original value is not present.
   * @param replacement A function that returns an Optional or a value that will be used as a replacement if the Optional is None.
   * @returns The original Optional if it is present, or the return value of the provided replacement function if the original value is not present.
   * @example
   * const some = Optional.Some(5);
   * const result = some.or(() => Optional.Some(6));
   * // result === Optional.Some(5)
   *
   * const none = Optional.None();
   * const result = none.or(() => Optional.Some(6));
   * // result === Optional.Some(6)
   */
  or<U = T>(replacement: (() => Optional<U>) | Optional<U>):            Optional<T> | Optional<U>;

  /**
   * Pattern matches on the optional value and returns the result of executing the corresponding function for the matching case.
   * @param clauses An object containing functions to execute for the "Some" and "None" cases.
   * @returns The result of executing the matching function.
   */
  match<
    U = undefined,
    V = undefined
  >(clauses: IOptionalMatchClauses<T, U, V>):                           U | V;

  /**
   * Maps the value of the Optional to a new value.
   * @param λ A function that takes the value of the Optional and returns a new value.
   * @see Alias for {@link map}
   */
  transform<U>(λ: TransformationFunction<T, U>):                        Optional<IfAnyOrUnknown<U, any, U>>;

  /**
   * Maps the value of the Optional to a new value.
   * @param λ A function that takes the value of the Optional and returns a new value.
   * @returns An Optional containing the new value.
   * @example
   * const some = Optional.Some(5);
   * const result = some.map(x => `Result - ${x}`);
   * // result === Optional.Some("Result - 5")
   *
   * const none = Optional.None();
   * const result = none.map(x => `Result - ${x}`);
   * // result === Optional.None()
   */
  map<U>(λ: TransformationFunction<T, U>):                              Optional<IfAnyOrUnknown<U, any, U>>;

  /**
   * Maps the value of the Optional to a property of the value.
   * @param property The name of the property to retrieve.
   * @returns The value of the property or an None Optional.
   * @example
   * const some = Optional.Some({ name: "John", age: 30 });
   * const result = some.property("name");
   * // result === "John"
   *
   * const none = Optional.None();
   * const result = none.property("name");
   * // result === Optional.None()
   */
  optionalProperty(property: IfAny<T, any, never>):                     any;
  optionalProperty<U extends keyof T>(property: U):                     IfAnyOrUnknown<T, Optional, U extends keyof T ? T[U] : never>;

  /**
   * Maps the value of the Optional to a property of the value.
   * Wraps the value in an Optional.
   * @param property The name of the property to retrieve.
   * @returns An Optional containing the value of the property.
   * @example
   * const some = Optional.Some({ name: "John", age: 30 });
   * const result = some.nullableProperty("name");
   * // result === Optional.Some("John")
   *
   * const some = Optional.Some({ name: "John", age: 30 });
   * const result = some.nullableProperty("nonExistentProperty");
   * // result === Optional.None()
   *
   * const none = Optional.None();
   * const result = none.nullableProperty("name");
   * // result === Optional.None()
   */
  nullableProperty(property: IfAny<T, any, never>):                     Optional<any>;
  nullableProperty<U extends keyof T>(property: U):                     IfAnyOrUnknown<T, Optional, U extends keyof T ? Optional<IfNullOrUndefined<T[U], any, T[U]>> : never>;

  /**
   * Maps the value of the Optional to a property of the value.
   * Wraps the value in an Some Optional.
   * @param property The name of the property to retrieve.
   * @returns An Optional containing the value of the property.
   * @example
   * const some = Optional.Some({ name: "John", age: 30 });
   * const result = some.property("name");
   * // result === Optional.Some("John")
   *
   * const some = Optional.Some({ name: "John", age: 30 });
   * const result = some.property("nonExistentProperty");
   * // result === Optional.Some(undefinied)
   *
   * const none = Optional.None();
   * const result = none.property("name");
   * // result === Optional.None()
   */
  property(property: IfAny<T, any, never>):                             Optional<any>;
  property<U extends keyof T>(property: U):                             IfAnyOrUnknown<T, Optional, U extends keyof T ? Optional<T[U]> : never>;

  /**
   * Maps the value of the Optional to a new value.
   * @param λ A function that takes the value of the Optional and returns a new value.
   * @returns Either the new value or itself if the Optional is None.
   * @example
   * const some = Optional.Some(5);
   * const result = some.flatMap(x => `Result - ${x}`);
   * // result === "Result - 5"
   *
   * const none = Optional.None();
   * const result = none.flatMap(x => `Result - ${x}`);
   * // result === Optional.None()
   */
  flatMap<U = T>(λ: TransformationFunction<T, U>):                      U | Optional<any>;

  /**
   * Executes a function if the Optional is present.
   * @param λ A function that takes the value of the Optional and executes side effects.
   * @returns The Optional itself.
   * @example
   * const some = Optional.Some(5);
   * const result = some.tap(x => console.log(x)); // logs: 5
   * // result === Optional.Some(5)
   *
   * const none = Optional.None();
   * const result = none.tap(x => console.log(x)); // does not log
   * // result === Optional.None()
   */
  tap(λ: SideEffectsFunction<T>):                                       Optional<T>;

  /**
   * Checks whether the Optional satisfies a predicate.
   * @param λ A function that takes the value of the Optional and returns a boolean.
   * @returns True if the predicate returns true, false otherwise.
   * @example
   * const some = Optional.Some(5);
   * const result = some.satisfies(x => x > 4);
   * // result === true
   *
   * const some = Optional.Some(5);
   * const result = some.satisfies(x => x > 6);
   * // result === false
   *
   * const none = Optional.None();
   * const result = none.satisfies(x => x > 4);
   * // result === false
   */
  satisfies(λ: Predicate<T>):                                           boolean;

  /**
   * Checks whether the Optional's value is equal to another value.
   * @param value The value to compare the Optional's value to.
   * @returns True if the values are equal, false otherwise.
   * @example
   * const some = Optional.Some(5);
   * const result = some.valueEquals(5);
   * // result === true
   *
   * const some = Optional.Some(5);
   * const result = some.valueEquals("some string");
   * // result === false
   *
   * const none = Optional.None();
   * const result = none.valueEquals(5);
   * // result === false
   */
  valueEquals<U = T>(value: U):                                         boolean;

  /**
   * Checks whether the Optional's value passes a predicate.
   * @param λ A function that takes the value of the Optional and returns a boolean.
   * @see {@link reject} for the opposite of this method.
   * @returns Itself if the predicate returns true, `Optional.None()` otherwise.
   * @example
   * const some = Optional.Some(5);
   * const result = some.filter(x => x > 4);
   * // result === Optional.Some(5)
   *
   * const some = Optional.Some(5);
   * const result = some.filter(x => x > 6);
   * // result === Optional.None()
   *
   * const none = Optional.None();
   * const result = none.filter(x => x > 4);
   * // result === Optional.None()
   */
  filter(λ: Predicate<T>):                                              Optional<T>;

  /**
   * Checks whether the Optional's value fails a predicate.
   * @param λ A function that takes the value of the Optional and returns a boolean.
   * @see {@link filter} for the opposite of this method.
   * @returns Itself if the predicate returns false, `Optional.None()` otherwise.
   * @example
   * const some = Optional.Some(5);
   * const result = some.reject(x => x > 4);
   * // result === Optional.None()
   *
   * const some = Optional.Some(5);
   * const result = some.reject(x => x > 6);
   * // result === Optional.Some(5)
   *
   * const none = Optional.None();
   * const result = none.reject(x => x > 4);
   * // result === Optional.None()
   */
  reject(λ: Predicate<T>):                                              Optional<T>;

  /**
   * Get the value or throw.
   * @param message The message to throw if the Optional is None.
   * @returns The value of the Optional.
   * @throws If the Optional is None.
   * @example
   * const some = Optional.Some(5);
   * const result = some.get();
   * // result === 5
   *
   * const none = Optional.None();
   * const result = none.get("No value present");
   * // throws: "No value present"
   */
  get(message?: string):                                                T;

  /**
   * Get the value or return a default value.
   * @param replacement The value to return if the Optional is None.
   * @returns The value of the Optional or the default value.
   * @example
   * const some = Optional.Some(10);
   * const result = some.getOrElse(5);
   * // result === 10
   *
   * const none = Optional.None();
   * const result = none.getOrElse(5);
   * // result === 5
   */
  getOrElse<U = T>(replacement?: U):                                    T | U;

  /**
   * Recovers from a None Optional.
   * @param λ A function that takes the value of the Optional and returns a new value.
   * @returns Itself if the Optional is Some, a new Optional with the result of the function otherwise.
   * @example
   * const some = Optional.Some(10);
   * const result = some.recover(() => 5);
   * // result === Optional.Some(10)
   *
   * const none = Optional.None();
   * const result = none.recover(() => 5);
   * // result === Optional.Some(5)
   */
  recover<U = T>(λ: NullaryValueFactory<U>):                            Optional<U>;

  /**
   * Replace the value of the Optional.
   * @param value The value to replace the Optional's value with.
   * @note This method does not recover from a None Optional.
   * @returns A new Optional with the new value.
   * @example
   * const some = Optional.Some(10);
   * const result = some.replace(5);
   * // result === Optional.Some(5)
   *
   * const none = Optional.None();
   * const result = none.replace(5);
   * // result === Optional.None()
   */
  replace<U = T>(value: U):                                             Optional<U>;
}

export type CreateSomeFunc = <T>(value?: T) => Optional<T>;
export type CreateNoneFunc = () => Optional;
