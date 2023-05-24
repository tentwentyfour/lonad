import { expectType, expectAssignable, expectError } from 'tsd';

import { Optional, Result, AsyncResult, SyncResult } from '../../lib/types/index';

expectType<SyncResult<number>>(Result.Ok(54))
expectType<SyncResult<string>>(Result.Ok('test'))
expectType<SyncResult<'test'>>(Result.Ok('test' as const))

expectType<SyncResult>(Result.Error('Some error'))
expectType<SyncResult>(Result.Aborted('Some error'))
expectType<AsyncResult<number>>(Result.Pending(Promise.resolve(54)))

expectError<AsyncResult>(Result.Ok(54))
expectError<AsyncResult>(Result.Error('Some error'))
expectError<AsyncResult>(Result.Aborted('some abort reason'))
expectError<SyncResult>(Result.Pending(Promise.resolve(54)))

expectAssignable<Result>(Result.Ok(54))
expectAssignable<Result>(Result.Error('Some error'))
expectAssignable<Result>(Result.Aborted('some abort reason'))
expectAssignable<Result>(Result.Pending(Promise.resolve(54)))

// expect
expectType<SyncResult<number>>(Result.expect(54))
expectType<SyncResult<number | string>>(Result.expect(54 as number | string))
expectType<SyncResult<string>>(Result.expect('test'))
expectType<Result<any>>(Result.expect('test' as any))
expectType<Result<any>>(Result.expect('test' as unknown))
expectType<SyncResult<string>>(Result.expect('test' as string | undefined | null))
expectType<SyncResult<number>>(Result.expect(Optional.Some(54)))
expectType<SyncResult<number>>(Result.expect(Result.Ok(54)))
expectType<AsyncResult<number>>(Result.expect(Promise.resolve(54)))
expectType<AsyncResult<number | string>>(Result.expect(Promise.resolve(54) as PromiseLike<number | string | undefined | null>))
expectType<AsyncResult<number>>(Result.expect(Result.Pending(Promise.resolve(54))))

// get
expectType<number>(Result.Ok(54).get())
expectType<any>(Result.Error().get())
expectType<any>(Result.Aborted().get())
expectType<Promise<number>>(Result.Pending(Promise.resolve(44)).get())

// getOrElse
expectType<number | undefined>(Result.Ok(54).getOrElse(undefined))
expectType<number | 'test'>(Result.Ok(54).getOrElse('test'))
expectType<any>(Result.Error().getOrElse(44))
expectType<any>(Result.Aborted().getOrElse(44))
expectType<Promise<number> | Promise<string>>(Result.Pending(Promise.resolve(44)).getOrElse('test'))

// tap
expectType<SyncResult<number>>(Result.Ok(54).tap((x) => {}))
expectType<SyncResult<number>>(Result.Ok(54).tap((x) => x))
expectType<AsyncResult<number>>(Result.Ok(54).tap(async (x) => {}))
expectType<AsyncResult<number>>(Result.Ok(54).tap(async (x) => x))

// filter
expectAssignable<Result<number>>(Result.Ok(54).filter((x) => x > 0));
expectAssignable<Result<string>>(Result.Ok('test').filter((x) => x.length > 0));
expectAssignable<Result<string | number>>(Result.Ok('test' as string | number).filter((x) => typeof x === 'string'));
expectAssignable<Result<string>>(Result.Ok('test' as string | number).filter((x): x is string => typeof x === 'string'));

expectType<SyncResult<number>>(Result.Ok(54).filter((x) => x > 0));
expectType<AsyncResult<number>>(Result.Ok(54).filter(async (x) => x > 0));

// expectMap
expectType<SyncResult<never>>(Result.Ok(54).expectMap((x) => undefined));
expectType<SyncResult<never>>(Result.Ok(54).expectMap((x) => null));
expectType<SyncResult<number>>(Result.Ok(54).expectMap((x) => x));
expectType<SyncResult<string>>(Result.Ok(54).expectMap((x) => x.toString()));
expectType<SyncResult<number>>(Result.Ok(54).expectMap((x) => 54));
expectType<SyncResult<number | string>>(Result.Ok(54).expectMap((x) => 'hello' as number | string));
expectType<SyncResult<number | string>>(Result.Ok(54).expectMap((x) => 'hello' as number | string | null | undefined));
expectType<Result<any>>(Result.Ok(54).expectMap((x) => 'hello' as any));
expectType<Result<any>>(Result.Ok(54).expectMap((x) => 'hello' as unknown));
expectType<SyncResult<string>>(Result.Ok(54).expectMap((x) => Optional.Some('hello')));
expectType<SyncResult<number>>(Result.Ok(54).expectMap((x) => Result.Ok(54)));
expectType<SyncResult<string>>(Result.Ok(54).expectMap(() => Result.Ok('test')));
expectType<AsyncResult<string>>(Result.Ok(54).expectMap((x) => Promise.resolve('hello')))
expectType<AsyncResult<number | string>>(Result.Ok(54).expectMap(() => Promise.resolve('hello') as PromiseLike<number | string | undefined | null>))
expectType<AsyncResult<number>>(Result.Ok(54).expectMap(() => Result.Pending(Promise.resolve(54))))

// map
expectType<SyncResult<undefined>>(Result.Ok(54).map((x) => undefined));
expectType<SyncResult<null>>(Result.Ok(54).map((x) => null));
expectType<SyncResult<number>>(Result.Ok(54).map(() => 54));
expectType<SyncResult<string>>(Result.Ok(54).map(() => 'test'));
expectType<SyncResult<number | string>>(Result.Ok(54).map(() => 'test' as number | string));
expectType<SyncResult<number | string | undefined>>(Result.Ok(54).map(() => 'test' as number | string | undefined));
expectType<Result<any>>(Result.Ok(54).map(() => 'test' as any));
expectType<Result<any>>(Result.Ok(54).map(() => 'test' as unknown));
expectType<SyncResult<SyncResult<string>>>(Result.Ok(54).map(() => Result.Ok('test')));
expectType<AsyncResult<number>>(Result.Ok(54).map(() => Promise.resolve(54)))

// flatMap
expectType<SyncResult<never>>(Result.Ok(54).flatMap((x) => undefined));
expectType<SyncResult<never>>(Result.Ok(54).flatMap((x) => null));
expectType<SyncResult<number>>(Result.Ok(54).flatMap(() => 54));
expectType<SyncResult<string>>(Result.Ok(54).flatMap(() => 'test'));
expectType<SyncResult<number | string>>(Result.Ok(54).flatMap(() => 'test' as number | string));
expectType<SyncResult<number | string>>(Result.Ok(54).flatMap(() => 'test' as number | string | null | undefined));
expectType<Result<any>>(Result.Ok(54).flatMap(() => 'test' as any));
expectType<Result<any>>(Result.Ok(54).flatMap(() => 'test' as unknown));
expectType<SyncResult<string>>(Result.Ok(54).flatMap(() => Result.Ok('test')));
expectType<AsyncResult<number>>(Result.Ok(54).flatMap(() => Promise.resolve(54)))

// abortOnError
expectType<SyncResult<number>>(Result.Ok(54).abortOnError());
expectType<AsyncResult<number>>(Result.expect(Promise.resolve(54)).abortOnError());

// abortOnErrorWith
expectType<SyncResult<number>>(Result.Ok(54).abortOnErrorWith('some error'));
expectType<AsyncResult<number>>(Result.expect(Promise.resolve(54)).abortOnErrorWith('some error'));

// asynchronous
expectType<AsyncResult<number>>(Result.Ok(54).asynchronous());
expectType<AsyncResult<number>>(Result.expect(Promise.resolve(54)).asynchronous());

// mapError
expectType<SyncResult<number>>(Result.Ok(54).mapError((x) => 'test'));
expectType<AsyncResult<number>>(Result.Ok(54).mapError(async (x) => 'test'));

// tapError
expectType<SyncResult<number>>(Result.Ok(54).tapError((x) => 'test'));
expectType<AsyncResult<number>>(Result.Ok(54).tapError(async (x) =>'hello'));

// recover
expectType<SyncResult<string | number>>(Result.Ok(54).recover((x) => 'test'));
expectType<AsyncResult<string | number>>(Result.Ok(54).recover(async (x) => 'test'));

// recoverWhen
expectType<SyncResult<string | number>>(Result.Ok(54).recoverWhen((x) => true, (x) => 'test'));
expectType<AsyncResult<string | number>>(Result.Ok(54).recoverWhen(async (x) => true, async (x) => 'test'));

// replace
expectType<SyncResult<string>>(Result.Ok(54).replace('test'));
expectType<AsyncResult<string>>(Result.Ok(54).replace(Promise.resolve('test')));

// satisfies
expectType<boolean>(Result.Ok(54).satisfies((x): x is number => typeof x === 'number'));
expectType<Promise<boolean>>(Result.Ok(54).satisfies(async (x) => true));

// valueEquals
expectType<boolean>(Result.Ok(54).valueEquals(54));

// reject
expectType<SyncResult<number>>(Result.Ok(54).reject((x) => false));
expectType<AsyncResult<number>>(Result.Ok(54).reject(async (x) => false));

// toOptional
expectType<Optional<number>>(Result.Ok(54).toOptional());
expectType<Optional<string>>(Result.Ok('test').toOptional());
expectType<Promise<Optional<number>>>(Result.expect(Promise.resolve(45)).toOptional());

// toPromise
expectType<Promise<number>>(Result.Ok(54).toPromise());
expectType<Promise<string>>(Result.Ok('test').toPromise());
expectType<Promise<number>>(Result.expect(Promise.resolve(45)).toPromise());

const object = {
  a: 1,
  b: 'test',
  c: undefined,
  d: null,
  e: Result.Ok(54),
  f: Optional.Some(54),
  g: Promise.resolve(54),
  h: { name: 'jack' },
  i: 'test' as string | undefined | null,
};

expectType<SyncResult<typeof object>>(Result.expect(object));

// property
expectType<SyncResult<number>>(Result.expect(object).property('a'));
expectType<SyncResult<undefined>>(Result.expect(object).property('c'));
expectType<SyncResult<null>>(Result.expect(object).property('d'));
expectType<SyncResult<SyncResult<number>>>(Result.expect(object).property('e'));
expectType<SyncResult<Optional<number>>>(Result.expect(object).property('f'));
expectType<SyncResult<Promise<number>>>(Result.expect(object).property('g'));
expectType<SyncResult<{ name: string }>>(Result.expect(object).property('h'));
expectType<SyncResult<string | undefined | null>>(Result.expect(object).property('i'));

// expectProperty
expectType<SyncResult<number>>(Result.expect(object).expectProperty('a'));
expectType<SyncResult<never>>(Result.expect(object).expectProperty('c'));
expectType<SyncResult<never>>(Result.expect(object).expectProperty('d'));
expectType<SyncResult<SyncResult<number>>>(Result.expect(object).expectProperty('e'));
expectType<SyncResult<number>>(Result.expect(object).expectProperty('f'));
expectType<SyncResult<{ name: string }>>(Result.expect(object).expectProperty('h'));
expectType<SyncResult<string>>(Result.expect(object).expectProperty('i'));
expectType<SyncResult<any>>(Result.expect(object).expectProperty('i' as any));

expectError<SyncResult>(Result.expect(object).property('iyy'));
expectError<SyncResult>(Result.expect(object).property('i' as unknown));

expectError<SyncResult>(Result.expect(object).expectProperty('iyy'));
expectError<SyncResult>(Result.expect(object).expectProperty('i' as unknown));

// ---------------------------------------------
// Result generated functions
// ---------------------------------------------
expectType<SyncResult<number>>(Result.expect(54));

// get
expectType<number>(Result.get(Result.Ok(54)));
expectType<Promise<number>>(Result.get(Result.expect(Promise.resolve(54))));

// getOrElse
expectAssignable<number | string>(Result.getOrElse('test', Result.Ok(54)));
expectAssignable<number | string>(Result.getOrElse('test')(Result.Ok(54)));

expectAssignable<Promise<number | string>>(Result.getOrElse('test', Result.expect(Promise.resolve(54))));
expectAssignable<Promise<number | string>>(Result.getOrElse('test')(Result.expect(Promise.resolve(54))));

// tap
expectType<SyncResult<number>>(Result.tap((x) => x, Result.Ok(54)));

// !Fixme: Type inference is not working
// expectType<SyncResult<number>>(Result.tap((x) => x)(Result.Ok(54)));

// filter
expectType<SyncResult<number>>(Result.filter((x) => x > 0, Result.Ok(54)));

// !Fixme: Type inference is not working
// expectType<SyncResult<number>>(Result.filter((x) => x > 0)(Result.Ok(54)));

// expectMap
expectType<SyncResult<string>>(Result.expectMap((x) => 'test', Result.Ok(54)));
expectType<SyncResult<string>>(Result.expectMap((x: number) => 'test')(Result.Ok(55)));
expectType<AsyncResult<string>>(Result.expectMap((x) => Promise.resolve('test'), Result.Ok(54)));
// expectType<AsyncResult<string>>(Result.expectMap((x) => Promise.resolve('test'))(Result.Ok(54)));

expectType<SyncResult<string>>(Result.expectMap((x: number) => 'test')(Result.Ok(54)));
expectType<AsyncResult<string>>(Result.expectMap((x: number) => Promise.resolve('test'))(Result.Ok(54)));

// map
expectType<SyncResult<string>>(Result.map((x) => 'test', Result.Ok(54)));
// expectType<SyncResult<string>>(Result.map((x) => 'test')(Result.Ok(54)));
expectType<AsyncResult<string>>(Result.map((x) => Promise.resolve('test'), Result.Ok(54)));
// expectType<AsyncResult<string>>(Result.map((x) => Promise.resolve('test'))(Result.Ok(54)));

expectType<SyncResult<string>>(Result.map((x: number) => 'test')(Result.Ok(54)));
expectType<AsyncResult<string>>(Result.map((x: number) => Promise.resolve('test'))(Result.Ok(54)));

// flatMap
expectType<SyncResult<string>>(Result.flatMap((x) => Result.Ok('test'), Result.Ok(54)));
// expectType<SyncResult<string>>(Result.flatMap((x) => Result.Ok('test'))(Result.Ok(54)));
expectType<AsyncResult<string>>(Result.flatMap((x) => Promise.resolve(Result.Ok('test')), Result.Ok(54)));
// expectType<AsyncResult<string>>(Result.flatMap((x) => Promise.resolve(Result.Ok('test')))(Result.Ok(54)));

expectType<SyncResult<string>>(Result.flatMap((x: number) => Result.Ok('test'))(Result.Ok(54)));
expectType<AsyncResult<string>>(Result.flatMap((x: number) => Promise.resolve(Result.Ok('test')))(Result.Ok(54)));

// property
expectType<SyncResult<number>>(Result.property('a', Result.expect(object)));
expectType<SyncResult<any>>(Result.property('a')(Result.expect(object)));
expectType<AsyncResult<number>>(Result.property('a', Result.expect(Promise.resolve(object))));
expectType<AsyncResult<any>>(Result.property('a')(Result.expect(Promise.resolve(object))));

expectType<SyncResult<number>>(Result.property<typeof object>('a')(Result.expect(object)));

expectError<SyncResult<number>>(Result.property<typeof object>('ii', Result.expect(object)));
expectError<SyncResult<number>>(Result.property<typeof object>('ii')(Result.expect(object)));
expectError<SyncResult<number>>(Result.property<typeof object>('i')(Result.expect({ a: 5 })));

// expectProperty
expectType<SyncResult<number>>(Result.expectProperty('a', Result.expect(object)));
expectType<SyncResult<any>>(Result.expectProperty('a')(Result.expect(object)));
expectType<AsyncResult<number>>(Result.expectProperty('a', Result.expect(Promise.resolve(object))));
expectType<AsyncResult<any>>(Result.expectProperty('a')(Result.expect(Promise.resolve(object))));

expectType<SyncResult<number>>(Result.expectProperty<typeof object>('a')(Result.expect(object)));

expectError<SyncResult<number>>(Result.expectProperty<typeof object>('ii', Result.expect(object)));
expectError<SyncResult<number>>(Result.expectProperty<typeof object>('ii')(Result.expect(object)));
expectError<SyncResult<number>>(Result.expectProperty<typeof object>('i')(Result.expect({ a: 5 })));

// abortOnError
expectType<SyncResult<number>>(Result.abortOnError(Result.Ok(54)));
expectType<AsyncResult<number>>(Result.abortOnError(Result.expect(Promise.resolve(54))));

// abortOnErrorWith
expectType<SyncResult<number>>(Result.abortOnErrorWith((err) => 'my Error', Result.Ok(54)));
expectType<SyncResult<number>>(Result.abortOnErrorWith((err) => 'my Error')(Result.Ok(54)));

expectType<AsyncResult<number>>(Result.abortOnErrorWith((err) => 'my Error', Result.expect(Promise.resolve(54))));
expectType<AsyncResult<number>>(Result.abortOnErrorWith((err) => 'my Error')(Result.expect(Promise.resolve(54))));

// asynchronous
expectType<AsyncResult<number>>(Result.asynchronous(Result.Ok(54)));
expectType<AsyncResult<number>>(Result.asynchronous(Result.expect(Promise.resolve(54))));

// mapError
expectType<SyncResult<number>>(Result.mapError((err) => 'my Error', Result.Ok(54)));
// expectType<SyncResult<number>>(Result.mapError((err) => 'my Error')(Result.Ok(54)));

expectType<AsyncResult<number>>(Result.mapError((err) => 'my Error', Result.expect(Promise.resolve(54))));
// expectType<AsyncResult<number>>(Result.mapError((err) => 'my Error')(Result.expect(Promise.resolve(54))));

// tapError
expectType<SyncResult<number>>(Result.tapError((err) => 'my Error', Result.Ok(54)));
// expectType<SyncResult<number>>(Result.tapError((err) => 'my Error')(Result.Ok(54)));

expectType<AsyncResult<number>>(Result.tapError((err) => 'my Error', Result.expect(Promise.resolve(54))));
// expectType<AsyncResult<number>>(Result.tapError((err) => 'my Error')(Result.expect(Promise.resolve(54))));

// recover
expectType<SyncResult<number | string>>(Result.recover((err) => 'test', Result.Ok(54)));
// expectType<SyncResult<number | string>>(Result.recover((err) => 'test')(Result.Ok(54)));

expectType<AsyncResult<number | string>>(Result.recover((err) => 'test', Result.expect(Promise.resolve(54))));
// expectType<AsyncResult<number | string>>(Result.recover((err) => 'test')(Result.expect(Promise.resolve(54))));

// recoverWhen
expectType<SyncResult<number | string>>(Result.recoverWhen((err) => true, (err) => 'test', Result.Ok(54)));
expectType<SyncResult<number | string>>(Result.recoverWhen<number, string>((err) => true, (err) => 'test')(Result.Ok(54)));
expectType<SyncResult<number | string>>(Result.recoverWhen((err: number) => true, (err) => 'test')(Result.Ok(54)));
expectType<SyncResult<any>>(Result.recoverWhen((err) => true, (err) => 'test')(Result.Ok(54)));

expectType<AsyncResult<number | string>>(Result.recoverWhen((err) => true, (err) => 'test', Result.expect(Promise.resolve(54))));
expectType<AsyncResult<number | string>>(Result.recoverWhen((err: number) => true, (err) => 'test')(Result.expect(Promise.resolve(54))));
expectType<AsyncResult<any>>(Result.recoverWhen((err) => true, (err) => 'test')(Result.expect(Promise.resolve(54))));

// replace
expectType<SyncResult<string>>(Result.replace('test', Result.Ok(54)));
// expectType<SyncResult<string>>(Result.replace('test')(Result.Ok(54)));

expectType<AsyncResult<string>>(Result.replace('test', Result.expect(Promise.resolve(54))));
// expectType<AsyncResult<string>>(Result.replace('test')(Result.expect(Promise.resolve(54))));

// satisfies
expectType<boolean>(Result.satisfies((x) => x > 5, Result.Ok(54)));
expectType<boolean>(Result.satisfies((x) => x > 5)(Result.Ok(54)));
expectError<boolean>(Result.satisfies<number>((x) => x > 5)(Result.Ok('test')));

// valueEquals
expectType<boolean>(Result.valueEquals(54, Result.Ok(120)));
expectType<Promise<boolean>>(Result.valueEquals(54, Result.expect(Promise.resolve(120))));

// reject
expectType<SyncResult<number>>(Result.reject((x) => false, Result.Ok(54)));
expectType<SyncResult<number>>(Result.reject<number>((x) => false)(Result.Ok(54)));

expectType<AsyncResult<number>>(Result.reject((x) => false, Result.expect(Promise.resolve(54))));
expectType<AsyncResult<number>>(Result.reject<number>((x) => false)(Result.expect(Promise.resolve(54))));

// expectType<SyncResult<any>>(Result.reject((x) => false)(Result.Ok(54)));
expectType<SyncResult<number>>(Result.reject((x: number) => false)(Result.Ok(54)));
expectError<SyncResult<number>>(Result.reject<number>((x) => false)(Result.Ok('test')));

// toOptional
expectType<Optional<number>>(Result.toOptional(Result.Ok(54)));

// toPromise
expectType<Promise<number>>(Result.toPromise(Result.Ok(54)));
