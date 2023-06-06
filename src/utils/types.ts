
/**
 * IfAny is a type that checks if a type is any.
 * @note This is a workaround for the fact that typescript does not allow to check if a type is any.
 * @note `0 extends (1 & T)` is a trick to check if T is any.
 * @see https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360
 * @example
 * type A = IfAny<any, true, false>; // true
 * type B = IfAny<unknown, true, false>; // false
 * type C = IfAny<never, true, false>; // false
 * type D = IfAny<{}, true, false>; // false
 */
export type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N;
export type IsAny<T> = IfAny<T, true, false>;

/**
 * IfUnknown is a type that checks if a type is unknown.
 * @example
 * type A = IfUnknown<any, true, false>; // false
 * type B = IfUnknown<unknown, true, false>; // true
 * type C = IfUnknown<never, true, false>; // false
 * type D = IfUnknown<{}, true, false>; // false
 */
export type IfUnknown<T, Y, N> = IfAny<T, N, unknown extends T ? Y : N>;
export type IsUnknown<T> = IfUnknown<T, true, false>;

/**
 * IfNever is a type that checks if a type is never.
 * @example
 * type A = IfNever<any, true, false>; // false
 * type B = IfNever<unknown, true, false>; // false
 * type C = IfNever<never, true, false>; // true
 * type D = IfNever<{}, true, false>; // false
 */
export type IfNever<T, Y, N> = [T] extends [never] ? Y : N;
export type IsNever<T> = IfNever<T, true, false>;

/**
 * IfAnyOrUnknown is a type that checks if a type is any or unknown.
 * @example
 * type A = IfAnyOrUnknown<any, true, false>; // true
 * type B = IfAnyOrUnknown<unknown, true, false>; // true
 * type C = IfAnyOrUnknown<never, true, false>; // false
 * type D = IfAnyOrUnknown<{}, true, false>; // false
 */
export type IfAnyOrUnknown<T, Y, N> = IfAny<T, Y, IfUnknown<T, Y, N>>;
export type IsAnyOrUnknown<T> = IfAnyOrUnknown<T, true, false>;

/**
 * IfNullOrUndefined is a type that checks if a type is null or undefined.
 * @example
 * type A = IfNullOrUndefined<any, true, false>; // false
 * type B = IfNullOrUndefined<unknown, true, false>; // false
 * type C = IfNullOrUndefined<never, true, false>; // false
 * type D = IfNullOrUndefined<{}, true, false>; // false
 * type E = IfNullOrUndefined<undefined, true, false>; // true
 * type F = IfNullOrUndefined<null, true, false>; // true
 */
export type IfNullOrUndefined<T, Y, N> = IfAnyOrUnknown<T, N, IfNever<T, N, [T] extends [undefined] ? Y : N>> ;
export type IsNullOrUndefined<T> = IfNullOrUndefined<T, true, false>;

/**
 * IfPromise is a type that checks if a type is a Promise.
 * @example
 * type A = IfPromise<any, true, false>; // false
 * type B = IfPromise<unknown, true, false>; // false
 * type C = IfPromise<never, true, false>; // false
 * type D = IfPromise<{}, true, false>; // false
 * type E = IfPromise<Promise<any>, true, false>; // true
 */
export type IfPromise<T, Y, N> = T extends PromiseLike<any> ? Y : N;
export type IsPromise<T> = IfPromise<T, true, false>;


export type FirstElementOfArray<T extends any[]> =
    T extends [infer U, ...any[]]
      ? U
      : T extends (infer Y)[]
        ? Y
        : never;

export type LastElementOfArray<T extends any[]> =
    T extends [...any[], infer U]
    ? U
    : T extends (infer Y)[]
      ? Y
      : never;
