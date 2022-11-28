import { expectType, expectAssignable, expectError } from 'tsd';

import { Optional, Result, AsyncResult, SyncResult } from '../../lib/index';

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

expectType<SyncResult<number>>(Result.expect(54))
expectType<SyncResult<number | string>>(Result.expect(54 as number | string))
expectType<SyncResult<string>>(Result.expect('test'))
expectType<SyncResult<any>>(Result.expect('test' as any))
expectType<SyncResult<any>>(Result.expect('test' as unknown))
expectType<SyncResult<string>>(Result.expect('test' as string | undefined | null))
expectType<SyncResult<number>>(Result.expect(Optional.Some(54)))
expectType<SyncResult<number>>(Result.expect(Result.Ok(54)))
expectType<AsyncResult<number>>(Result.expect(Promise.resolve(54)))
expectType<AsyncResult<number | string>>(Result.expect(Promise.resolve(54) as PromiseLike<number | string | undefined | null>))
expectType<AsyncResult<number>>(Result.expect(Result.Pending(Promise.resolve(54))))

expectType<number>(Result.Ok(54).get())
expectType<any>(Result.Error().get())
expectType<any>(Result.Aborted().get())
expectType<Promise<number>>(Result.Pending(Promise.resolve(44)).get())

expectType<number | undefined>(Result.Ok(54).getOrElse(undefined))
expectType<number | 'test'>(Result.Ok(54).getOrElse('test'))
expectType<any>(Result.Error().getOrElse(44))
expectType<any>(Result.Aborted().getOrElse(44))
expectType<Promise<number> | Promise<string>>(Result.Pending(Promise.resolve(44)).getOrElse('test'))

expectAssignable<Result<number>>(Result.Ok(54).filter((x) => x > 0));
expectAssignable<Result<string>>(Result.Ok('test').filter((x) => x.length > 0));
expectAssignable<Result<string | number>>(Result.Ok('test' as string | number).filter((x) => typeof x === 'string'));
expectAssignable<Result<string>>(Result.Ok('test' as string | number).filter((x): x is string => typeof x === 'string'));

expectType<SyncResult<never>>(Result.Ok(54).expectMap((x) => undefined));
expectType<SyncResult<never>>(Result.Ok(54).expectMap((x) => null));
expectType<SyncResult<number>>(Result.Ok(54).expectMap((x) => x));
expectType<SyncResult<string>>(Result.Ok(54).expectMap((x) => x.toString()));
expectType<SyncResult<number>>(Result.Ok(54).expectMap((x) => 54));
expectType<SyncResult<number | string>>(Result.Ok(54).expectMap((x) => 54 as number | string));
expectType<SyncResult<number | string>>(Result.Ok(54).expectMap((x) => 54 as number | string | null | undefined));
expectType<SyncResult<any>>(Result.Ok(54).expectMap((x) => 54 as any));
expectType<SyncResult<any>>(Result.Ok(54).expectMap((x) => 54 as unknown));
expectType<SyncResult<number>>(Result.Ok(54).expectMap((x) => Optional.Some(54)));
expectType<SyncResult<number>>(Result.Ok(54).expectMap((x) => Result.Ok(54)));
expectType<SyncResult<string>>(Result.Ok(54).expectMap(() => Result.Ok('test')));
expectType<AsyncResult<number>>(Result.Ok(54).expectMap((x) => Promise.resolve(54)))
expectType<AsyncResult<number | string>>(Result.Ok(54).expectMap(() => Promise.resolve(54) as PromiseLike<number | string | undefined | null>))
expectType<AsyncResult<number>>(Result.Ok(54).expectMap(() => Result.Pending(Promise.resolve(54))))

expectType<SyncResult<undefined>>(Result.Ok(54).map((x) => undefined));
expectType<SyncResult<null>>(Result.Ok(54).map((x) => null));
expectType<SyncResult<number>>(Result.Ok(54).map(() => 54));
expectType<SyncResult<string>>(Result.Ok(54).map(() => 'test'));
expectType<SyncResult<number | string>>(Result.Ok(54).map(() => 'test' as number | string));
expectType<SyncResult<number | string | undefined>>(Result.Ok(54).map(() => 'test' as number | string | undefined));
expectType<SyncResult<any>>(Result.Ok(54).map(() => 'test' as any));
expectType<SyncResult<any>>(Result.Ok(54).map(() => 'test' as unknown));
expectType<SyncResult<SyncResult<string>>>(Result.Ok(54).map(() => Result.Ok('test')));
expectType<AsyncResult<number>>(Result.Ok(54).map(() => Promise.resolve(54)))

expectType<SyncResult<never>>(Result.Ok(54).flatMap((x) => undefined));
expectType<SyncResult<never>>(Result.Ok(54).flatMap((x) => null));
expectType<SyncResult<number>>(Result.Ok(54).flatMap(() => 54));
expectType<SyncResult<string>>(Result.Ok(54).flatMap(() => 'test'));
expectType<SyncResult<number | string>>(Result.Ok(54).flatMap(() => 'test' as number | string));
expectType<SyncResult<number | string>>(Result.Ok(54).flatMap(() => 'test' as number | string | null | undefined));
expectType<SyncResult<any>>(Result.Ok(54).flatMap(() => 'test' as any));
expectType<SyncResult<any>>(Result.Ok(54).flatMap(() => 'test' as unknown));
expectType<SyncResult<string>>(Result.Ok(54).flatMap(() => Result.Ok('test')));
expectType<AsyncResult<number>>(Result.Ok(54).flatMap(() => Promise.resolve(54)))

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

expectType<SyncResult<number>>(Result.expect(object).property('a'));
expectType<SyncResult<undefined>>(Result.expect(object).property('c'));
expectType<SyncResult<null>>(Result.expect(object).property('d'));
expectType<SyncResult<SyncResult<number>>>(Result.expect(object).property('e'));
expectType<SyncResult<Optional<number>>>(Result.expect(object).property('f'));
expectType<SyncResult<Promise<number>>>(Result.expect(object).property('g'));
expectType<SyncResult<{ name: string }>>(Result.expect(object).property('h'));
expectType<SyncResult<string | undefined | null>>(Result.expect(object).property('i'));

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
