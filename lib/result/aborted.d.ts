import { Optional } from '../optional/index';
import { IResultCallbacks } from '../result.types';
import { SyncResult } from '../generated/syncResult.generated';
export declare class AbortedClass extends SyncResult<any> {
    isError: true;
    isAborted: true;
    error: any;
    constructor(error: any);
    tapError(λ: any): any;
    get(): any;
    getOrElse(value: any): any;
    satisfies(): any;
    valueEquals(): boolean;
    merge(): any;
    match(callbacks: IResultCallbacks<any, any>): any;
    asynchronous(): any;
    toPromise(): Promise<any>;
    toOptional(): Optional<any>;
}
