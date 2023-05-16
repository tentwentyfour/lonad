import { Optional } from '../generated/optional.generated';
import { IOptionalMatchClauses, NoneType, NullaryValueFactory, Predicate } from '../optional.types';
export declare class NoneClass extends Optional<any> implements NoneType {
    valueAbsent: true;
    valuePresent: false;
    constructor();
    or<U>(replacement: (() => Optional<U>) | Optional<U>): Optional<U>;
    match<U, V>(clauses: IOptionalMatchClauses<any, U, V>): U | V;
    satisfies(λ: Predicate<any>): boolean;
    valueEquals(): boolean;
    get(message?: string): never;
    getOrElse<U>(replacement?: U): U;
    recover<U>(λ: NullaryValueFactory<U>): Optional<U>;
}
