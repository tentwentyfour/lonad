/**
 * Checks if the given value is an object.
 * @param value The value to check
 * @returns True if the value is an object; false otherwise.
 */
export function isObject(value) {
    return typeof value === 'object' && value !== null;
}
/**
 * Checks if the given value is defined.
 * @param value The value to check
 * @returns True if the value is defined; false otherwise.
 */
export function isDefined(value) {
    return value !== undefined;
}
/**
 * Checks if the given value is null.
 * @param value The value to check
 * @returns True if the value is null; false otherwise.
 */
export function isNotNull(value) {
    return value !== null;
}
/**
 * Checks if the given value is not null or undefined.
 * @param value The value to check
 * @returns True if the value is not null or undefined; false otherwise.
 */
export function isNotNullOrUndefined(value) {
    return isNotNull(value) && isDefined(value);
}
/**
 * Checks if the given object is a Promise.
 * @param object The object to check
 * @returns True if the object is a Promise; false otherwise.
 */
export function isPromise(object) {
    return Boolean(object && object.then);
}
/**
 * Checks if the given value is a function.
 * @param value The value to check
 * @returns True if the value is a function; false otherwise.
 */
export function isFunction(value) {
    return typeof value === 'function';
}
