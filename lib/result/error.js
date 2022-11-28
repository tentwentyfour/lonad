import throwArgument from '../utils/throw-argument';
import { constant } from '../utils/utils';
import { Optional } from '../optional/index';
import { Result } from '../generated/result.generated';
import { SyncResult } from '../generated/syncResult.generated';
import { TransformResult } from './result.utils';
export class ErrorClass extends SyncResult {
    constructor(error) {
        super();
        this.isError = true;
        this.error = error;
    }
    get() {
        throw this.error;
    }
    getOrElse(value) {
        return value;
    }
    recover(λ) {
        return TransformResult(() => λ(this.error), Result.Ok);
    }
    recoverWhen(predicate, λ) {
        return Result.Ok(this.error)
            .filter(predicate)
            .mapError(constant(this.error))
            .map(λ);
    }
    satisfies() {
        return false;
    }
    valueEquals() {
        return false;
    }
    merge() {
        return this.error;
    }
    match(callbacks) {
        return (callbacks.Error || throwArgument)(this.error);
    }
    tapError(λ) {
        return TransformResult(() => λ(this.error), constant(this));
    }
    mapError(λ) {
        return TransformResult(() => λ(this.error), Result.Error);
    }
    abortOnError() {
        return Result.Aborted(this.error);
    }
    abortOnErrorWith(λOrValue) {
        return TransformResult(() => {
            if (typeof λOrValue === 'function') {
                return λOrValue(this.error);
            }
            return λOrValue;
        }, Result.Aborted);
    }
    asynchronous() {
        return Result.Pending(Promise.resolve(this));
    }
    toPromise() {
        return Promise.reject(this.error);
    }
    toOptional() {
        return Optional.None();
    }
}
