import { expectType, expectAssignable, expectError } from 'tsd';

import { Optional, SomeClass, NoneClass } from '../../lib/types/optional/index';

expectAssignable<Optional>(new SomeClass(54))
expectAssignable<Optional>(new NoneClass())

expectAssignable<Optional>(Optional.Some(54))
expectAssignable<Optional>(Optional.None())

expectAssignable<Optional>(Optional.fromNullable(54))
expectType<Optional<number>>(Optional.fromNullable(54))
expectType<Optional<undefined>>(Optional.fromNullable(undefined))
expectType<Optional<any>>(Optional.fromNullable(54 as any))

expectType<Optional<number>>(Optional.fromParsedJson({ isOptionalInstance: true, valuePresent: true, valueAbsent: false, value: 54 }))
expectType<Optional<string>>(Optional.fromParsedJson({ isOptionalInstance: true, valuePresent: true, valueAbsent: false, value: 'hello' }))
expectType<Optional<any>>(Optional.fromParsedJson({ isOptionalInstance: true, valuePresent: false, valueAbsent: true }))

expectType<Optional<any[]>>(Optional.all([Optional.Some(54), Optional.Some(54)]))
expectType<Optional<any[]>>(Optional.all([Optional.Some('test'), Optional.Some(54)]))

expectType<Optional<any>>(Optional.first([Optional.Some('test'), Optional.Some(54)]))
expectType<Optional<any>>(Optional.first([Optional.Some(54)]))

expectAssignable<Optional>(Optional.when(true, 54))
expectAssignable<Optional>(Optional.when(true, undefined))

const someOptional_any = Optional.Some(54) as Optional<any>;
const someOptional_number = Optional.Some(41);
const someOptional_Object = Optional.Some({ a: 1, b: 'test', c: undefined, c2: undefined as undefined | number, d: Optional.Some({ key: 'hello world' }) })

// OPTIONAL INSTANCE METHODS
expectType<number>(someOptional_number.get())
expectType<number | false>(someOptional_number.getOrElse(false))
expectType<Optional<number>>(someOptional_number.filter(x => x > 40))
expectType<Optional<number>>(someOptional_number.filter(x => x))
expectType<Optional<number>>(someOptional_number.tap(x => console.log(x)))
expectType<Optional<number>>(someOptional_number.map(x => x + 1))
expectType<Optional<string>>(someOptional_number.map(x => 'hello world'))
expectType<Optional<{ someNumber: number }>>(someOptional_number.map(x => ({ someNumber: x })))
expectType<Optional>(someOptional_number.map(x => 'hello world' as any))
expectType<Optional>(someOptional_number.map(x => 'hello world' as unknown))
expectType<number | Optional>(someOptional_number.flatMap(x => 6))
expectType<string | Optional>(someOptional_number.flatMap(x => 'hello world'))
expectType<Optional<string> | Optional>(someOptional_number.flatMap(x => Optional.Some('hello world')))

expectType<Optional<number>>(someOptional_Object.property('a'))
expectType<Optional<string>>(someOptional_Object.property('b'))
expectType<Optional<undefined>>(someOptional_Object.property('c'))
expectType<number | undefined>(someOptional_Object.optionalProperty('c2'))
expectType<Optional<Optional<{ key: string }>>>(someOptional_Object.property('d'))
expectType<Optional>(someOptional_Object.property('some key' as any))
expectType<Optional>(someOptional_any.property('some key' as unknown))

expectType<Optional<number>>(someOptional_Object.nullableProperty('a'))
expectType<Optional<string>>(someOptional_Object.nullableProperty('b'))
expectType<Optional<any>>(someOptional_Object.nullableProperty('c'))
expectType<Optional<number | undefined>>(someOptional_Object.nullableProperty('c2'))
expectType<Optional<Optional<{ key: string }>>>(someOptional_Object.nullableProperty('d'))
expectType<Optional>(someOptional_Object.nullableProperty('some key' as any))
expectType<Optional>(someOptional_any.nullableProperty('some key' as unknown))

expectType<number>(someOptional_Object.optionalProperty('a'))
expectType<string>(someOptional_Object.optionalProperty('b'))
expectType<undefined>(someOptional_Object.optionalProperty('c'))
expectType<number | undefined>(someOptional_Object.optionalProperty('c2'))
expectType<Optional<{ key: string }>>(someOptional_Object.optionalProperty('d'))
expectType<any>(someOptional_Object.optionalProperty('some key' as any))
expectType<any>(someOptional_any.optionalProperty('some key' as unknown))

expectType<string | number>(someOptional_number.match({
  Some: x => x,
  None: () => 'hello world'
}))

expectType<number | undefined>(someOptional_number.match({
  Some: x => x,
}))

expectError(someOptional_Object.property('non-existing key'));
expectError(someOptional_Object.property('non-existing key' as unknown));

expectError(someOptional_Object.nullableProperty('non-existing key'));
expectError(someOptional_Object.nullableProperty('non-existing key' as unknown));

expectError(someOptional_Object.optionalProperty('non-existing key'));
expectError(someOptional_Object.optionalProperty('non-existing key' as unknown));
