import pipe from 'lodash.flow';
import Exception from './exception';
import { isDefined, isFunction } from './conditional';
export const identity = (x) => x;
export const constant = (x) => () => x;
export const property = (propertyName) => (object) => object[propertyName];
/**
 * Asserts that the given value is defined.
 * @param value The value to check
 * @param message The error message to throw if the value is not defined
 * @throws Error if the value is not defined
 */
export function assertIsDefined(value, message) {
    if (!isDefined(value)) {
        throw new Exception(message !== null && message !== void 0 ? message : 'Value is not defined');
    }
}
/**
 * Asserts that the given value is a function.
 * @param value The value to check
 * @param message  The error message to throw if the value is not a function
 */
export function assertIsFunction(value, message) {
    if (!isFunction(value)) {
        throw new Exception(message !== null && message !== void 0 ? message : 'Value is not a function');
    }
}
export { pipe };
