import { Optional } from '../generated/optional.generated';
import { IParsedOptional } from '../optional.types';
/**
 * Wraps a given value in an Optional
 * @param value The value to wrap in an Optional
 * @returns An Optional containing the value
 * @example
 * const optional = Optional.fromNullable(1);
 * // optional === Optional.Some(1)
 *
 * const optional = Optional.fromNullable(null);
 * // optional === Optional.None()
 */
export declare function fromNullable<T>(value?: T): Optional<T>;
/**
 * Converts a parsed object to an Optional
 * @param object The parsed object to convert to an Optional
 * @returns An Optional based on the object
 * @throws Error if the object is not an Optional
 * @example
 * const someObject = { isOptionalInstance: true, valuePresent: true, value: 1 };
 * const noneObject = { isOptionalInstance: true, valueAbsent: true };
 * const notOptionalObject = { val: 88 };
 *
 * const optional = Optional.fromParsedJson(someObject);
 * // optional === Optional.Some(1)
 *
 * const optional = Optional.fromParsedJson(noneObject);
 * // optional === Optional.None()
 *
 * const optional = Optional.fromParsedJson(notOptionalObject);
 * // throws Error
 */
export declare function fromParsedJson<T>(object: IParsedOptional<T>): Optional<T>;
/**
 * Checks if all the given optionals have a value.
 * @param optionals The optionals to combine
 * @returns An optional containing an array of the values of the optionals
 * @example
 * const optional1 = Optional.Some(1);
 * const optional2 = Optional.Some(2);
 * const optional3 = Optional.Some(3);
 * const optional4 = Optional.None();
 *
 * const optional = Optional.all([optional1, optional2, optional3]);
 * // optional === Optional.Some([1, 2, 3])
 *
 * const optional = Optional.all([optional1, optional2, optional3, optional4]);
 * // optional === Optional.None()
 */
export declare function all(optionals: Optional<any>[]): Optional<any[]>;
/**
 * Function that returns an optional based on a truthy check
 * @param truthy The condition to test
 * @param value The value to wrap in an Optional
 * @returns An Optional containing the value if the condition is truthy, otherwise an empty Optional
 * @example
 * const optional = Optional.when(true, 1);
 * // optional === Optional.Some(1)
 *
 * const optional = Optional.when(false, 1);
 * // optional === Optional.None()
 */
export declare function when<T>(truthy: any, value?: T): Optional<T>;
/**
 * Retrieves the first optional that has a value.
 * @param optionals The optionals to get the first value from
 * @returns The first optional that has a value, otherwise a none optional
 * @example
 * const optional1 = Optional.None();
 * const optional2 = Optional.Some(1);
 * const optional3 = Optional.None();
 * const optional4 = Optional.Some(3);
 *
 * const optional = Optional.first([optional1, optional2, optional3, optional4]);
 * // optional === Optional.Some(1)
 */
export declare function first(optionals: Optional<any>[]): Optional<any>;
/**
 * Combines the values of the given optionals into an array.
 * Ignores optionals that do not have a value.
 * @param optionals The optionals to combine
 * @returns An optional containing an array of the values of the optionals
 * @example
 * const optional1 = Optional.Some(1);
 * const optional2 = Optional.Some(2);
 * const optional3 = Optional.Some(3);
 * const optional4 = Optional.None();
 *
 * const optional = Optional.values([optional1, optional2, optional3, optional4]);
 * // optional === Optional.Some([1, 2, 3])
 */
export declare function values(optionals: Optional<any>[]): Optional<any[]>;
/**
 * Checks if the given object is an Optional
 * @param optional The optional to check
 * @returns True if the given object is an Optional, otherwise false
 */
export declare function isOptional<T = any>(optional: any): optional is Optional<T>;
/**
 * Checks if the given object is an Optional and has a value
 * @param optional The optional to check
 * @returns True if the given object is an Optional and has a value, otherwise false
 * @example
 * const optional = Optional.Some(1);
 * // isSome(optional) === true
 * // isNone(optional) === false
 *
 * const optional = Optional.None();
 * // isSome(optional) === false
 * // isNone(optional) === true
 */
export declare function isSome<T = any>(optional: any): optional is Optional<T>;
/**
 * Checks if the given object is an Optional and does not have a value
 * @param optional The optional to check
 * @returns True if the given object is an Optional and does not have a value, otherwise false
 * @example
 * const optional = Optional.Some(1);
 * // isSome(optional) === true
 * // isNone(optional) === false
 *
 * const optional = Optional.None();
 * // isSome(optional) === false
 * // isNone(optional) === true
 */
export declare function isNone(optional: any): optional is Optional<any>;
