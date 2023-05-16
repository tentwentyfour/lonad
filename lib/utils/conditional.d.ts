/**
 * Checks if the given value is an object.
 * @param value The value to check
 * @returns True if the value is an object; false otherwise.
 */
export declare function isObject(value: any): value is Record<string | number | symbol, any>;
/**
 * Checks if the given value is defined.
 * @param value The value to check
 * @returns True if the value is defined; false otherwise.
 */
export declare function isDefined<T = any>(value: any): value is T;
/**
 * Checks if the given value is null.
 * @param value The value to check
 * @returns True if the value is null; false otherwise.
 */
export declare function isNotNull<T = any>(value: any): value is T;
/**
 * Checks if the given value is not null or undefined.
 * @param value The value to check
 * @returns True if the value is not null or undefined; false otherwise.
 */
export declare function isNotNullOrUndefined<T = any>(value: any): value is T;
/**
 * Checks if the given object is a Promise.
 * @param object The object to check
 * @returns True if the object is a Promise; false otherwise.
 */
export declare function isPromise<T = any>(object: any): object is Promise<T>;
/**
 * Checks if the given value is a function.
 * @param value The value to check
 * @returns True if the value is a function; false otherwise.
 */
export declare function isFunction<T = any>(value: any): value is (...args: any[]) => any;
