import { CreateSomeFunc, CreateNoneFunc, IOptional, IOptionalMatchClauses, NullableTransformationFunction, NullaryValueFactory, Predicate, SideEffectsFunction, TransformationFunction } from '../optional.types';
import { fromNullable, all, values, first, fromParsedJson, when, isOptional, isSome, isNone } from '../optional/optional.utils';
import { IfAnyOrUnknown, IfAny, IfNullOrUndefined } from '../utils/types';
export declare abstract class Optional<T = any> implements IOptional<T> {
    isOptionalInstance: true;
    valuePresent: boolean;
    valueAbsent: boolean;
    value?: T;
    static Some: CreateSomeFunc;
    static None: CreateNoneFunc;
    static fromNullable: typeof fromNullable;
    static fromParsedJson: typeof fromParsedJson;
    static all: typeof all;
    static values: typeof values;
    static when: typeof when;
    static first: typeof first;
    static isOptional: typeof isOptional;
    static isSome: typeof isSome;
    static isNone: typeof isNone;
    /**
       * Maps the value of the Optional to a new value.
       */
    static nullableMap: {
        /**
         * @param λ A function that takes the value of the Optional and returns a new value.
         */
        <T, U = T>(λ: NullableTransformationFunction<T, U>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: IOptional<T>): Optional<U>;
        };
        /**
         * @param λ A function that takes the value of the Optional and returns a new value.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, U = T>(λ: NullableTransformationFunction<T, U>, optional: IOptional<T>): Optional<U>;
    };
    /**
       * Returns the original optional if it is present, or the return value of the provided replacement function if the original value is not present.
       */
    static or: {
        /**
         * @param replacement A function that returns an Optional or a value that will be used as a replacement if the Optional is None.
         */
        <T, U = T>(replacement: any): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: IOptional<T>): any;
        };
        /**
         * @param replacement A function that returns an Optional or a value that will be used as a replacement if the Optional is None.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, U = T>(replacement: any, optional: IOptional<T>): any;
    };
    /**
       * Pattern matches on the optional value and returns the result of executing the corresponding function for the matching case.
       */
    static match: {
        /**
         * @param clauses An object containing functions to execute for the "Some" and "None" cases.
         */
        <T, U = undefined, V = undefined>(clauses: IOptionalMatchClauses<T, U, V>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: IOptional<T>): U | V;
        };
        /**
         * @param clauses An object containing functions to execute for the "Some" and "None" cases.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, U = undefined, V = undefined>(clauses: IOptionalMatchClauses<T, U, V>, optional: IOptional<T>): U | V;
    };
    /**
       * Maps the value of the Optional to a new value.
       */
    static transform: {
        /**
         * @param λ A function that takes the value of the Optional and returns a new value.
         */
        <T, U>(λ: TransformationFunction<T, U>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: IOptional<T>): Optional<IfAnyOrUnknown<U, any, U>>;
        };
        /**
         * @param λ A function that takes the value of the Optional and returns a new value.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, U>(λ: TransformationFunction<T, U>, optional: IOptional<T>): Optional<IfAnyOrUnknown<U, any, U>>;
    };
    /**
       * Maps the value of the Optional to a new value.
       */
    static map: {
        /**
         * @param λ A function that takes the value of the Optional and returns a new value.
         */
        <T, U>(λ: TransformationFunction<T, U>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: IOptional<T>): Optional<IfAnyOrUnknown<U, any, U>>;
        };
        /**
         * @param λ A function that takes the value of the Optional and returns a new value.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, U>(λ: TransformationFunction<T, U>, optional: IOptional<T>): Optional<IfAnyOrUnknown<U, any, U>>;
    };
    static optionalProperty: {
        /**
         * @param property The name of the property to retrieve.
         */
        <T>(property: IfAny<T, any, never>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: IOptional<T>): any;
        };
        /**
         * @param property The name of the property to retrieve.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(property: IfAny<T, any, never>, optional: IOptional<T>): any;
        <T, U extends keyof T>(property: U): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: IOptional<T>): IfAnyOrUnknown<T, Optional, U extends keyof T ? T[U] : never>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, U extends keyof T>(property: U, optional: IOptional<T>): IfAnyOrUnknown<T, Optional, U extends keyof T ? T[U] : never>;
    };
    static nullableProperty: {
        /**
         * @param property The name of the property to retrieve.
         */
        <T>(property: IfAny<T, any, never>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: IOptional<T>): Optional<any>;
        };
        /**
         * @param property The name of the property to retrieve.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(property: IfAny<T, any, never>, optional: IOptional<T>): Optional<any>;
        <T, U extends keyof T>(property: U): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: IOptional<T>): IfAnyOrUnknown<T, Optional, U extends keyof T ? Optional<IfNullOrUndefined<T[U], any, T[U]>> : never>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, U extends keyof T>(property: U, optional: IOptional<T>): IfAnyOrUnknown<T, Optional, U extends keyof T ? Optional<IfNullOrUndefined<T[U], any, T[U]>> : never>;
    };
    static property: {
        /**
         * @param property The name of the property to retrieve.
         */
        <T>(property: IfAny<T, any, never>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: IOptional<T>): Optional<any>;
        };
        /**
         * @param property The name of the property to retrieve.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(property: IfAny<T, any, never>, optional: IOptional<T>): Optional<any>;
        <T, U extends keyof T>(property: U): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: IOptional<T>): IfAnyOrUnknown<T, Optional, U extends keyof T ? Optional<T[U]> : never>;
        };
        /**
         * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, U extends keyof T>(property: U, optional: IOptional<T>): IfAnyOrUnknown<T, Optional, U extends keyof T ? Optional<T[U]> : never>;
    };
    /**
       * Maps the value of the Optional to a new value.
       */
    static flatMap: {
        /**
         * @param λ A function that takes the value of the Optional and returns a new value.
         */
        <T, U = T>(λ: TransformationFunction<T, U>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: IOptional<T>): any;
        };
        /**
         * @param λ A function that takes the value of the Optional and returns a new value.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, U = T>(λ: TransformationFunction<T, U>, optional: IOptional<T>): any;
    };
    /**
       * Executes a function if the Optional is present.
       */
    static tap: {
        /**
         * @param λ A function that takes the value of the Optional and executes side effects.
         */
        <T>(λ: SideEffectsFunction<T>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: IOptional<T>): Optional<T>;
        };
        /**
         * @param λ A function that takes the value of the Optional and executes side effects.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: SideEffectsFunction<T>, optional: IOptional<T>): Optional<T>;
    };
    /**
       * Checks whether the Optional satisfies a predicate.
       */
    static satisfies: {
        /**
         * @param λ A function that takes the value of the Optional and returns a boolean.
         */
        <T>(λ: Predicate<T>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: IOptional<T>): boolean;
        };
        /**
         * @param λ A function that takes the value of the Optional and returns a boolean.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: Predicate<T>, optional: IOptional<T>): boolean;
    };
    /**
       * Checks whether the Optional's value is equal to another value.
       */
    static valueEquals: {
        /**
         * @param value The value to compare the Optional's value to.
         */
        <T, U = T>(value: U): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: IOptional<T>): boolean;
        };
        /**
         * @param value The value to compare the Optional's value to.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, U = T>(value: U, optional: IOptional<T>): boolean;
    };
    /**
       * Checks whether the Optional's value passes a predicate.
       */
    static filter: {
        /**
         * @param λ A function that takes the value of the Optional and returns a boolean.
         */
        <T>(λ: Predicate<T>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: IOptional<T>): Optional<T>;
        };
        /**
         * @param λ A function that takes the value of the Optional and returns a boolean.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: Predicate<T>, optional: IOptional<T>): Optional<T>;
    };
    /**
       * Checks whether the Optional's value fails a predicate.
       */
    static reject: {
        /**
         * @param λ A function that takes the value of the Optional and returns a boolean.
         */
        <T>(λ: Predicate<T>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            (optional: IOptional<T>): Optional<T>;
        };
        /**
         * @param λ A function that takes the value of the Optional and returns a boolean.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(λ: Predicate<T>, optional: IOptional<T>): Optional<T>;
    };
    /**
       * Get the value or throw.
       */
    static get: {
        /**
         * @param message The message to throw if the Optional is None.
         */
        <T>(message: string): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: IOptional<T>): T;
        };
        /**
         * @param message The message to throw if the Optional is None.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T>(message: string, optional: IOptional<T>): T;
    };
    /**
       * Get the value or return a default value.
       */
    static getOrElse: {
        /**
         * @param replacement The value to return if the Optional is None.
         */
        <T, U = T>(replacement: U): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: IOptional<T>): T | U;
        };
        /**
         * @param replacement The value to return if the Optional is None.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, U = T>(replacement: U, optional: IOptional<T>): T | U;
    };
    /**
       * Recovers from a None Optional.
       */
    static recover: {
        /**
         * @param λ A function that takes the value of the Optional and returns a new value.
         */
        <T, U = T>(λ: NullaryValueFactory<U>): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: IOptional<T>): Optional<U>;
        };
        /**
         * @param λ A function that takes the value of the Optional and returns a new value.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, U = T>(λ: NullaryValueFactory<U>, optional: IOptional<T>): Optional<U>;
    };
    /**
       * Replace the value of the Optional.
       */
    static replace: {
        /**
         * @param value The value to replace the Optional's value with.
         */
        <T, U = T>(value: U): {
            /**
             * @param optional The instance parameter to use as a base to call the functions with.
             */
            <T>(optional: IOptional<T>): Optional<U>;
        };
        /**
         * @param value The value to replace the Optional's value with.
     * @param optional The instance parameter to use as a base to call the functions with.
         */
        <T, U = T>(value: U, optional: IOptional<T>): Optional<U>;
    }; /**
* Maps the value of the Optional to a new value.
* @param λ A function that takes the value of the Optional and returns a new value.
* @returns An Optional containing the new value.
* @example
* const optional = Optional.Some(5);
* const newOptional = optional.nullableMap(x => x + 1);
* // newOptional === Optional.Some(6)
*
* const optional = Optional.Some(5);
* const newOptional = optional.nullableMap(x => undefined);
* // newOptional === Optional.None()
*
* const optional = Optional.None();
* const newOptional = optional.nullableMap(x => x + 1);
* // newOptional === Optional.None()
*/
    nullableMap<U = T>(λ: NullableTransformationFunction<T, U>): Optional<U>;
    /**
         * Returns the original optional if it is present, or the return value of the provided replacement function if the original value is not present.
         * @param replacement A function that returns an Optional or a value that will be used as a replacement if the Optional is None.
         * @returns The original Optional if it is present, or the return value of the provided replacement function if the original value is not present.
         * @example
         * const some = Optional.Some(5);
         * const result = some.or(() => Optional.Some(6));
         * // result === Optional.Some(5)
         *
         * const none = Optional.None();
         * const result = none.or(() => Optional.Some(6));
         * // result === Optional.Some(6)
         */ or<U = T>(replacement: (() => Optional<U>) | Optional<U>): Optional<T> | Optional<U>;
    /**
         * Pattern matches on the optional value and returns the result of executing the corresponding function for the matching case.
         * @param clauses An object containing functions to execute for the "Some" and "None" cases.
         * @returns The result of executing the matching function.
         */ match<U = undefined, V = undefined>(clauses: IOptionalMatchClauses<T, U, V>): U | V;
    /**
         * Maps the value of the Optional to a new value.
         * @param λ A function that takes the value of the Optional and returns a new value.
         * @see Alias for {@link map}
         */ transform<U>(λ: TransformationFunction<T, U>): Optional<IfAnyOrUnknown<U, any, U>>;
    /**
         * Maps the value of the Optional to a new value.
         * @param λ A function that takes the value of the Optional and returns a new value.
         * @returns An Optional containing the new value.
         * @example
         * const some = Optional.Some(5);
         * const result = some.map(x => `Result - ${x}`);
         * // result === Optional.Some("Result - 5")
         *
         * const none = Optional.None();
         * const result = none.map(x => `Result - ${x}`);
         * // result === Optional.None()
         */ map<U>(λ: TransformationFunction<T, U>): Optional<IfAnyOrUnknown<U, any, U>>;
    /**
         * Maps the value of the Optional to a property of the value.
         * @param property The name of the property to retrieve.
         * @returns The value of the property or an None Optional.
         * @example
         * const some = Optional.Some({ name: "John", age: 30 });
         * const result = some.property("name");
         * // result === "John"
         *
         * const none = Optional.None();
         * const result = none.property("name");
         * // result === Optional.None()
         */ optionalProperty(property: IfAny<T, any, never>): any;
    optionalProperty<U extends keyof T>(property: U): IfAnyOrUnknown<T, Optional, U extends keyof T ? T[U] : never>;
    /**
         * Maps the value of the Optional to a property of the value.
         * Wraps the value in an Optional.
         * @param property The name of the property to retrieve.
         * @returns An Optional containing the value of the property.
         * @example
         * const some = Optional.Some({ name: "John", age: 30 });
         * const result = some.nullableProperty("name");
         * // result === Optional.Some("John")
         *
         * const some = Optional.Some({ name: "John", age: 30 });
         * const result = some.nullableProperty("nonExistentProperty");
         * // result === Optional.None()
         *
         * const none = Optional.None();
         * const result = none.nullableProperty("name");
         * // result === Optional.None()
         */ nullableProperty(property: IfAny<T, any, never>): Optional<any>;
    nullableProperty<U extends keyof T>(property: U): IfAnyOrUnknown<T, Optional, U extends keyof T ? Optional<IfNullOrUndefined<T[U], any, T[U]>> : never>;
    /**
         * Maps the value of the Optional to a property of the value.
         * Wraps the value in an Some Optional.
         * @param property The name of the property to retrieve.
         * @returns An Optional containing the value of the property.
         * @example
         * const some = Optional.Some({ name: "John", age: 30 });
         * const result = some.property("name");
         * // result === Optional.Some("John")
         *
         * const some = Optional.Some({ name: "John", age: 30 });
         * const result = some.property("nonExistentProperty");
         * // result === Optional.Some(undefinied)
         *
         * const none = Optional.None();
         * const result = none.property("name");
         * // result === Optional.None()
         */ property(property: IfAny<T, any, never>): Optional<any>;
    property<U extends keyof T>(property: U): IfAnyOrUnknown<T, Optional, U extends keyof T ? Optional<T[U]> : never>;
    /**
         * Maps the value of the Optional to a new value.
         * @param λ A function that takes the value of the Optional and returns a new value.
         * @returns Either the new value or itself if the Optional is None.
         * @example
         * const some = Optional.Some(5);
         * const result = some.flatMap(x => `Result - ${x}`);
         * // result === "Result - 5"
         *
         * const none = Optional.None();
         * const result = none.flatMap(x => `Result - ${x}`);
         * // result === Optional.None()
         */ flatMap<U = T>(λ: TransformationFunction<T, U>): U | Optional<any>;
    /**
         * Executes a function if the Optional is present.
         * @param λ A function that takes the value of the Optional and executes side effects.
         * @returns The Optional itself.
         * @example
         * const some = Optional.Some(5);
         * const result = some.tap(x => console.log(x)); // logs: 5
         * // result === Optional.Some(5)
         *
         * const none = Optional.None();
         * const result = none.tap(x => console.log(x)); // does not log
         * // result === Optional.None()
         */ tap(λ: SideEffectsFunction<T>): Optional<T>;
    /**
         * Checks whether the Optional satisfies a predicate.
         * @param λ A function that takes the value of the Optional and returns a boolean.
         * @returns True if the predicate returns true, false otherwise.
         * @example
         * const some = Optional.Some(5);
         * const result = some.satisfies(x => x > 4);
         * // result === true
         *
         * const some = Optional.Some(5);
         * const result = some.satisfies(x => x > 6);
         * // result === false
         *
         * const none = Optional.None();
         * const result = none.satisfies(x => x > 4);
         * // result === false
         */ satisfies(λ: Predicate<T>): boolean;
    /**
         * Checks whether the Optional's value is equal to another value.
         * @param value The value to compare the Optional's value to.
         * @returns True if the values are equal, false otherwise.
         * @example
         * const some = Optional.Some(5);
         * const result = some.valueEquals(5);
         * // result === true
         *
         * const some = Optional.Some(5);
         * const result = some.valueEquals("some string");
         * // result === false
         *
         * const none = Optional.None();
         * const result = none.valueEquals(5);
         * // result === false
         */ valueEquals<U = T>(value: U): boolean;
    /**
         * Checks whether the Optional's value passes a predicate.
         * @param λ A function that takes the value of the Optional and returns a boolean.
         * @see {@link reject} for the opposite of this method.
         * @returns Itself if the predicate returns true, `Optional.None()` otherwise.
         * @example
         * const some = Optional.Some(5);
         * const result = some.filter(x => x > 4);
         * // result === Optional.Some(5)
         *
         * const some = Optional.Some(5);
         * const result = some.filter(x => x > 6);
         * // result === Optional.None()
         *
         * const none = Optional.None();
         * const result = none.filter(x => x > 4);
         * // result === Optional.None()
         */ filter(λ: Predicate<T>): Optional<T>;
    /**
         * Checks whether the Optional's value fails a predicate.
         * @param λ A function that takes the value of the Optional and returns a boolean.
         * @see {@link filter} for the opposite of this method.
         * @returns Itself if the predicate returns false, `Optional.None()` otherwise.
         * @example
         * const some = Optional.Some(5);
         * const result = some.reject(x => x > 4);
         * // result === Optional.None()
         *
         * const some = Optional.Some(5);
         * const result = some.reject(x => x > 6);
         * // result === Optional.Some(5)
         *
         * const none = Optional.None();
         * const result = none.reject(x => x > 4);
         * // result === Optional.None()
         */ reject(λ: Predicate<T>): Optional<T>;
    /**
         * Get the value or throw.
         * @param message The message to throw if the Optional is None.
         * @returns The value of the Optional.
         * @throws If the Optional is None.
         * @example
         * const some = Optional.Some(5);
         * const result = some.get();
         * // result === 5
         *
         * const none = Optional.None();
         * const result = none.get("No value present");
         * // throws: "No value present"
         */ get(message?: string): T;
    /**
         * Get the value or return a default value.
         * @param replacement The value to return if the Optional is None.
         * @returns The value of the Optional or the default value.
         * @example
         * const some = Optional.Some(10);
         * const result = some.getOrElse(5);
         * // result === 10
         *
         * const none = Optional.None();
         * const result = none.getOrElse(5);
         * // result === 5
         */ getOrElse<U = T>(replacement?: U): T | U;
    /**
         * Recovers from a None Optional.
         * @param λ A function that takes the value of the Optional and returns a new value.
         * @returns Itself if the Optional is Some, a new Optional with the result of the function otherwise.
         * @example
         * const some = Optional.Some(10);
         * const result = some.recover(() => 5);
         * // result === Optional.Some(10)
         *
         * const none = Optional.None();
         * const result = none.recover(() => 5);
         * // result === Optional.Some(5)
         */ recover<U = T>(λ: NullaryValueFactory<U>): Optional<U>;
    /**
         * Replace the value of the Optional.
         * @param value The value to replace the Optional's value with.
         * @note This method does not recover from a None Optional.
         * @returns A new Optional with the new value.
         * @example
         * const some = Optional.Some(10);
         * const result = some.replace(5);
         * // result === Optional.Some(5)
         *
         * const none = Optional.None();
         * const result = none.replace(5);
         * // result === Optional.None()
         */ replace<U = T>(value: U): Optional<U>;
}
