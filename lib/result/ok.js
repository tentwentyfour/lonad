import { identity, constant } from '../utils/utils';
import { Optional } from '../optional/index';
import { Result } from '../generated/result.generated';
import { SyncResult } from '../generated/syncResult.generated';
import { expect, TransformResult } from './result.utils';
export class OkClass extends SyncResult {
    constructor(someValue) {
        super();
        this.isOk = true;
        this.value = someValue;
    }
    get() {
        return this.value;
    }
    getOrElse() {
        return this.value;
    }
    replace(value) {
        return TransformResult(constant(value), Result.Ok);
    }
    expectProperty(propertyName) {
        return expect(this.value[propertyName]);
    }
    property(propertyName) {
        return Result.Ok(this.value[propertyName]);
    }
    tap(λ) {
        return TransformResult(() => λ(this.value), constant(this));
    }
    satisfies(predicate) {
        return TransformResult(() => predicate(this.value), Boolean);
    }
    valueEquals(value) {
        return this.value === value;
    }
    map(λ) {
        return TransformResult(() => λ(this.value), Result.Ok);
    }
    transform(λ) {
        return this.map(λ);
    }
    expectMap(λ) {
        return expect(λ(this.value));
    }
    flatMap(λ) {
        return TransformResult(() => λ(this.value), expect);
    }
    merge() {
        return this.value;
    }
    reject(predicate) {
        return TransformResult(() => predicate(this.value), (isTruthy) => (isTruthy
            ? Result.Error()
            : Result.Ok(this.value)));
    }
    filter(predicate) {
        return TransformResult(() => predicate(this.value), (isTruthy) => (isTruthy
            ? Result.Ok(this.value)
            : Result.Error()));
    }
    match(callbacks) {
        return (callbacks.Ok || identity)(this.value);
    }
    asynchronous() {
        return Result.Pending(Promise.resolve(this));
    }
    toPromise() {
        return Promise.resolve(this.value);
    }
    toOptional() {
        return Optional.Some(this.value);
    }
}
