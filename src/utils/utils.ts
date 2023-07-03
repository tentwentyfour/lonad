import Exception from './exception';
import { isDefined, isFunction } from './conditional';
import pipe from './pipe';

export const identity = <T>(x: T) => x;
export const constant = <T>(x: T) => () => x;
export const property = <T>(propertyName: keyof T) => (object: T) => object[propertyName];

/**
 * Asserts that the given value is defined.
 * @param value The value to check
 * @param message The error message to throw if the value is not defined
 * @throws Error if the value is not defined
 */
export function assertIsDefined<T = any>(value: T, message?: string): asserts value is NonNullable<T> {
  if (!isDefined(value)) {
    throw new Exception(message ?? 'Value is not defined');
  }
}

/**
 * Asserts that the given value is a function.
 * @param value The value to check
 * @param message  The error message to throw if the value is not a function
 */
export function assertIsFunction<T = any>(value: T, message?: string): asserts value is T {
  if (!isFunction(value)) {
    throw new Exception(message ?? 'Value is not a function');
  }
}

export { pipe };
