/* eslint-disable no-plusplus */
import { FirstElementOfArray, LastElementOfArray } from './types';

/**
 * PIPE UTIL
 *
 * This is a utility function that allows you to pipe functions together.
 *
 * @see https://github.com/lodash/lodash/blob/master/flow.js
 * @copyright lodash (https://github.com/lodash/lodash/)
 *
 * @note Created to replace lodash.flow dependency.
 */
export default function pipe<T extends ((...args:any[]) => any)[]>(...functions: T)
// @ts-ignore ignore return type inference
: (...args: Parameters<FirstElementOfArray<T>>) => ReturnType<LastElementOfArray<T>>
{
  const length = functions.length
  let index = length
  while (index--) {
    if (typeof functions[index] !== 'function') {
      throw new TypeError('Expected a function')
    }
  }

  return function(...args) {
    let index = 0
    // @ts-ignore ignore 'this' type
    let result = length ? functions[index].apply(this, args) : args[0]
    while (++index < length) {
      // @ts-ignore ignore 'this' type
      result = functions[index].call(this, result)
    }
    return result
  }
}
