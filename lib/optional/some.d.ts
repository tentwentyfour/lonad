import { Optional } from '../generated/optional.generated';
import { IOptionalMatchClauses, NullableTransformationFunction, Predicate, SideEffectsFunction, SomeType, TransformationFunction } from '../optional.types';
export declare class SomeClass<T> extends Optional<T> implements SomeType<T> {
    valuePresent: true;
    valueAbsent: false;
    value: T;
    constructor(someValue?: T);
    nullableMap<U>(λ: NullableTransformationFunction<T, U>): Optional<U>;
    match<U, V>(clauses: IOptionalMatchClauses<T, U, V>): U | V;
    transform<U>(λ: TransformationFunction<T, U>): Optional<U>;
    map<U>(λ: TransformationFunction<T, U>): Optional<U>;
    optionalProperty(property: string | symbol | number): any;
    nullableProperty(property: string | symbol | number): any;
    flatMap<U>(λ: TransformationFunction<T, U>): U;
    tap(λ: SideEffectsFunction<T>): Optional<T>;
    property(property: string | symbol | number): any;
    satisfies(λ: Predicate<T>): boolean;
    valueEquals(value: T): boolean;
    valueEquals<U>(value: U): boolean;
    filter(λ: Predicate<T>): Optional<T>;
    reject(λ: Predicate<T>): Optional<T>;
    get(): T;
    getOrElse(replacement?: any): any;
    replace<U>(value: U): Optional<U>;
}
