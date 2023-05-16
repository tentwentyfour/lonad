import { Result } from './result.generated';
import returnThis from '../utils/return-this';
/**
 * A result that is not awaitable.
 * Contrary to the AsyncResult, this result object does not contain
 * a promise that can be awaited.
 * @template T The type of the value of the result
 * @see {@link AsyncResult} for an awaitable result
 * @see {@link Result} for a result that can be both asynchronous and synchronous
 * @example
 * const result = Result
 *  .expect('hello world');
 *
 * const value = result.get(); // 'hello world'
 */
export class SyncResult extends Result {
    get(...args) {
        return returnThis.any.call(this, ...args);
    }
    getOrElse(...args) {
        return returnThis.any.call(this, ...args);
    }
    recover(...args) {
        return returnThis.any.call(this, ...args);
    }
    replace(...args) {
        return returnThis.any.call(this, ...args);
    }
    expectProperty(...args) {
        return returnThis.any.call(this, ...args);
    }
    property(...args) {
        return returnThis.any.call(this, ...args);
    }
    tap(...args) {
        return returnThis.any.call(this, ...args);
    }
    satisfies(...args) {
        return returnThis.any.call(this, ...args);
    }
    valueEquals(...args) {
        return returnThis.any.call(this, ...args);
    }
    map(...args) {
        return returnThis.any.call(this, ...args);
    }
    transform(...args) {
        return returnThis.any.call(this, ...args);
    }
    expectMap(...args) {
        return returnThis.any.call(this, ...args);
    }
    flatMap(...args) {
        return returnThis.any.call(this, ...args);
    }
    merge(...args) {
        return returnThis.any.call(this, ...args);
    }
    reject(...args) {
        return returnThis.any.call(this, ...args);
    }
    filter(...args) {
        return returnThis.any.call(this, ...args);
    }
    match(...args) {
        return returnThis.any.call(this, ...args);
    }
    abortOnErrorWith(...args) {
        return returnThis.any.call(this, ...args);
    }
    tapError(...args) {
        return returnThis.any.call(this, ...args);
    }
    mapError(...args) {
        return returnThis.any.call(this, ...args);
    }
    recoverWhen(...args) {
        return returnThis.any.call(this, ...args);
    }
    abortOnError(...args) {
        return returnThis.any.call(this, ...args);
    }
    asynchronous(...args) {
        return returnThis.any.call(this, ...args);
    }
    toPromise(...args) {
        return returnThis.any.call(this, ...args);
    }
    toOptional(...args) {
        return returnThis.any.call(this, ...args);
    }
}
