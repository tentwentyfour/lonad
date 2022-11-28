import { Optional } from '../optional/index';
import { IResultCallbacks } from '../result.types';
import { SyncResult } from '../generated/syncResult.generated';
export declare class OkClass<T> extends SyncResult<T> {
    isOk: true;
    value: T;
    constructor(someValue?: T);
    get(): T;
    getOrElse<Y>(): T | Y;
    replace(value: any): any;
    expectProperty(propertyName: string): any;
    property(propertyName: string): any;
    tap(λ: (x: T) => void): any;
    satisfies(predicate: (x: T) => any): any;
    valueEquals(value: T): boolean;
    map(λ: (x: T) => any): any;
    transform(λ: (x: T) => any): any;
    expectMap(λ: (x: T) => any): any;
    flatMap(λ: (x: T) => any): any;
    merge(): T;
    reject(predicate: (x: T) => any): any;
    filter(predicate: (x: T) => any): any;
    match(callbacks: IResultCallbacks<any, any>): any;
    asynchronous(): any;
    toPromise(): Promise<T>;
    toOptional(): Optional<T>;
}
