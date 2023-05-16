import { Optional } from '../optional/index';
import { IResultCallbacks } from '../result.types';
import { SyncResult } from '../generated/syncResult.generated';
export declare class ErrorClass extends SyncResult<any> {
    isError: true;
    error: any;
    constructor(error: any);
    get(): any;
    getOrElse(value: any): any;
    recover(λ: any): any;
    recoverWhen(predicate: any, λ: any): any;
    satisfies(): any;
    valueEquals(): boolean;
    merge(): any;
    match(callbacks: IResultCallbacks<any, any>): any;
    tapError(λ: (x: any) => void): any;
    mapError(λ: (x: any) => any): any;
    abortOnError(): any;
    abortOnErrorWith(λOrValue?: any): any;
    asynchronous(): any;
    toPromise(): Promise<any>;
    toOptional(): Optional<any>;
}
