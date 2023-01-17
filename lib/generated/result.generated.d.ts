import { IResult, IResultCallbacks, createOkType, createErrorType, createAbortedType, createPendingType } from '../result.types';
import { doTry, expect, fromPromise, tryAsync, when, isResult, isSyncResult, isAsyncResult } from '../result/result.utils';
import { Optional } from '../optional/index';
import { AsyncResult } from './asyncResult.generated';
import { SyncResult } from './syncResult.generated';
import { IfAnyOrUnknown, IfAny } from '../utils/types';
/**
 * The base class for all results.
 * The Result class is a combination of both the SyncResult
 * and AsyncResult classes. As such it can be used as a base.
 * @example
 * const syncResult = Result.Ok(1); // SyncResult<number>
 * const result = syncResult as Result<number>; // Result<number>
 * const returnedResult = result.get(); // number | Promise<number>
 *
 * // result is now a Result<number> which can be a SyncResult<number> or an
 * //   AsyncResult<number>. It is not known which one it is. Thus when
 * //   calling functions on it, the return type will be a union of both.
 */
export declare abstract class Result<T = any> implements IResult<T> {
    isResultInstance: true;
    isAsynchronous: boolean;
    isOk: boolean;
    isError: boolean;
    isAborted: boolean;
    static Ok: createOkType;
    static Error: createErrorType;
    static Aborted: createAbortedType;
    static Pending: createPendingType;
    static fromPromise: typeof fromPromise;
    static when: typeof when;
    static expect: typeof expect;
    static try: typeof doTry;
    static tryAsync: typeof tryAsync;
    static isResult: typeof isResult;
    static isSyncResult: typeof isSyncResult;
    static isAsyncResult: typeof isAsyncResult;
    /**
       * Returns the value of the result.
   * If the result is not Ok, it will throw an error.
       */
    static get: {
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: AsyncResult<T>): Promise<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: SyncResult<T>): T;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: Result<T>): T | Promise<T>;
    };
    /**
       * Returns the value of the result.
   * If the result is not Ok, it will return the value provided.
       */
    static getOrElse: {
        /**
         * @param value The value to return if the result is not Ok
         */
        <T, Y = T>(value: Y): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): Promise<T> | Promise<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): T | Y;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): T | Promise<T> | Y | Promise<Y>;
        };
        /**
         * @param value The value to return if the result is not Ok
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(value: Y, optional: AsyncResult<T>): Promise<T> | Promise<Y>;
        /**
         * @param value The value to return if the result is not Ok
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(value: Y, optional: SyncResult<T>): T | Y;
        /**
         * @param value The value to return if the result is not Ok
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(value: Y, optional: Result<T>): T | Promise<T> | Y | Promise<Y>;
    };
    /**
       * Recovers from an error if an error occurs.
       */
    static recover: {
        /**
         * @param λ The function to recover with
         */
        <T, R = T>(λ: (x: any) => PromiseLike<R>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): AsyncResult<T | R>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): AsyncResult<T | R>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): AsyncResult<T | R>;
        };
        /**
         * @param λ The function to recover with
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, R = T>(λ: (x: any) => PromiseLike<R>, optional: AsyncResult<T>): AsyncResult<T | R>;
        <T, R = T>(λ: (x: any) => R): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): AsyncResult<T | R>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): Result<T | R>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): SyncResult<T | R>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): Result<T | R>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): any;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): Result<T | R>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, R = T>(λ: (x: any) => R, optional: AsyncResult<T>): AsyncResult<T | R>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, R = T>(λ: (x: any) => R, optional: AsyncResult<T>): Result<T | R>;
        /**
         * @param λ The function to recover with
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, R = T>(λ: (x: any) => PromiseLike<R>, optional: SyncResult<T>): AsyncResult<T | R>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, R = T>(λ: (x: any) => R, optional: SyncResult<T>): SyncResult<T | R>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, R = T>(λ: (x: any) => R, optional: SyncResult<T>): Result<T | R>;
        /**
         * @param λ The function to recover with
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, R = T>(λ: (x: any) => PromiseLike<R>, optional: Result<T>): AsyncResult<T | R>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, R = T>(λ: (x: any) => R, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, R = T>(λ: (x: any) => R, optional: Result<T>): Result<T | R>;
    };
    /**
       * Replace the value of the result.
   * Will only replace the value if the result is Ok.
       */
    static replace: {
        /**
         * @param value The value to replace the result with
         */
        <T, Y = T>(value: PromiseLike<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): AsyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): AsyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): AsyncResult<Y>;
        };
        /**
         * @param value The value to replace the result with
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(value: PromiseLike<Y>, optional: AsyncResult<T>): AsyncResult<Y>;
        <T, Y = T>(value: Y): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): AsyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): SyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): any;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(value: Y, optional: AsyncResult<T>): AsyncResult<Y>;
        <T, Y = T>(value: Y | PromiseLike<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): Result<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): Result<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): Result<Y>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(value: Y | PromiseLike<Y>, optional: AsyncResult<T>): Result<Y>;
        /**
         * @param value The value to replace the result with
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(value: PromiseLike<Y>, optional: SyncResult<T>): AsyncResult<Y>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(value: Y, optional: SyncResult<T>): SyncResult<Y>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(value: Y | PromiseLike<Y>, optional: SyncResult<T>): Result<Y>;
        /**
         * @param value The value to replace the result with
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(value: PromiseLike<Y>, optional: Result<T>): AsyncResult<Y>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(value: Y, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(value: Y | PromiseLike<Y>, optional: Result<T>): Result<Y>;
    };
    /**
       * Returns the wrapped property value if the result contains an object.
   * Will return an Error result if the property was not found.
       */
    static expectProperty: {
        <T>(propertyName: IfAny<T, any, never>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<any>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): Result<any>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): SyncResult<any>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): Result<any>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): any;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): Result<any>;
        };
        /**
         * @param propertyName The name of the property to get
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(propertyName: IfAny<T, any, never>, optional: AsyncResult<T>): AsyncResult<any>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(propertyName: IfAny<T, any, never>, optional: AsyncResult<T>): Result<any>;
        <T, Y extends keyof T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(propertyName: Y): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<V, any, V & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(optional: AsyncResult<T>): Result<IfAnyOrUnknown<V, any, V & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<V, any, V & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(optional: SyncResult<T>): Result<IfAnyOrUnknown<V, any, V & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(optional: Result<T>): any;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(optional: Result<T>): Result<IfAnyOrUnknown<V, any, V & {}>>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y extends keyof T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(propertyName: Y, optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<V, any, V & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y extends keyof T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(propertyName: Y, optional: AsyncResult<T>): Result<IfAnyOrUnknown<V, any, V & {}>>;
        /**
         * @param propertyName The name of the property to get
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(propertyName: IfAny<T, any, never>, optional: SyncResult<T>): SyncResult<any>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(propertyName: IfAny<T, any, never>, optional: SyncResult<T>): Result<any>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y extends keyof T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(propertyName: Y, optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<V, any, V & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y extends keyof T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(propertyName: Y, optional: SyncResult<T>): Result<IfAnyOrUnknown<V, any, V & {}>>;
        /**
         * @param propertyName The name of the property to get
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(propertyName: IfAny<T, any, never>, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(propertyName: IfAny<T, any, never>, optional: Result<T>): Result<any>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y extends keyof T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(propertyName: Y, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y extends keyof T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(propertyName: Y, optional: Result<T>): Result<IfAnyOrUnknown<V, any, V & {}>>;
    };
    /**
       * Returns the wrapped property value if the result contains an object.
   * Will always return an Ok result even if the property was not found.
       */
    static property: {
        <T>(propertyName: IfAny<T, any, never>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<any>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): Result<any>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): SyncResult<any>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): Result<any>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): any;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): Result<any>;
        };
        /**
         * @param propertyName The name of the property to get
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(propertyName: IfAny<T, any, never>, optional: AsyncResult<T>): AsyncResult<any>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(propertyName: IfAny<T, any, never>, optional: AsyncResult<T>): Result<any>;
        <T, Y extends keyof T>(propertyName: Y): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): AsyncResult<Y extends keyof T ? T[Y] : any>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): Result<Y extends keyof T ? T[Y] : any>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): SyncResult<Y extends keyof T ? T[Y] : any>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): Result<Y extends keyof T ? T[Y] : any>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): any;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): Result<Y extends keyof T ? T[Y] : any>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y extends keyof T>(propertyName: Y, optional: AsyncResult<T>): AsyncResult<Y extends keyof T ? T[Y] : any>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y extends keyof T>(propertyName: Y, optional: AsyncResult<T>): Result<Y extends keyof T ? T[Y] : any>;
        /**
         * @param propertyName The name of the property to get
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(propertyName: IfAny<T, any, never>, optional: SyncResult<T>): SyncResult<any>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(propertyName: IfAny<T, any, never>, optional: SyncResult<T>): Result<any>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y extends keyof T>(propertyName: Y, optional: SyncResult<T>): SyncResult<Y extends keyof T ? T[Y] : any>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y extends keyof T>(propertyName: Y, optional: SyncResult<T>): Result<Y extends keyof T ? T[Y] : any>;
        /**
         * @param propertyName The name of the property to get
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(propertyName: IfAny<T, any, never>, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(propertyName: IfAny<T, any, never>, optional: Result<T>): Result<any>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y extends keyof T>(propertyName: Y, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y extends keyof T>(propertyName: Y, optional: Result<T>): Result<Y extends keyof T ? T[Y] : any>;
    };
    /**
       * Tap into the result and perform an action.
   * Will only perform the action if the result is Ok.
       */
    static tap: {
        /**
         * @param λ The action to perform
         */
        <T>(λ: (x: T) => PromiseLike<void>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): AsyncResult<T>;
        };
        /**
         * @param λ The action to perform
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: T) => PromiseLike<void>, optional: AsyncResult<T>): AsyncResult<T>;
        <T>(λ: (x: T) => void): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): SyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): any;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: T) => void, optional: AsyncResult<T>): AsyncResult<T>;
        <T>(λ: (x: T) => void | PromiseLike<void>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): Result<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): Result<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): Result<T>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: T) => void | PromiseLike<void>, optional: AsyncResult<T>): Result<T>;
        /**
         * @param λ The action to perform
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: T) => PromiseLike<void>, optional: SyncResult<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: T) => void, optional: SyncResult<T>): SyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: T) => void | PromiseLike<void>, optional: SyncResult<T>): Result<T>;
        /**
         * @param λ The action to perform
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: T) => PromiseLike<void>, optional: Result<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: T) => void, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: T) => void | PromiseLike<void>, optional: Result<T>): Result<T>;
    };
    /**
       * Test if the result satisfies a predicate.
   * Will only test the predicate if the result is Ok.
       */
    static satisfies: {
        /**
         * @param predicate The predicate to test
         */
        <T>(predicate: (x: T) => PromiseLike<boolean | T>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): Promise<boolean>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): Promise<boolean>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): Promise<boolean>;
        };
        /**
         * @param predicate The predicate to test
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => PromiseLike<boolean | T>, optional: AsyncResult<T>): Promise<boolean>;
        <T>(predicate: (x: T) => boolean | T): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): Promise<boolean>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): boolean;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): boolean | Promise<boolean>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => boolean | T, optional: AsyncResult<T>): Promise<boolean>;
        /**
         * @param predicate The predicate to test
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => PromiseLike<boolean | T>, optional: SyncResult<T>): Promise<boolean>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => boolean | T, optional: SyncResult<T>): boolean;
        /**
         * @param predicate The predicate to test
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => PromiseLike<boolean | T>, optional: Result<T>): Promise<boolean>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => boolean | T, optional: Result<T>): boolean | Promise<boolean>;
    };
    /**
       * Test if the result value equals another value.
   * Will only test the equality if the result is Ok.
       */
    static valueEquals: {
        /**
         * @param value The value to test equality with
         */
        <T>(value: T): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): Promise<boolean>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): boolean;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): boolean | Promise<boolean>;
        };
        /**
         * @param value The value to test equality with
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(value: T, optional: AsyncResult<T>): Promise<boolean>;
        /**
         * @param value The value to test equality with
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(value: T, optional: SyncResult<T>): boolean;
        /**
         * @param value The value to test equality with
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(value: T, optional: Result<T>): boolean | Promise<boolean>;
    };
    /**
       * Map the result value.
   * Will only map the value if the result is Ok.
   * Will always return an Ok result even if the passed value is undefined.
       */
    static map: {
        /**
         * @param λ The function to map the value to
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
        };
        /**
         * @param λ The function to map the value to
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>, optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
        <T, Y = T>(λ: (x: T) => Y): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): any;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y, optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
        <T, Y = T>(λ: (x: T) => Y | PromiseLike<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): Result<IfAnyOrUnknown<Y, any, Y>>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y | PromiseLike<Y>, optional: AsyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y>>;
        /**
         * @param λ The function to map the value to
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>, optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y, optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y | PromiseLike<Y>, optional: SyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y>>;
        /**
         * @param λ The function to map the value to
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>, optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y | PromiseLike<Y>, optional: Result<T>): Result<IfAnyOrUnknown<Y, any, Y>>;
    };
    /**
       * Map the result value.
   * Will only map the value if the result is Ok.
   * Will always return an Ok result even if the passed value is undefined.
       */
    static transform: {
        /**
         * @param λ The function to map the value to
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
        };
        /**
         * @param λ The function to map the value to
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>, optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
        <T, Y = T>(λ: (x: T) => Y): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): any;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y, optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
        <T, Y = T>(λ: (x: T) => Y | PromiseLike<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): Result<IfAnyOrUnknown<Y, any, Y>>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y | PromiseLike<Y>, optional: AsyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y>>;
        /**
         * @param λ The function to map the value to
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>, optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y, optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y | PromiseLike<Y>, optional: SyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y>>;
        /**
         * @param λ The function to map the value to
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>, optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y | PromiseLike<Y>, optional: Result<T>): Result<IfAnyOrUnknown<Y, any, Y>>;
    };
    /**
       * Map the result value.
   * Will only map the value if the result is Ok.
   * Will return an Error result if the passed value is undefined.
       */
    static expectMap: {
        /**
         * @param λ The function to map the value to
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Optional<T>>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        };
        /**
         * @param λ The function to map the value to
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Optional<T>>, optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        <T, Y = T>(λ: (x: T) => Optional<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Optional<Y>, optional: AsyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        <T, Y = T>(λ: (x: T) => AsyncResult<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => AsyncResult<Y>, optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        <T, Y = T>(λ: (x: T) => SyncResult<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => SyncResult<Y>, optional: AsyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        <T, Y = T>(λ: (x: T) => Result<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Result<Y>, optional: AsyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>, optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        <T, Y = T>(λ: (x: T) => Y): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): any;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y, optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        <T, Y = T>(λ: (x: T) => Y | PromiseLike<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y | PromiseLike<Y>, optional: AsyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param λ The function to map the value to
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Optional<T>>, optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Optional<Y>, optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => AsyncResult<Y>, optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => SyncResult<Y>, optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Result<Y>, optional: SyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>, optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y, optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y | PromiseLike<Y>, optional: SyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param λ The function to map the value to
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Optional<T>>, optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Optional<Y>, optional: Result<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => AsyncResult<Y>, optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => SyncResult<Y>, optional: Result<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Result<Y>, optional: Result<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>, optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y | PromiseLike<Y>, optional: Result<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
    };
    /**
       * Map the result value and flatten the result.
   * Will only map the value if the result is Ok.
       */
    static flatMap: {
        /**
         * @param λ The function to flat map the value to
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Optional<Y>>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        };
        /**
         * @param λ The function to flat map the value to
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Optional<Y>>, optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        <T, Y = T>(λ: (x: T) => PromiseLike<Result<Y>>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Result<Y>>, optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>, optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        <T, Y = T>(λ: (x: T) => Optional<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Optional<Y>, optional: AsyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        <T, Y = T>(λ: (x: T) => AsyncResult<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => AsyncResult<Y>, optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        <T, Y = T>(λ: (x: T) => SyncResult<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): any;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => SyncResult<Y>, optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        <T, Y = T>(λ: (x: T) => Result<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Result<Y>, optional: AsyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
        <T, Y = T>(λ: (x: T) => Y): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): any;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y, optional: AsyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        <T, Y = T>(λ: (x: T) => any): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(optional: AsyncResult<T>): Result<Y & {}>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(optional: SyncResult<T>): Result<Y & {}>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): Result<Y & {}>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => any, optional: AsyncResult<T>): Result<Y & {}>;
        /**
         * @param λ The function to flat map the value to
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Optional<Y>>, optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Result<Y>>, optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>, optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Optional<Y>, optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => AsyncResult<Y>, optional: SyncResult<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => SyncResult<Y>, optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Result<Y>, optional: SyncResult<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y, optional: SyncResult<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => any, optional: SyncResult<T>): Result<Y & {}>;
        /**
         * @param λ The function to flat map the value to
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Optional<Y>>, optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Result<Y>>, optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => PromiseLike<Y>, optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Optional<Y>, optional: Result<T>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => AsyncResult<Y>, optional: Result<T>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => SyncResult<Y>, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Result<Y>, optional: Result<T>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => Y, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(λ: (x: T) => any, optional: Result<T>): Result<Y & {}>;
    };
    /**
       * Returns the result value if it is Ok, otherwise returns the error value.
       */
    static merge: {
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: AsyncResult<T>): Promise<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: SyncResult<T>): T;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: Result<T>): T | Promise<T>;
    };
    /**
       * Rejects the result if the predicate returns true.
   * Will only test the predicate if the result is Ok.
       */
    static reject: {
        /**
         * @param predicate The predicate to test
         */
        <T>(predicate: (x: T) => PromiseLike<boolean>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): AsyncResult<T>;
        };
        /**
         * @param predicate The predicate to test
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => PromiseLike<boolean>, optional: AsyncResult<T>): AsyncResult<T>;
        <T>(predicate: (x: T) => boolean): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): SyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): any;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => boolean, optional: AsyncResult<T>): AsyncResult<T>;
        <T>(predicate: (x: T) => boolean | PromiseLike<boolean>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): Result<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): Result<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): Result<T>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => boolean | PromiseLike<boolean>, optional: AsyncResult<T>): Result<T>;
        /**
         * @param predicate The predicate to test
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => PromiseLike<boolean>, optional: SyncResult<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => boolean, optional: SyncResult<T>): SyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => boolean | PromiseLike<boolean>, optional: SyncResult<T>): Result<T>;
        /**
         * @param predicate The predicate to test
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => PromiseLike<boolean>, optional: Result<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => boolean, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => boolean | PromiseLike<boolean>, optional: Result<T>): Result<T>;
    };
    /**
       * Filters the result if the predicate returns true.
   * Will only test the predicate if the result is Ok.
       */
    static filter: {
        /**
         * @param predicate The predicate to test
         */
        <T, O extends T>(predicate: (x: T) => x is O): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<O>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): SyncResult<O>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): any;
        };
        /**
         * @param predicate The predicate to test
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, O extends T>(predicate: (x: T) => x is O, optional: AsyncResult<T>): AsyncResult<O>;
        <T>(predicate: (x: T) => PromiseLike<boolean>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): AsyncResult<T>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => PromiseLike<boolean>, optional: AsyncResult<T>): AsyncResult<T>;
        <T>(predicate: (x: T) => boolean): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): SyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): any;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => boolean, optional: AsyncResult<T>): AsyncResult<T>;
        <T>(predicate: (x: T) => boolean | PromiseLike<boolean>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): Result<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): Result<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): Result<T>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => boolean | PromiseLike<boolean>, optional: AsyncResult<T>): Result<T>;
        /**
         * @param predicate The predicate to test
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, O extends T>(predicate: (x: T) => x is O, optional: SyncResult<T>): SyncResult<O>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => PromiseLike<boolean>, optional: SyncResult<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => boolean, optional: SyncResult<T>): SyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => boolean | PromiseLike<boolean>, optional: SyncResult<T>): Result<T>;
        /**
         * @param predicate The predicate to test
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, O extends T>(predicate: (x: T) => x is O, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => PromiseLike<boolean>, optional: Result<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => boolean, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(predicate: (x: T) => boolean | PromiseLike<boolean>, optional: Result<T>): Result<T>;
    };
    /**
       * Match the result type and return a value.
       */
    static match: {
        /**
         * @param callbacks The callbacks to match
         */
        <T, out_ok = T, out_error = T, out_abort = T>(callbacks: IResultCallbacks<T, out_ok, out_error, out_abort>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): Promise<out_ok | out_error | out_abort>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): out_ok | out_error | out_abort;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): out_ok | out_error | out_abort | Promise<out_ok | out_error | out_abort>;
        };
        /**
         * @param callbacks The callbacks to match
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, out_ok = T, out_error = T, out_abort = T>(callbacks: IResultCallbacks<T, out_ok, out_error, out_abort>, optional: AsyncResult<T>): Promise<out_ok | out_error | out_abort>;
        <T>(callbacks: IResultCallbacks<T, T, T, T>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): any;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): any;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): any;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(callbacks: IResultCallbacks<T, T, T, T>, optional: AsyncResult<T>): any;
        /**
         * @param callbacks The callbacks to match
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, out_ok = T, out_error = T, out_abort = T>(callbacks: IResultCallbacks<T, out_ok, out_error, out_abort>, optional: SyncResult<T>): out_ok | out_error | out_abort;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(callbacks: IResultCallbacks<T, T, T, T>, optional: SyncResult<T>): any;
        /**
         * @param callbacks The callbacks to match
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, out_ok = T, out_error = T, out_abort = T>(callbacks: IResultCallbacks<T, out_ok, out_error, out_abort>, optional: Result<T>): out_ok | out_error | out_abort | Promise<out_ok | out_error | out_abort>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(callbacks: IResultCallbacks<T, T, T, T>, optional: Result<T>): any;
    };
    /**
       * Aborts the excution if the result is an error with an error value.
       */
    static abortOnErrorWith: {
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: AsyncResult<T>): AsyncResult<T>;
        <T, Y = any>(λOrValue: ((error: any) => PromiseLike<any>) | PromiseLike<any>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T, Y = any>(optional: AsyncResult<T>): AsyncResult<T>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = any>(λOrValue: ((error: any) => PromiseLike<any>) | PromiseLike<any>, optional: AsyncResult<T>): AsyncResult<T>;
        <T, Y = any>(λOrValue: Y | ((error: any) => any)): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): Result<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): SyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): Result<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): any;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): Result<T>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = any>(λOrValue: Y | ((error: any) => any), optional: AsyncResult<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = any>(λOrValue: Y | ((error: any) => any), optional: AsyncResult<T>): Result<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: SyncResult<T>): SyncResult<T>;
        <T, Y = any>(λOrValue: PromiseLike<any> | ((error: any) => PromiseLike<any>)): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T, Y = any>(optional: SyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T, Y = any>(optional: Result<T>): AsyncResult<T>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = any>(λOrValue: PromiseLike<any> | ((error: any) => PromiseLike<any>), optional: SyncResult<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = any>(λOrValue: Y | ((error: any) => any), optional: SyncResult<T>): SyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = any>(λOrValue: Y | ((error: any) => any), optional: SyncResult<T>): Result<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = any>(λOrValue: PromiseLike<any> | ((error: any) => PromiseLike<any>), optional: Result<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = any>(λOrValue: Y | ((error: any) => any), optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = any>(λOrValue: Y | ((error: any) => any), optional: Result<T>): Result<T>;
    };
    /**
       * Tap the error value if result is an error.
       */
    static tapError: {
        /**
         * @param λ The function to tap the error value with
         */
        <T>(λ: (x: any) => PromiseLike<void>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): AsyncResult<T>;
        };
        /**
         * @param λ The function to tap the error value with
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => PromiseLike<void>, optional: AsyncResult<T>): AsyncResult<T>;
        <T>(λ: (x: any) => void): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): SyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): any;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => void, optional: AsyncResult<T>): AsyncResult<T>;
        <T>(λ: (x: any) => void | PromiseLike<void>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): Result<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): Result<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): Result<T>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => void | PromiseLike<void>, optional: AsyncResult<T>): Result<T>;
        /**
         * @param λ The function to tap the error value with
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => PromiseLike<void>, optional: SyncResult<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => void, optional: SyncResult<T>): SyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => void | PromiseLike<void>, optional: SyncResult<T>): Result<T>;
        /**
         * @param λ The function to tap the error value with
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => PromiseLike<void>, optional: Result<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => void, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => void | PromiseLike<void>, optional: Result<T>): Result<T>;
    };
    /**
       * Map the error value if result is an error.
       */
    static mapError: {
        /**
         * @param λ The function to map the error value to
         */
        <T>(λ: (x: any) => PromiseLike<any>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): AsyncResult<T>;
        };
        /**
         * @param λ The function to map the error value to
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => PromiseLike<any>, optional: AsyncResult<T>): AsyncResult<T>;
        <T>(λ: (x: any) => any): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): AsyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: AsyncResult<T>): Result<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): SyncResult<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: SyncResult<T>): Result<T>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): any;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: Result<T>): Result<T>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => any, optional: AsyncResult<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => any, optional: AsyncResult<T>): Result<T>;
        /**
         * @param λ The function to map the error value to
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => PromiseLike<any>, optional: SyncResult<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => any, optional: SyncResult<T>): SyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => any, optional: SyncResult<T>): Result<T>;
        /**
         * @param λ The function to map the error value to
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => PromiseLike<any>, optional: Result<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => any, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: (x: any) => any, optional: Result<T>): Result<T>;
    };
    /**
       * Recover the result if it is an error and the predicate returns true.
       */
    static recoverWhen: {
        <T, Y = T>(predicate: (x: T) => PromiseLike<boolean | T>): {
            /**
             * @param λ The function to recover the result with
             */
            <Y = T>(λ: (x: T) => Y): {
                /**
                 * @param optional The instance parameter to use as a base to call the functions with.
                 */
                (optional: AsyncResult<T>): AsyncResult<Y>;
                /**
                 * @param optional The instance parameter to use as a base to call the functions with.
                 */
                (optional: SyncResult<T>): AsyncResult<Y>;
                /**
                 * @param optional The instance parameter to use as a base to call the functions with.
                 */
                (optional: Result<T>): AsyncResult<Y>;
            };
            /**
             * @param λ The function to recover the result with
         * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(λ: (x: T) => Y, optional: AsyncResult<T>): AsyncResult<Y>;
            <Y = T>(λ: (x: T) => PromiseLike<Y>): {
                /**
                 * @param optional The instance parameter to use as a base to call the functions with.
                 */
                (optional: AsyncResult<T>): AsyncResult<Y>;
                /**
                 * @param optional The instance parameter to use as a base to call the functions with.
                 */
                (optional: SyncResult<T>): AsyncResult<Y>;
                /**
                 * @param optional The instance parameter to use as a base to call the functions with.
                 */
                (optional: Result<T>): AsyncResult<Y>;
            };
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(λ: (x: T) => PromiseLike<Y>, optional: AsyncResult<T>): AsyncResult<Y>;
            /**
             * @param λ The function to recover the result with
         * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(λ: (x: T) => Y, optional: SyncResult<T>): AsyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(λ: (x: T) => PromiseLike<Y>, optional: SyncResult<T>): AsyncResult<Y>;
            /**
             * @param λ The function to recover the result with
         * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(λ: (x: T) => Y, optional: Result<T>): AsyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(λ: (x: T) => PromiseLike<Y>, optional: Result<T>): AsyncResult<Y>;
        };
        /**
         * @param predicate The predicate to test
     * @param λ The function to recover the result with
         */
        <T, Y = T>(predicate: (x: T) => PromiseLike<boolean | T>, λ: (x: T) => Y): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): AsyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): AsyncResult<Y>;
        };
        /**
         * @param predicate The predicate to test
     * @param λ The function to recover the result with
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(predicate: (x: T) => PromiseLike<boolean | T>, λ: (x: T) => Y, optional: AsyncResult<T>): AsyncResult<Y>;
        <T, Y = T>(predicate: (x: T) => boolean | T): {
            <Y = T>(λ: (x: T) => PromiseLike<Y>): {
                /**
                 * @param optional The instance parameter to use as a base to call the functions with.
                 */
                (optional: AsyncResult<T>): AsyncResult<Y>;
                /**
                 * @param optional The instance parameter to use as a base to call the functions with.
                 */
                (optional: SyncResult<T>): AsyncResult<Y>;
                /**
                 * @param optional The instance parameter to use as a base to call the functions with.
                 */
                (optional: Result<T>): AsyncResult<Y>;
            };
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(λ: (x: T) => PromiseLike<Y>, optional: AsyncResult<T>): AsyncResult<Y>;
            <Y = T>(λ: (x: T) => Y): {
                /**
                 * @param optional The instance parameter to use as a base to call the functions with.
                 */
                (optional: AsyncResult<T>): AsyncResult<Y>;
                /**
                 * @param optional The instance parameter to use as a base to call the functions with.
                 */
                (optional: SyncResult<T>): SyncResult<Y>;
                /**
                 * @param optional The instance parameter to use as a base to call the functions with.
                 */
                (optional: Result<T>): any;
            };
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(λ: (x: T) => Y, optional: AsyncResult<T>): AsyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(λ: (x: T) => PromiseLike<Y>, optional: SyncResult<T>): AsyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(λ: (x: T) => Y, optional: SyncResult<T>): SyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(λ: (x: T) => PromiseLike<Y>, optional: Result<T>): AsyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(λ: (x: T) => Y, optional: Result<T>): any;
        };
        <T, Y = T>(predicate: (x: T) => boolean | T, λ: (x: T) => PromiseLike<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): AsyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): AsyncResult<Y>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(predicate: (x: T) => boolean | T, λ: (x: T) => PromiseLike<Y>, optional: AsyncResult<T>): AsyncResult<Y>;
        <T, Y = T>(predicate: (x: T) => PromiseLike<boolean | T>, λ: (x: T) => PromiseLike<Y>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): AsyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): AsyncResult<Y>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(predicate: (x: T) => PromiseLike<boolean | T>, λ: (x: T) => PromiseLike<Y>, optional: AsyncResult<T>): AsyncResult<Y>;
        <T, Y = T>(predicate: (x: T) => boolean | T, λ: (x: T) => Y): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): AsyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): SyncResult<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): any;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(predicate: (x: T) => boolean | T, λ: (x: T) => Y, optional: AsyncResult<T>): AsyncResult<Y>;
        <T, Y = T>(predicate: (x: T) => boolean | T | PromiseLike<boolean | T>): {
            <Y = T>(λ: (x: T) => Y): {
                /**
                 * @param optional The instance parameter to use as a base to call the functions with.
                 */
                (optional: AsyncResult<T>): Result<Y>;
                /**
                 * @param optional The instance parameter to use as a base to call the functions with.
                 */
                (optional: SyncResult<T>): Result<Y>;
                /**
                 * @param optional The instance parameter to use as a base to call the functions with.
                 */
                (optional: Result<T>): Result<Y>;
            };
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(λ: (x: T) => Y, optional: AsyncResult<T>): Result<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(λ: (x: T) => Y, optional: SyncResult<T>): Result<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <Y = T>(λ: (x: T) => Y, optional: Result<T>): Result<Y>;
        };
        <T, Y = T>(predicate: (x: T) => boolean | T | PromiseLike<boolean | T>, λ: (x: T) => Y): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: AsyncResult<T>): Result<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: SyncResult<T>): Result<Y>;
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: Result<T>): Result<Y>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(predicate: (x: T) => boolean | T | PromiseLike<boolean | T>, λ: (x: T) => Y, optional: AsyncResult<T>): Result<Y>;
        /**
         * @param predicate The predicate to test
     * @param λ The function to recover the result with
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(predicate: (x: T) => PromiseLike<boolean | T>, λ: (x: T) => Y, optional: SyncResult<T>): AsyncResult<Y>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(predicate: (x: T) => boolean | T, λ: (x: T) => PromiseLike<Y>, optional: SyncResult<T>): AsyncResult<Y>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(predicate: (x: T) => PromiseLike<boolean | T>, λ: (x: T) => PromiseLike<Y>, optional: SyncResult<T>): AsyncResult<Y>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(predicate: (x: T) => boolean | T, λ: (x: T) => Y, optional: SyncResult<T>): SyncResult<Y>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(predicate: (x: T) => boolean | T | PromiseLike<boolean | T>, λ: (x: T) => Y, optional: SyncResult<T>): Result<Y>;
        /**
         * @param predicate The predicate to test
     * @param λ The function to recover the result with
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(predicate: (x: T) => PromiseLike<boolean | T>, λ: (x: T) => Y, optional: Result<T>): AsyncResult<Y>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(predicate: (x: T) => boolean | T, λ: (x: T) => PromiseLike<Y>, optional: Result<T>): AsyncResult<Y>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(predicate: (x: T) => PromiseLike<boolean | T>, λ: (x: T) => PromiseLike<Y>, optional: Result<T>): AsyncResult<Y>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(predicate: (x: T) => boolean | T, λ: (x: T) => Y, optional: Result<T>): any;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, Y = T>(predicate: (x: T) => boolean | T | PromiseLike<boolean | T>, λ: (x: T) => Y, optional: Result<T>): Result<Y>;
    };
    /**
       * Aborts the excution if the result is an error.
       */
    static abortOnError: {
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: AsyncResult<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: SyncResult<T>): SyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: Result<T>): any;
    };
    /**
       * Converts the result to a asyncronous result.
       */
    static asynchronous: {
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: AsyncResult<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: SyncResult<T>): AsyncResult<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: Result<T>): AsyncResult<T>;
    };
    /**
       * Converts the result to a promise.
       */
    static toPromise: {
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: AsyncResult<T>): Promise<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: SyncResult<T>): Promise<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: Result<T>): Promise<T>;
    };
    /**
       * Converts the result to an optional object.
       */
    static toOptional: {
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: AsyncResult<T>): Promise<Optional<T>>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: SyncResult<T>): Optional<T>;
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(optional: Result<T>): any;
    };
    /**
       * Returns the value of the result.
       * If the result is not Ok, it will throw an error.
       * @throws Error if the result is not Ok
       * @returns The value of the result
       * @example
       * const result = Result.Ok(1);
       * const value = result.get(); // 1
       */
    abstract get(): T | Promise<T>;
    /**
       * Returns the value of the result.
       * If the result is not Ok, it will return the value provided.
       * @param value The value to return if the result is not Ok
       * @returns The value of the result or the provided value
       * @example
       * const result = Result.Ok(1);
       * const value = result.getOrElse(2); // 1
       *
       * const result = Result.Error(1);
       * const value = result.getOrElse(2); // 2
       */
    abstract getOrElse<Y = T>(value?: Y): T | Y | Promise<T> | Promise<Y>;
    /**
       * Recovers from an error if an error occurs.
       * @param λ The function to recover with
       * @returns A new result with the recovered value
       * @example
       * const result = Result.Error(1);
       * const recovered = result.recover(() => 5); // Result.Ok(5)
       *
       * const result = Result.Ok(1);
       * const recovered = result.recover(() => 5); // Result.Ok(1)
       */
    abstract recover<R = T>(λ: (x: any) => PromiseLike<R>): AsyncResult<T | R>;
    abstract recover<R = T>(λ: (x: any) => R): SyncResult<T | R> | AsyncResult<T | R>;
    abstract recover<R = T>(λ: (x: any) => R): Result<T | R>;
    /**
       * Replace the value of the result.
       * Will only replace the value if the result is Ok.
       * @param value The value to replace the result with
       * @returns A new result with the replaced value
       * @example
       * const result = Result.Ok(1);
       * const replaced = result.replace(5); // Result.Ok(5)
       *
       * const result = Result.Error(1);
       * const replaced = result.replace(5); // Result.Error(1)
       */
    abstract replace<Y = T>(value: PromiseLike<Y>): AsyncResult<Y>;
    abstract replace<Y = T>(value: Y): SyncResult<Y> | AsyncResult<Y>;
    abstract replace<Y = T>(value: Y | PromiseLike<Y>): Result<Y>;
    /**
       * Returns the wrapped property value if the result contains an object.
       * Will return an Error result if the property was not found.
       * @param propertyName The name of the property to get
       * @returns A new result with the property value
       * @example
       * const result = Result.Ok({ name: "John" });
       * const name = result.expectProperty("name"); // Result.Ok("John")
       *
       * const result = Result.Ok({ name: "John" });
       * const name = result.expectProperty("age"); // Result.Error()
       */
    abstract expectProperty(propertyName: IfAny<T, any, never>): SyncResult<any> | AsyncResult<any>;
    abstract expectProperty(propertyName: IfAny<T, any, never>): Result<any>;
    abstract expectProperty<Y extends keyof T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(propertyName: Y): SyncResult<IfAnyOrUnknown<V, any, V & {}>> | AsyncResult<IfAnyOrUnknown<V, any, V & {}>>;
    abstract expectProperty<Y extends keyof T, U = Y extends keyof T ? T[Y] : any, V = U extends Optional<infer X> ? X : U>(propertyName: Y): Result<IfAnyOrUnknown<V, any, V & {}>>;
    /**
       * Returns the wrapped property value if the result contains an object.
       * Will always return an Ok result even if the property was not found.
       * @param propertyName The name of the property to get
       * @returns A new result with the property value
       * @example
       * const result = Result.Ok({ name: "John" });
       * const name = result.property("name"); // Result.Ok("John")
       *
       * const result = Result.Ok({ name: "John" });
       * const name = result.property("age"); // Result.Ok(undefined)
       */
    abstract property(propertyName: IfAny<T, any, never>): SyncResult<any> | AsyncResult<any>;
    abstract property(propertyName: IfAny<T, any, never>): Result<any>;
    abstract property<Y extends keyof T>(propertyName: Y): SyncResult<Y extends keyof T ? T[Y] : any> | AsyncResult<Y extends keyof T ? T[Y] : any>;
    abstract property<Y extends keyof T>(propertyName: Y): Result<Y extends keyof T ? T[Y] : any>;
    /**
       * Tap into the result and perform an action.
       * Will only perform the action if the result is Ok.
       * @param λ The action to perform
       * @returns The result
       * @example
       * const result = Result.Ok(1);
       * const tapped = result.tap(x => console.log(x)); // Logs: "1"
       *
       * const result = Result.Error(1);
       * const tapped = result.tap(x => console.log(x)); // No logs!
       */
    abstract tap(λ: (x: T) => PromiseLike<void>): AsyncResult<T>;
    abstract tap(λ: (x: T) => void): SyncResult<T> | AsyncResult<T>;
    abstract tap(λ: (x: T) => void | PromiseLike<void>): Result<T>;
    /**
       * Test if the result satisfies a predicate.
       * Will only test the predicate if the result is Ok.
       * @param predicate The predicate to test
       * @returns A boolean result
       * @example
       * const result = Result.Ok(1);
       * const satisfied = result.satisfies(x => x === 1); // true
       *
       * const result = Result.Error(1);
       * const satisfied = result.satisfies(x => x === 1); // false
       */
    abstract satisfies(predicate: (x: T) => PromiseLike<T | boolean>): Promise<boolean>;
    abstract satisfies(predicate: (x: T) => T | boolean): boolean | Promise<boolean>;
    /**
       * Test if the result value equals another value.
       * Will only test the equality if the result is Ok.
       * @param value The value to test equality with
       * @returns A boolean result
       * @example
       * const result = Result.Ok(1);
       * const satisfied = result.valueEquals(1); // true
       *
       * const result = Result.Error(1);
       * const satisfied = result.valueEquals(1); // false
       */
    abstract valueEquals(value: T): boolean | Promise<boolean>;
    /**
       * Map the result value.
       * Will only map the value if the result is Ok.
       * Will always return an Ok result even if the passed value is undefined.
       * @param λ The function to map the value to
       * @returns A new result with the mapped value
       * @see {@link transform} Alias
       * @example
       * const result = Result.Ok(1);
       * const mapped = result.map((x) => ({age: x})); // Result.Ok({age: 1})
       *
       * const result = Result.Ok(1);
       * const mapped = result.map((x) => undefined); // Result.Ok(undefined)
       *
       * const result = Result.Error(1);
       * const mapped = result.map((x) => ({age: x})); // Result.Error(1)
       */
    abstract map<Y = T>(λ: (x: T) => PromiseLike<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
    abstract map<Y = T>(λ: (x: T) => Y): SyncResult<IfAnyOrUnknown<Y, any, Y>> | AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
    abstract map<Y = T>(λ: (x: T) => Y | PromiseLike<Y>): Result<IfAnyOrUnknown<Y, any, Y>>;
    /**
       * Map the result value.
       * Will only map the value if the result is Ok.
       * Will always return an Ok result even if the passed value is undefined.
       * @param λ The function to map the value to
       * @returns A new result with the mapped value
       * @see {@link map} Alias
       * @example
       * const result = Result.Ok(1);
       * const mapped = result.map((x) => ({age: x})); // Result.Ok({age: 1})
       *
       * const result = Result.Ok(1);
       * const mapped = result.map((x) => undefined); // Result.Ok(undefined)
       *
       * const result = Result.Error(1);
       * const mapped = result.map((x) => ({age: x})); // Result.Error(1)
       */
    abstract transform<Y = T>(λ: (x: T) => PromiseLike<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
    abstract transform<Y = T>(λ: (x: T) => Y): SyncResult<IfAnyOrUnknown<Y, any, Y>> | AsyncResult<IfAnyOrUnknown<Y, any, Y>>;
    abstract transform<Y = T>(λ: (x: T) => Y | PromiseLike<Y>): Result<IfAnyOrUnknown<Y, any, Y>>;
    /**
     * Map the result value.
     * Will only map the value if the result is Ok.
     * Will return an Error result if the passed value is undefined.
     * @param λ The function to map the value to
     * @returns A new result with the mapped value
     * @example
     * const result = Result.Ok(1);
     * const mapped = result.expectMap((x) => ({age: x})); // Result.Ok({age: 1})
     *
     * const result = Result.Ok(1);
     * const mapped = result.expectMap((x) => undefined); // Result.Error()
     *
     * const result = Result.Error(1);
     * const mapped = result.expectMap((x) => ({age: x})); // Result.Error(1)
     */
    abstract expectMap<Y = T>(λ: (x: T) => PromiseLike<Optional<T>>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    abstract expectMap<Y = T>(λ: (x: T) => Optional<Y>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    abstract expectMap<Y = T>(λ: (x: T) => AsyncResult<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    abstract expectMap<Y = T>(λ: (x: T) => SyncResult<Y>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    abstract expectMap<Y = T>(λ: (x: T) => Result<Y>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
    abstract expectMap<Y = T>(λ: (x: T) => PromiseLike<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    abstract expectMap<Y = T>(λ: (x: T) => Y): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>> | AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    abstract expectMap<Y = T>(λ: (x: T) => Y | PromiseLike<Y>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
    /**
       * Map the result value and flatten the result.
       * Will only map the value if the result is Ok.
       * @param λ The function to flat map the value to
       * @returns A new result with the flat mapped value
       * @example
       * const result = Result.Ok(1);
       * const mapped = result.flatMap((x) => 5)); // Result.Ok(5)
       *
       * const result = Result.Error(1);
       * const mapped = result.flatMap((x) => 5)); // Result.Error(1)
       *
       * const result = Result.Ok(1);
       * const mapped = result.flatMap((x) => Result.Ok(5)); // Result.Ok(5)
       */
    abstract flatMap<Y = T>(λ: (x: T) => PromiseLike<Optional<Y>>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    abstract flatMap<Y = T>(λ: (x: T) => PromiseLike<Result<Y>>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    abstract flatMap<Y = T>(λ: (x: T) => PromiseLike<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    abstract flatMap<Y = T>(λ: (x: T) => Optional<Y>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    abstract flatMap<Y = T>(λ: (x: T) => AsyncResult<Y>): AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    abstract flatMap<Y = T>(λ: (x: T) => SyncResult<Y>): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>> | AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    abstract flatMap<Y = T>(λ: (x: T) => Result<Y>): Result<IfAnyOrUnknown<Y, any, Y & {}>>;
    abstract flatMap<Y = T>(λ: (x: T) => Y): SyncResult<IfAnyOrUnknown<Y, any, Y & {}>> | AsyncResult<IfAnyOrUnknown<Y, any, Y & {}>>;
    abstract flatMap<Y = T>(λ: (x: T) => PromiseLike<Optional<IfAnyOrUnknown<Y, any, Y>>> | PromiseLike<Result<IfAnyOrUnknown<Y, any, Y>>> | PromiseLike<IfAnyOrUnknown<Y, any, Y>> | Optional<IfAnyOrUnknown<Y, any, Y>> | Result<IfAnyOrUnknown<Y, any, Y>> | IfAnyOrUnknown<Y, any, Y>): Result<Y & {}>;
    /**
       * Returns the result value if it is Ok, otherwise returns the error value.
       * @returns The result value or the error value
       * @example
       * const result = Result.Ok(5);
       * const value = result.merge(); // 5
       *
       * const result = Result.Error(10);
       * const value = result.merge(); // 10
       */
    abstract merge(): T | Promise<T>;
    /**
       * Rejects the result if the predicate returns true.
       * Will only test the predicate if the result is Ok.
       * @param predicate The predicate to test
       * @returns A new result
       * @example
       * const result = Result.Ok(1);
       * const rejected = result.reject(x => x === 1); // Result.Error()
       */
    abstract reject(predicate: (x: T) => PromiseLike<boolean>): AsyncResult<T>;
    abstract reject(predicate: (x: T) => boolean): SyncResult<T> | AsyncResult<T>;
    abstract reject(predicate: (x: T) => PromiseLike<boolean> | boolean): Result<T>;
    /**
       * Filters the result if the predicate returns true.
       * Will only test the predicate if the result is Ok.
       * @param predicate The predicate to test
       * @returns A new result
       * @example
       * const result = Result.Ok(1);
       * const filtered = result.filter(x => x === 1); // Result.Ok(1)
       *
       * const result = Result.Ok(1);
       * const filtered = result.filter(x => x === 2); // Result.Error(2)
       */
    abstract filter<O extends T>(predicate: (x: T) => x is O): SyncResult<O> | AsyncResult<O>;
    abstract filter(predicate: (x: T) => PromiseLike<boolean>): AsyncResult<T>;
    abstract filter(predicate: (x: T) => boolean): SyncResult<T> | AsyncResult<T>;
    abstract filter(predicate: (x: T) => PromiseLike<boolean> | boolean): Result<T>;
    /**
       * Match the result type and return a value.
       * @param callbacks The callbacks to match
       * @returns The matched value
       * @example
       * const result = Result.Ok(1);
       * const value = result.match({
       *  Ok: (x) => 10,
       *  Error: (x) => 15
       * }); // 10
       *
       * const result = Result.Error(1);
       * const value = result.match({
       *  Ok: (x) => 10,
       *  Error: (x) => 15
       * }); // 15
       */
    abstract match<out_ok = T, out_error = T, out_abort = T>(callbacks: IResultCallbacks<T, out_ok, out_error, out_abort>): out_ok | out_error | out_abort | Promise<out_ok | out_error | out_abort>;
    abstract match(callbacks: IResultCallbacks<T>): any;
    /**
       * Aborts the excution if the result is an error with an error value.
       * @param λOrValue The function or value to set as error message if the result is an error
       * @returns A new result
       * @example
       * const result = Result.Ok(1);
       * const aborted = result.abortOnError(); // Result.Ok(1)
       *
       * const result = Result.Error(1);
       * const aborted = result.abortOnError(); // Result.Aborted()
       *
       * const result = Result.Error(1);
       * const aborted = result.abortOnError('Error'); // Result.Aborted('Error')
       */
    abstract abortOnErrorWith(): SyncResult<T> | AsyncResult<T>;
    abstract abortOnErrorWith<Y = any>(λOrValue: ((error: any) => PromiseLike<any>) | PromiseLike<any>): AsyncResult<T>;
    abstract abortOnErrorWith<Y = any>(λOrValue: ((error: any) => any) | Y): SyncResult<T> | AsyncResult<T>;
    abstract abortOnErrorWith<Y = any>(λOrValue: ((error: any) => any) | Y): Result<T>;
    /**
       * Tap the error value if result is an error.
       * @param λ The function to tap the error value with
       * @returns A new result
       * @example
       * const result = Result.Ok(1);
       * const tapped = result.tapError(x => console.log(x)); // No logs!
       *
       * const result = Result.Error(1);
       * const tapped = result.tapError(x => console.log(x)); // Logs: "1"
       */
    abstract tapError(λ: (x: any) => PromiseLike<void>): AsyncResult<T>;
    abstract tapError(λ: (x: any) => void): SyncResult<T> | AsyncResult<T>;
    abstract tapError(λ: (x: any) => PromiseLike<void> | void): Result<T>;
    /**
       * Map the error value if result is an error.
       * @param λ The function to map the error value to
       * @returns A new result
       * @example
       * const result = Result.Ok(1);
       * const mapped = result.mapError(x => 10); // Result.Ok(1)
       *
       * const result = Result.Error(1);
       * const mapped = result.mapError(x => 10); // Result.Error(10)
       */
    abstract mapError(λ: (x: any) => PromiseLike<any>): AsyncResult<T>;
    abstract mapError(λ: (x: any) => any): SyncResult<T> | AsyncResult<T>;
    abstract mapError(λ: (x: any) => PromiseLike<any> | any): Result<T>;
    /**
       * Recover the result if it is an error and the predicate returns true.
       * @param predicate The predicate to test
       * @param λ The function to recover the result with
       * @returns A new result
       * @example
       * const result = Result.Ok(1);
       * const recovered = result.recoverWhen(x => true, x => 10); // Result.Ok(1)
       *
       * const result = Result.Error(1);
       * const recovered = result.recoverWhen(x => true, x => 10); // Result.Ok(10)
       *
       * const result = Result.Error(1);
       * const recovered = result.recoverWhen(x => false, x => 10); // Result.Error(1)
       */
    abstract recoverWhen<Y = T>(predicate: (x: T) => PromiseLike<T | boolean>, λ: (x: T) => Y): AsyncResult<Y>;
    abstract recoverWhen<Y = T>(predicate: (x: T) => T | boolean, λ: (x: T) => PromiseLike<Y>): AsyncResult<Y>;
    abstract recoverWhen<Y = T>(predicate: (x: T) => PromiseLike<T | boolean>, λ: (x: T) => PromiseLike<Y>): AsyncResult<Y>;
    abstract recoverWhen<Y = T>(predicate: (x: T) => T | boolean, λ: (x: T) => Y): SyncResult<Y> | AsyncResult<Y>;
    abstract recoverWhen<Y = T>(predicate: (x: T) => T | boolean | PromiseLike<T | boolean>, λ: (x: T) => Y): Result<Y>;
    /**
       * Aborts the excution if the result is an error.
       * @returns A new result
       * @example
       * const result = Result.Ok(1);
       * const aborted = result.abortOnError(); // Result.Ok(1)
       *
       * const result = Result.Error(1);
       * const aborted = result.abortOnError(); // Result.Aborted()
       */
    abstract abortOnError(): SyncResult<T> | AsyncResult<T>;
    /**
       * Converts the result to a asyncronous result.
       * @returns A new async result
       * @example
       * const result = Result.Ok(1);
       * const async = result.asynchronous(); // Result.Pending(Result.Ok(1))
       *
       * const result = Result.Error(1);
       * const async = result.asynchronous(); // Result.Pending(Result.Error(1))
       */
    abstract asynchronous(): AsyncResult<T>;
    /**
       * Converts the result to a promise.
       * @returns A promise
       * @example
       * const result = Result.Ok(1);
       * const promise = result.promise(); // Promise<1>
       */
    abstract toPromise(): Promise<T>;
    /**
       * Converts the result to an optional object.
       * @returns An optional
       * @example
       * const result = Result.Ok(1);
       * const optional = result.toOptional(); // Optional.Some(1)
       *
       * const result = Result.Error(1);
       * const optional = result.toOptional(); // Optional.None
       */
    abstract toOptional(): Optional<T> | Promise<Optional<T>>;
}
