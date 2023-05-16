import { Result } from './result.generated';
/**
 * A result that can be awaited.
 * Contrary to the SyncResult, this result object contains
 * a promise that can be awaited. When used, the entire current
 * chain of result will be converted to AsyncResult.
 * @template T The type of the value of the result
 * @see {@link SyncResult} for a synchronous version of this class
 * @see {@link Result} for a result that can be both asynchronous and synchronous
 * @example
 * const result = Result
 *  .expect(Promise.resolve('hello world'))
 *  .toPromise();
 *
 * const value = await result; // 'hello world'
 */
export class AsyncResult extends Result {
}
