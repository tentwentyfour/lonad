var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import returnThis from '../utils/return-this';
import Exception from '../utils/exception';
import { pipe, property } from '../utils/utils';
import { Result } from '../generated/result.generated';
import { AsyncResult } from '../generated/asyncResult.generated';
import { isAsyncResult } from './result.utils';
export class PendingClass extends AsyncResult {
    constructor(promise) {
        super();
        this.isAsynchronous = true;
        this.promise = PendingClass.FindNextNonPending(promise);
        this.makePropertyNonEnumerable('isOk');
        this.makePropertyNonEnumerable('isError');
        this.makePropertyNonEnumerable('isAborted');
    }
    get() {
        return this.toPromise();
    }
    getOrElse(value) {
        return pipe(this.callWrappedResultMethod('getOrElse'), property('promise'))(value);
    }
    recover(λ) {
        return this.callWrappedResultMethod('recover')(λ);
    }
    replace(value) {
        return this.callWrappedResultMethod('replace')(value);
    }
    expectProperty(propertyName) {
        return this.callWrappedResultMethod('expectProperty')(propertyName);
    }
    property(propertyName) {
        return this.callWrappedResultMethod('property')(propertyName);
    }
    tap(λ) {
        return this.callWrappedResultMethod('tap')(λ);
    }
    satisfies(predicate) {
        return pipe(this.callWrappedResultMethod('satisfies'), property('promise'))(predicate);
    }
    valueEquals(value) {
        return pipe(this.callWrappedResultMethod('valueEquals'), property('promise'))(value);
    }
    map(λ) {
        return this.callWrappedResultMethod('map')(λ);
    }
    transform(λ) {
        return this.map(λ);
    }
    expectMap(λ) {
        return this.callWrappedResultMethod('expectMap')(λ);
    }
    flatMap(λ) {
        return this.callWrappedResultMethod('flatMap')(λ);
    }
    merge() {
        return pipe(this.callWrappedResultMethod('merge'), property('promise'))();
    }
    reject(predicate) {
        return this.callWrappedResultMethod('reject')(predicate);
    }
    filter(predicate) {
        return this.callWrappedResultMethod('filter')(predicate);
    }
    match(callbacks) {
        return pipe(this.callWrappedResultMethod('match'), property('promise'))(callbacks);
    }
    abortOnErrorWith(λOrValue) {
        return this.callWrappedResultMethod('abortOnErrorWith')(λOrValue);
    }
    tapError(λ) {
        return this.callWrappedResultMethod('tapError')(λ);
    }
    mapError(λ) {
        return this.callWrappedResultMethod('mapError')(λ);
    }
    recoverWhen(predicate, λ) {
        return this.callWrappedResultMethod('recoverWhen')(predicate, λ);
    }
    abortOnError() {
        return this.callWrappedResultMethod('abortOnError')();
    }
    asynchronous() {
        return returnThis.nullary.call(this);
    }
    toPromise() {
        return this.promise.then(Result.toPromise);
    }
    toOptional() {
        return pipe(this.callWrappedResultMethod('toOptional'), property('promise'))();
    }
    /**
     * Calls a method on the wrapped result.
     * if the promise is rejected, the result will be aborted.
     * @param methodName The name of the method to call on the wrapped result
     * @returns A function that calls the method on the wrapped result
     * @example
     * const pending = Result.Pending(Result.Ok(1));
     * const method = pending.callWrappedResultMethod('get'); // Returns a function that calls Result.Ok(1).get()
     * const result = method(); // Returns 1
     */
    callWrappedResultMethod(methodName) {
        return (...parameters) => Result.Pending(this
            .promise
            .then(Result[methodName](...parameters))
            .catch(Result.Aborted));
    }
    ;
    /**
     * Makes a property non enumerable
     * @param propertyName The name of the property to make non enumerable
     * @throws {Exception} If the property is accessed
     */
    makePropertyNonEnumerable(propertyName) {
        Object.defineProperty(this, propertyName, {
            enumerable: false,
            get: () => {
                throw new Exception(`Cannot access '${propertyName}' of Result.Pending`);
            },
        });
    }
    /**
     * Finds the next non-pending result in a promise chain
     * @param promise The promise to unwrap
     * @returns The unwrapped promise
     * @example
     * const pending = Result.Pending(
     *  Result.Pending(
     *    Promise.resolve(
     *      'Hello World'
     *    )
     *  )
     * );
     * const result = await FindNextNonPending(pending.promise); // Returns 'Hello World'
     */
    static FindNextNonPending(promise) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield promise;
            if (isAsyncResult(result) && result instanceof PendingClass) {
                return PendingClass.FindNextNonPending(result.promise);
            }
            return result;
        });
    }
}
