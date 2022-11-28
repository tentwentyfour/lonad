import { Optional } from '../generated/optional.generated';
import throwArgument from '../utils/throw-argument';
import { isFunction } from '../utils/conditional';
export class NoneClass extends Optional {
    constructor() {
        super();
        this.valueAbsent = true;
        this.valuePresent = false;
    }
    or(replacement) {
        return (isFunction(replacement))
            ? replacement()
            : replacement;
    }
    match(clauses) {
        return (clauses.None || throwArgument)(undefined);
    }
    satisfies(λ) {
        return false;
    }
    valueEquals() {
        return false;
    }
    get(message) {
        throw new Error(message || 'Cannot unwrap None instances');
    }
    getOrElse(replacement) {
        return replacement;
    }
    recover(λ) {
        return Optional.Some(λ());
    }
}
