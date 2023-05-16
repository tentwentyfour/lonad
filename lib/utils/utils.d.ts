import pipe from 'lodash.flow';
export declare const identity: <T>(x: T) => T;
export declare const constant: <T>(x: T) => () => T;
export declare const property: <T>(propertyName: keyof T) => (object: T) => T[keyof T];
/**
 * Asserts that the given value is defined.
 * @param value The value to check
 * @param message The error message to throw if the value is not defined
 * @throws Error if the value is not defined
 */
export declare function assertIsDefined<T = any>(value: T, message?: string): asserts value is NonNullable<T>;
/**
 * Asserts that the given value is a function.
 * @param value The value to check
 * @param message  The error message to throw if the value is not a function
 */
export declare function assertIsFunction<T = any>(value: T, message?: string): asserts value is T;
export { pipe };
