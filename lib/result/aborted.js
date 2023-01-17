import throwArgument from '../utils/throw-argument';
import { Optional } from '../optional/index';
import { Result } from '../generated/result.generated';
import { SyncResult } from '../generated/syncResult.generated';
import { TransformResult } from './result.utils';
import { constant } from '../utils/utils';
export class AbortedClass extends SyncResult {
    constructor(error) {
        super();
        this.isError = true;
        this.isAborted = true;
        this.error = error;
    }
    tapError(λ) {
        return TransformResult(() => λ(this.error), constant(this));
    }
    get() {
        throw this.error;
    }
    getOrElse(value) {
        return value;
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
        return (callbacks.Aborted || throwArgument)(this.error);
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
