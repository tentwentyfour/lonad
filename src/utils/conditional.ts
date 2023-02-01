/**
 * Checks if the given value is an object.
 * @param value The value to check
 * @returns True if the value is an object; false otherwise.
 */
export function isObject(value: any): value is Record<string | number | symbol, any> {
  return typeof value === 'object' && value !== null;
}

/**
 * Checks if the given value is defined.
 * @param value The value to check
 * @returns True if the value is defined; false otherwise.
 */
export function isDefined<T = any>(value: any): value is T {
  return value !== undefined;
}

/**
 * Checks if the given value is null.
 * @param value The value to check
 * @returns True if the value is null; false otherwise.
 */
export function isNotNull<T = any>(value: any): value is T {
  return value !== null;
}

/**
 * Checks if the given value is not null or undefined.
 * @param value The value to check
 * @returns True if the value is not null or undefined; false otherwise.
 */
export function isNotNullOrUndefined<T = any>(value: any): value is T {
  return isNotNull(value) && isDefined(value);
}

/**
 * Checks if the given object is a Promise.
 * @param object The object to check
 * @returns True if the object is a Promise; false otherwise.
 */
export function isPromise<T = any>(object: any): object is Promise<T> {
  return Boolean(object && object.then);
}

/**
 * Checks if the given value is a function.
 * @param value The value to check
 * @returns True if the value is a function; false otherwise.
 */
export function isFunction<T = any>(value: any): value is (...args: any[]) => any {
  return typeof value === 'function';
}
