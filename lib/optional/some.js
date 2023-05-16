import { Optional } from '../generated/optional.generated';
import { identity } from '../utils/utils';
import { isObject } from '../utils/conditional';
export class SomeClass extends Optional {
    constructor(someValue) {
        super();
        this.valuePresent = true;
        this.valueAbsent = false;
        this.value = someValue;
    }
    nullableMap(λ) {
        return Optional.fromNullable(λ(this.value));
    }
    match(clauses) {
        return (clauses.Some || identity)(this.value);
    }
    transform(λ) {
        return this.map(λ);
    }
    map(λ) {
        return Optional.Some(λ(this.value));
    }
    optionalProperty(property) {
        return isObject(this.value) ? this.value[property] : undefined;
    }
    nullableProperty(property) {
        return Optional.fromNullable(isObject(this.value) ? this.value[property] : undefined);
    }
    flatMap(λ) {
        return λ(this.value);
    }
    tap(λ) {
        λ(this.value);
        return this;
    }
    property(property) {
        return Optional.Some(isObject(this.value) ? this.value[property] : undefined);
    }
    satisfies(λ) {
        return Boolean(λ(this.value));
    }
    valueEquals(value) {
        return this.value === value;
    }
    filter(λ) {
        return λ(this.value) ? this : Optional.None();
    }
    reject(λ) {
        return !λ(this.value) ? this : Optional.None();
    }
    get() {
        return this.value;
    }
    getOrElse(replacement) {
        return this.value;
    }
    replace(value) {
        return Optional.Some(value);
    }
}
