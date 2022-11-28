/* global describe, it */

import { expect } from 'chai';

import { Optional } from '../src/index';

import { OkClass, Result, PendingClass } from '../src/result/index'

import Exception from '../src/utils/exception';
import { constant, identity } from '../src/utils/utils';

const { Ok, Error: ErrorResult, Aborted, Pending } = Result;
const { Some, None } = Optional;

const increment = (n: number) => n + 1;
const asyncIncrement = async (n: number) => n + 1;

process.on('unhandledRejection', (reason) => {
  console.log(`Uncaught error: ${reason}`);
});

describe('The Result type', () => {
  describe('The Ok subtype', () => {
    it('should have the proper flags', () => {
      const ok = Ok();

      expect(ok.isResultInstance).to.equal(true);
      expect(ok.isAsynchronous).to.equal(false);
      expect(ok.isAborted).to.equal(false);
      expect(ok.isError).to.equal(false);
      expect(ok.isOk).to.equal(true);
    });

    describe('satisfies(predicate)', () => {
      it('should return true when the wrapped value satisfies the passed predicate', () => {
        expect(Ok(3).satisfies((x: number) => x === 3)).to.equal(true);
      });

      it('should return false when the wrapped value does not satisfy the passed predicate', () => {
        expect(Ok(3).satisfies((x: number) => x === 2)).to.equal(false);
      });

      it('should return Boolean results', () => {
        expect(Ok(2).satisfies((x: any) => x)).to.equal(true);
        expect(Ok(0).satisfies((x: any) => x)).to.equal(false);
        expect(ErrorResult().satisfies((x: any) => x)).to.equal(false);
        expect(Aborted().satisfies((x: any) => x)).to.equal(false);
      });
    });

    describe('valueEquals(value)', () => {
      it('should return true when the wrapped value equals `value`', () => {
        expect(Ok(3).valueEquals(3)).to.equal(true);
      });

      it('should return false when the wrapped value does not equal `value`', () => {
        expect(Ok(3).valueEquals(2)).to.equal(false);
      });
    });

    describe('property(propertyName)', () => {
      it('should return the requested property of the wrapped value', () => {
        const ok = Ok({ a: 2 }) as OkClass<any>;

        expect(ok.property('a').getOrElse(ok.value.a + 1)).to.equal(ok.value.a);
      });
    });

    describe('expectProperty(propertyName)', () => {
      it('should return a Ok with the right value if the wrapped value has an property named `propertyName` that is 0, "" or NaN', () => {
        const ok1 = Ok({ a: NaN }) as OkClass<any>;
        const ok2 = Ok({ a: '' }) as OkClass<any>;
        const ok3 = Ok({ a: 0 }) as OkClass<any>;

        expect(ok1.expectProperty('a').isOk).to.equal(true);
        expect(ok2.expectProperty('a').isOk).to.equal(true);
        expect(ok3.expectProperty('a').isOk).to.equal(true);

        expect((<any>ok2.expectProperty('a')).value).to.equal(ok2.value.a);
        expect((<any>ok3.expectProperty('a')).value).to.equal(ok3.value.a);
        expect(isNaN((<any>ok1.expectProperty('a')).value)).to.equal(true);
      });

      it('should return a Ok with the right value if the wrapped value has an expectable property named `propertyName` that is a OK', () => {
        const ok = Ok({ a: Ok(2) }) as OkClass<any>;

        expect(ok.expectProperty('a').getOrElse(ok.value.a.value + 1)).to.equal(ok.value.a.value);
      });

      it('should return a None if the wrapped value does not have a Some named `propertyName`', () => {
        const ok = Ok({});
        
        expect((ok as any).expectProperty('a').isError).to.equal(true);
      });
    });

    describe('expectMap(λ)', () => {
      it('should return a Ok with the right value when applying the wrapped value to λ returns a Ok expectable value', () => {
        const value = 2;

        expect(Ok().expectMap(constant(value))
          .getOrElse(value + 1)).to.equal(value);
      });

      it('should return a None when applying λ to the wrapped value returns a non-Ok expectable value', () => {
        expect(Ok().expectMap(constant(null)).isError).to.equal(true);
      });
    });

    describe('tap(λ)', () => {
      it('should return an equivalent Ok instance and pass λ its value', () => {
        const value = 3;

        let called = false;

        const ok = Ok(value);


        const transformed = ok.tap(() => {
          called = true;

          return value + 1;
        });

        expect(called).to.equal(true);
        expect(ok === transformed).to.equal(true);

        expect(ok.merge()).to.equal(value);
        expect(transformed.merge()).to.equal(value);
      });

      it('should catch exceptions thrown in the callback and return an Aborted', () => {
        const expected = 4;

        const result = Ok().tap(() => {
          throw expected;
        });

        expect(result.isError).to.equal(true);
        expect(result.isAborted).to.equal(true);
        expect(result.merge()).to.equal(expected);
      });

      it('should return a Pending wrapping an Ok if λ is asynchronous', done => {
        const expected = 4;

        const result = Ok(expected).tap(asyncIncrement);

        expect(result.isAsynchronous).to.equal(true);

        result
          .toPromise()
          .catch(() => Promise.reject(new Exception('The promise is rejected')))
          .then((value: any) => {
            expect(value).to.equal(expected);
          })
          .then(done, done);
      });

      it('should return a Pending wrapping an Aborted if λ throws asynchronously', done => {
        const result = Ok().tap(constant(Promise.reject(new Exception('Async error'))));

        expect(result.isAsynchronous).to.equal(true);

        result
          //@ts-ignore Must access a private property
          .promise
          .then((wrappedResult: any) => {
            expect(wrappedResult.isError).to.equal(true);
            expect(wrappedResult.isAborted).to.equal(true);
            expect(wrappedResult.isResultInstance).to.equal(true);
          })
          .then(done, done);
      });
    });

    describe('tapError(λ)', () => {
      it('should return an Ok()', () => {
        expect(Ok(0).tapError(increment).isOk).to.equal(true);
      });
    });

    describe('map(λ)', () => {
      it('should return a new Ok instance holding the value of λ for the value of the Ok instance', () => {
        const value = 3;

        const ok = Ok(value);

        const transformed = ok.map(increment);

        expect(ok !== transformed).to.equal(true);
        expect(transformed.merge()).to.equal(increment(value));
      });

      it('should catch exceptions thrown in the map callback and return an Aborted', () => {
        const expected = 4;

        const result = Ok().map(() => {
          throw expected;
        });

        expect(result.isError).to.equal(true);
        expect(result.isAborted).to.equal(true);
        expect(result.merge()).to.equal(expected);
      });

      it('should return a Pending wrapping an Ok if λ is asynchronous', done => {
        const expected = 4;

        const result = Ok(expected).map(asyncIncrement);

        expect(result.isAsynchronous).to.equal(true);

        result
          .toPromise()
          .catch(() => Promise.reject(new Exception('The promise is rejected')))
          .then((value: any) => {
            expect(value).to.equal(increment(expected));
          })
          .then(done, done);
      });

      it('should return a Pending wrapping an Aborted if λ throws asynchronously', done => {
        const result = Ok().map(constant(Promise.reject(new Exception('Async error'))));

        expect(result.isAsynchronous).to.equal(true);

        result
          //@ts-ignore Must access a private property
          .promise
          .then((wrappedResult: any) => {
            expect(wrappedResult.isError).to.equal(true);
            expect(wrappedResult.isAborted).to.equal(true);
            expect(wrappedResult.isResultInstance).to.equal(true);
          })
          .then(done, done);
      });
    });

    describe('replace(value)', () => {
      it('should return a new Ok instance holding the passed value', () => {
        const value = 3;

        const ok = Ok(value).replace(value + 1);

        expect(ok.merge()).to.equal(value + 1);
      });

      it('should catch exceptions for async values and return an Aborted', async () => {
        const expected = 4;

        const result = Ok().replace(Promise.reject(expected));

        const isAborted = await result.match({
          Aborted: constant(true),
          Error: constant(false),
          Ok: constant(false)
        });

        expect(isAborted).to.equal(true);
        expect(await result.merge()).to.equal(expected);
      });

      it('should return a Pending wrapping an Ok with the new value for async values', async () => {
        const initial = 2;
        const expected = 3;

        const result = Ok(initial).replace(Promise.resolve(expected));

        expect(result.isAsynchronous).to.equal(true);

        const value = await result.match({ Ok: identity });

        expect(value).to.equal(expected);
      });
    });

    describe('mapError(λ)', () => {
      it('should return an equivalent Ok', () => {
        const value = 3;

        const ok = Ok(value);

        const transformed = ok.mapError(increment);

        expect(transformed.merge()).to.equal(value);
      });
    });

    describe('abortOnErrorWith(λOrValue)', () => {
      it('should return an equivalent Ok', () => {
        const value = 3;

        const ok = Ok(value);

        const transformed = ok.mapError(increment);

        expect(transformed.merge()).to.equal(value);
      });
    });

    describe('recover(λ)', () => {
      it('should return an equivalent Ok', () => {
        const value = 3;

        const ok = Ok(value);

        const transformed = ok.recover(increment);

        expect(transformed.merge()).to.equal(value);
      });
    });

    describe('recoverWhen(predicate, λ)', () => {
      it('should return an equivalent Ok', () => {
        const value = 3;

        const ok = Ok(value);

        const transformed = ok.recoverWhen(increment, increment);

        expect(transformed.merge()).to.equal(value);
      });

      it('should not call the lambda if the predicate evaluates to false', () => {
        let lambdaCalled = false;

        const value = 10;

        const error = ErrorResult(value);

        const transformed = error.recoverWhen(constant(false), () => {
          lambdaCalled = true;
        });

        expect(lambdaCalled).to.equal(false);
        expect(transformed.merge()).to.equal(value);
      });
    });

    describe('flatMap(λ)', () => {
      it('should pass the Ok value to an asynchronous λ and pass the output through Result.expect() except if λ throws or returns a rejected promise', done => {
        const instances = [
          null,
          3,
          Promise.resolve(1),
          Some(5),
          None(),
          Ok(9),
          ErrorResult(6),
          Aborted(3),
          Pending(Promise.resolve(Ok(4)))
        ];

        Promise
          .all(instances.map(instance => {
            return (Ok()
              .flatMap(constant(instance))
              .asynchronous() as PendingClass<any>)
              .promise
              .then(outputInstance => {
                return (<any>Result
                  .expect(instance)
                  .asynchronous())
                  .promise
                  .then((throughExpect: any) => {
                    expect(JSON.stringify(outputInstance)).to.equal(JSON.stringify(throughExpect));
                  });
              });
          }))
          .then(constant(undefined))
          .then(done, done);
      });

      it('should be a Pending wrapping an Aborted if λ throws or returns a rejected promise', done => {
        const cases = [
          () => { throw new Exception('test'); },
          () => Promise.reject(new Exception('Async error'))
        ];

        Promise
          .all(cases.map(λ => {
            return (Ok()
              .flatMap(λ)
              .asynchronous() as PendingClass<any>)
              .promise
              .then(outputInstance => {
                expect(outputInstance.isResultInstance).to.equal(true);
                expect(outputInstance.isAborted).to.equal(true);
                expect(outputInstance.isError).to.equal(true);
              }, console.log.bind(console));
          }))
          .then(constant(undefined))
          .then(done, done);
      });
    });

    describe('filter(λ)', () => {
      it('should return an equivalent Ok if the predicate is true when passed the Ok value', () => {
        const value = 3;

        const ok = Ok(value).filter((n: number) => n === value);

        expect(ok.isOk).to.equal(true);
        expect(ok.merge()).to.equal(value);
      });

      it('should return an Error if the predicate is false when passed the Ok value', () => {
        const value = 3;

        const ok = Ok(value).filter((n: number) => n !== value);

        expect(ok.isError).to.equal(true);
      });

      it('should return a Pending wrapping an Ok if the predicate is true asynchronously', done => {
        const expected = 4;

        const result = Ok(0).filter(async () => true);

        expect(result.isAsynchronous).to.equal(true);

        result.map(increment)
          .match({ Ok: constant(expected), Error: constant(increment(expected)) });

        result
          .map(increment)
          .match({
            Ok: constant(expected),
            Error: constant(increment(expected))
          })
          .then((value: any) => {
            expect(value).to.equal(expected);
          })
          .then(done, done);
      });

      it('should return a Pending wrapping an Aborted if λ throws asynchronously', done => {
        const expected = 4;

        const result = Ok().filter(constant(Promise.reject(expected)));

        expect(result.isAsynchronous).to.equal(true);

        result
          //@ts-ignore Must access a private property
          .promise
          .then((wrappedResult: { isResultInstance: any; isAborted: any; error: any; isError: any; }) => {
            expect(wrappedResult.isResultInstance).to.equal(true);
            expect(wrappedResult.isAborted).to.equal(true);
            // @ts-ignore Must access a private property
            expect(wrappedResult.error).to.equal(expected);
            expect(wrappedResult.isError).to.equal(true);
            expect(wrappedResult.isError).to.equal(true);
          })
          .then(done, done);
      });
    });

    describe('reject(λ)', () => {
      it('should return an equivalent Ok if the predicate is false when passed the Ok value', () => {
        const value = 3;

        const ok = Ok(value).reject((n: number) => n !== value);

        expect(ok.isOk).to.equal(true);
        expect(ok.merge()).to.equal(value);
      });

      it('should return an Error if the predicate is true when passed the Ok value', () => {
        const value = 3;

        const ok = Ok(value).reject((n: number) => n === value);

        expect(ok.isError).to.equal(true);
      });

      it('should return a Pending wrapping an Ok if the predicate is false asynchronously', done => {
        const expected = 4;

        const result = Ok(0).reject(async () => false);

        expect(result.isAsynchronous).to.equal(true);

        result
          .map(increment)
          .match({
            Ok: constant(expected),
            Error: constant(increment(expected))
          })
          .then((value: any) => {
            expect(value).to.equal(expected);
          })
          .then(done, done);
      });

      it('should return a Pending wrapping an Aborted if λ throws asynchronously', done => {
        const expected = 4;

        const result = Ok().reject(constant(Promise.reject(expected)));

        expect(result.isAsynchronous).to.equal(true);

        result
          //@ts-ignore Must access a private property
          .promise
          .then((wrappedResult: { isResultInstance: any; isAborted: any; error: any; isError: any; }) => {
            expect(wrappedResult.isResultInstance).to.equal(true);
            expect(wrappedResult.isAborted).to.equal(true);
            // @ts-ignore Must access a private property
            expect(wrappedResult.error).to.equal(expected);
            expect(wrappedResult.isError).to.equal(true);
            expect(wrappedResult.isError).to.equal(true);
          })
          .then(done, done);
      });
    });

    describe('merge()', () => {
      it('should unwrap Ok instances', () => {
        const value = 3;

        expect(Ok(value).merge()).to.equal(value);
      });
    });

    describe('getOrElse(value)', () => {
      it('should unwrap Ok instances', () => {
        const value = 3;

        expect(Ok(value).getOrElse(value + 1)).to.equal(value);
      });
    });

    describe('get()', () => {
      it('should unwrap Ok instances', () => {
        const value = 3;

        expect(Ok(value).get()).to.equal(value);
      });
    });

    describe('abortOnError()', () => {
      it('should return an equivalent Ok', () => {
        const expected = 3;

        const result = Ok(expected).abortOnError();

        expect(result.isOk).to.equal(true);
        expect(result.merge()).to.equal(expected);
      });
    });

    describe('match(callbacks)', () => {
      it('should execute callback.Ok if it exists', () => {
        const expected = 3;
        const other = 4;

        const returnValue = Ok(other).match({ Ok: () => expected });

        expect(returnValue).to.equal(expected);
      });

      it('should just return the Ok value when callbacks.Ok does not exist', () => {
        const expected = 3;
        const other = 4;

        const returnValue = Ok(expected).match({ Error: () => other });

        expect(returnValue).to.equal(expected);
      });
    });

    describe('toOptional()', () => {
      it('should transform the Ok into a Some', () => {
        const expected = 3;

        const optional = Ok(expected).toOptional();

        expect(optional.isOptionalInstance).to.equal(true);
        // @ts-ignore Must access a private property
        expect(optional.valuePresent).to.equal(true);
        expect(optional.get()).to.equal(expected);
      });
    });

    describe('toPromise()', () => {
      it('should transform the Ok into a resolved promise', done => {
        const expected = 3;

        const promise = Ok(expected).toPromise();

        expect(promise.then !== undefined).to.equal(true);

        promise
          .then(
            (            value: any) => {
              expect(value).to.equal(expected);
            },
            () => Promise.reject(new Exception('The promise is rejected'))
          )
          .then(done, done);
      });
    });

    describe('asynchronous()', () => {
      it('should transform the Ok into a pending resolved with the Ok', done => {
        const pending = Ok(0).asynchronous();

        expect(pending.isAsynchronous).to.equal(true);

        (pending as any)
          .promise
          .catch(ErrorResult)
          .then((value: { isOk: any; }) => {
            expect(value.isOk).to.equal(true);
          })
          .then(done, done);
      });
    });
  });

  describe('The Error subtype', () => {
    it('should have the proper flags', () => {
      const error = ErrorResult();

      expect(error.isResultInstance).to.equal(true);
      expect(error.isAsynchronous).to.equal(false);
      expect(error.isAborted).to.equal(false);
      expect(error.isError).to.equal(true);
      expect(error.isOk).to.equal(false);
    });

    describe('replace(value)', () => {
      it('should return synchronous errors', () => {
        const value = 5;

        expect(ErrorResult(value + 1).replace(value)
          .merge()).to.equal(value + 1);
        expect(ErrorResult(value + 1).replace(Promise.reject(value))
          .merge()).to.equal(value + 1);
      });
    });

    describe('satisfies(predicate)', () => {
      it('should always return false', () => {
        expect(ErrorResult(3).satisfies(() => false)).to.equal(false);
        expect(ErrorResult(3).satisfies(() => true)).to.equal(false);
      });
    });

    describe('valueEquals(value)', () => {
      it('should return false', () => {
        expect(ErrorResult(3).valueEquals(3)).to.equal(false);
      });
    });

    describe('expectMap(λ)', () => {
      it('should return an Error()', () => {
        expect(ErrorResult().expectMap(constant(2)).isError).to.equal(true);
      });
    });

    describe('property(propertyName)', () => {
      it('should return an Error()', () => {
        expect(ErrorResult().property('a').isError).to.equal(true);
      });
    });

    describe('expectProperty(propertyName)', () => {
      it('should return an Error()', () => {
        expect(ErrorResult().expectProperty('a').isError).to.equal(true);
      });
    });

    describe('get()', () => {
      const value = 3;

      try {
        ErrorResult(value).get();

        expect(false).to.equal(true);
      } catch (error) {
        expect(error).to.equal(value);
      }
    });

    describe('map(λ)', () => {
      it('should return an Error()', () => {
        expect(ErrorResult(0).map(increment).isError).to.equal(true);
      });
    });

    describe('tap(λ)', () => {
      it('should return an Error()', () => {
        expect(ErrorResult(0).tap(increment).isError).to.equal(true);
      });
    });

    describe('tapError(λ)', () => {
      it('should return an equivalent Error instance and pass λ its value', () => {
        const value = 3;

        let called = false;

        const error = ErrorResult(value);

        const transformed = error.tapError(() => {
          called = true;

          return value + 1;
        });

        expect(called).to.equal(true);
        expect(error === transformed).to.equal(true);

        expect(error.merge()).to.equal(value);
        expect(transformed.merge()).to.equal(value);
      });

      it('should catch exceptions thrown in the tapError callback and return an Aborted', () => {
        const expected = 4;

        const result = ErrorResult().tapError(() => {
          throw expected;
        });

        expect(result.isError).to.equal(true);
        expect(result.isAborted).to.equal(true);
        expect(result.merge()).to.equal(expected);
      });

      it('should return a Pending wrapping an Error if λ is asynchronous', done => {
        const expected = 4;

        const result = ErrorResult(expected).tapError(asyncIncrement);

        expect(result.isAsynchronous).to.equal(true);

        result
          .toPromise()
          .then(
            () => Promise.reject(new Exception('The promise is not rejected')),
            (            value: any) => { expect(value).to.equal(expected); }
          )
          .then(done, done);
      });

      it('should return a Pending wrapping an Aborted if λ throws asynchronously', done => {
        const result = ErrorResult().tapError(constant(Promise.reject()));

        expect(result.isAsynchronous).to.equal(true);

        result
          //@ts-ignore Must access a private property
          .promise
          .then((wrappedResult: { isError: any; isAborted: any; isResultInstance: any; }) => {
            expect(wrappedResult.isError).to.equal(true);
            expect(wrappedResult.isAborted).to.equal(true);
            expect(wrappedResult.isResultInstance).to.equal(true);
          })
          .then(done, done);
      });
    });

    describe('mapError(λ)', () => {
      it('should return a new Error instance holding the value of λ for the value of the Error instance', () => {
        const value = 3;

        const error = ErrorResult(value);

        const transformed = error.mapError(increment);

        expect(transformed.isOk).to.equal(false);
        expect(error !== transformed).to.equal(true);
        expect(transformed.merge()).to.equal(increment(value));
      });

      it('should catch exceptions thrown in the mapError callback and return an Aborted', () => {
        const expected = 4;

        const result = ErrorResult().mapError(() => {
          throw expected;
        });

        expect(result.isOk).to.equal(false);
        expect(result.isError).to.equal(true);
        expect(result.isAborted).to.equal(true);
        expect(result.merge()).to.equal(expected);
      });

      it('should return a Pending wrapping an Error if λ is asynchronous', done => {
        const expected = 4;

        const result = ErrorResult(expected).mapError(asyncIncrement);

        expect(result.isAsynchronous).to.equal(true);

        (result as any)
          .promise
          .then((value: { isError: any; isAborted: any; }) => {
            expect(value.isError).to.equal(true);
            expect(value.isAborted).to.equal(false);
          })
          .then(done, done);
      });

      it('should return a Pending wrapping an Aborted if λ throws asynchronously', done => {
        const result = ErrorResult().mapError(constant(Promise.reject()));

        expect(result.isAsynchronous).to.equal(true);

        result
          //@ts-ignore Must access a private property
          .promise
          .then((value: { isError: any; isAborted: any; }) => {
            expect(value.isError).to.equal(true);
            expect(value.isAborted).to.equal(true);
          })
          .then(done, done);
      });
    });

    describe('abortOnErrorWith(λOrValue)', () => {
      it('should return an Aborted instance holding the value of λ for the value of the Error instance if λOrValue is a function', () => {
        const value = 3;

        const error = ErrorResult(value);

        const transformed = error.abortOnErrorWith(increment);

        expect(transformed.isOk).to.equal(false);
        expect(transformed.isAborted).to.equal(true);
        expect(error !== transformed).to.equal(true);
        expect(transformed.merge()).to.equal(increment(value));
      });

      it('should catch exceptions λOrValue', () => {
        const expected = 4;

        const result = ErrorResult().abortOnErrorWith(() => {
          throw expected;
        });

        expect(result.isOk).to.equal(false);
        expect(result.isError).to.equal(true);
        expect(result.isAborted).to.equal(true);
        expect(result.merge()).to.equal(expected);
      });

      it('should wrap non-functions into Aborted', () => {
        const expected = 4;

        const aborted = ErrorResult().abortOnErrorWith(expected);

        expect(aborted.isResultInstance).to.equal(true);
        expect(aborted.merge()).to.equal(expected);
        expect(aborted.isAborted).to.equal(true);
        expect(aborted.isError).to.equal(true);
      });

      it('should return a Pending wrapping an Abored if λ throws asynchronously', done => {
        const expected = 4;

        const result = Ok().map(constant(Promise.reject(expected)));

        expect(result.isAsynchronous).to.equal(true);

        result
          .mapError(increment)
          .toPromise()
          .then(increment)
          .catch(identity)
          .then((value: any) => {
            expect(value).to.equal(expected);
          })
          .catch(identity)
          .then(() => done());
      });
    });

    describe('recover(λ)', () => {
      it('should return a new Ok instance holding the value of λ for the value of the Error instance', () => {
        const value = 3;

        const error = ErrorResult(value);

        const transformed = error.recover(increment);

        expect(transformed.isOk).to.equal(true);
        expect(error !== transformed).to.equal(true);
        expect(transformed.merge()).to.equal(increment(value));
      });

      it('should catch exceptions thrown in the mapError callback and return an Aborted', () => {
        const expected = 4;

        const result = ErrorResult().recover(() => {
          throw expected;
        });

        expect(result.isError).to.equal(true);
        expect(result.isAborted).to.equal(true);
        expect(result.merge()).to.equal(expected);
      });

      it('should return a Pending wrapping an Ok if λ is asynchronous', done => {
        const expected = 4;

        const result = ErrorResult(expected).recover(asyncIncrement);

        expect(result.isAsynchronous).to.equal(true);

        result
          .toPromise()
          .catch(increment)
          .then((value: any) => {
            expect(value).to.equal(increment(expected));
          })
          .catch(identity)
          .then(done);
      });

      it('should return a Pending wrapping an Aborted if λ throws asynchronously', done => {
        const expected = 4;

        const result = ErrorResult().recover(constant(Promise.reject(expected)));

        expect(result.isAsynchronous).to.equal(true);

        result
          //@ts-ignore Must access a private property
          .promise
          .then((wrappedResult: { isResultInstance: any; isAborted: any; error: any; isError: any; }) => {
            expect(wrappedResult.isResultInstance).to.equal(true);
            expect(wrappedResult.isAborted).to.equal(true);
            //@ts-ignore Must access a private property
            expect(wrappedResult.error).to.equal(expected);
            expect(wrappedResult.isError).to.equal(true);
            expect(wrappedResult.isError).to.equal(true);
          })
          .then(done, done);
      });
    });

    describe('flatMap(λ)', () => {
      it('should return an Error()', () => {
        expect(ErrorResult(0).flatMap(increment).isError).to.equal(true);
      });
    });

    describe('filter(λ)', () => {
      it('should return an Error()', () => {
        expect(ErrorResult().filter(constant(true)).isError).to.equal(true);
        expect(ErrorResult().filter(constant(false)).isError).to.equal(true);
      });
    });

    describe('reject(λ)', () => {
      it('should return an Error()', () => {
        expect(ErrorResult().reject(constant(true)).isError).to.equal(true);
        expect(ErrorResult().reject(constant(false)).isError).to.equal(true);
      });
    });

    describe('merge()', () => {
      it('should return the wrapped error', () => {
        const value = 3;

        expect(ErrorResult(value).merge()).to.equal(value);
      });
    });

    describe('getOrElse(value)', () => {
      it('should return `value`', () => {
        const value = 3;

        expect(ErrorResult(33).getOrElse(value)).to.equal(value);
      });
    });

    describe('abortOnError()', () => {
      it('should return an Aborted that holds the same error', () => {
        const expected = 3;

        const result = ErrorResult(expected).abortOnError();

        expect(result.isOk).to.equal(false);
        expect(result.isAborted).to.equal(true);
        expect(result.merge()).to.equal(expected);
      });
    });

    describe('match(callbacks)', () => {
      it('should execute callbacks.Error if it exists', () => {
        const expected = 3;

        expect(ErrorResult().match({ Error: constant(expected) })).to.equal(expected);
      });

      it('should just throw the wrapped error when the callbacks.Error callback does not exist', () => {
        const value = 3;

        try {
          ErrorResult(value).match({});

          expect(false).to.equal(true);
        } catch (error) {
          expect(error).to.equal(value);
        }
      });
    });

    describe('toOptional()', () => {
      it('should transform the Error into a None', () => {
        const expected = 3;

        const optional = ErrorResult(expected).toOptional();

        expect(optional.isOptionalInstance).to.equal(true);
        expect(optional.valueAbsent).to.equal(true);
      });
    });

    describe('toPromise()', () => {
      it('should transform the Error into a rejeced promise', done => {
        const expected = 3;

        const promise = ErrorResult(expected).toPromise();

        expect(promise.then !== undefined).to.equal(true);

        promise
          .then(constant(increment(expected)))
          .catch(identity)
          .then((value: any) => {
            expect(value).to.equal(expected);
          })
          .then(done);
      });
    });
  });

  describe('The Pending subtype', () => {
    it('should have the proper flags', () => {
      const pending = Ok().asynchronous();

      //@ts-ignore Must access a private property
      expect(pending.isResultInstance).to.equal(true);
      expect(pending.isAsynchronous).to.equal(true);
    });

    it('should throw an exception when isOk, isError or isAborted are accessed', () => {
      ['isOk', 'isError', 'isAborted'].forEach(property => {
        try {
          identity((Ok().asynchronous() as any)[property]);

          expect(false).to.equal(true);
        } catch (_) {
          // Everything is OK!
        }
      });
    });

    it('should flatten nested Pending', done => {
      const expected = 3;

      Pending(
        Promise.resolve(Pending(
          Promise.resolve(Pending(
            Promise.resolve(Ok(expected))
          ))
        ))
      )
        .toPromise()
        .then((value: any) => {
          expect(value).to.equal(expected);
        })
        .catch(identity)
        .then(done);
    });

    describe('match(callbacks)', () => {
      it('should return rejected promises by default for wrapped errors', done => {
        const expected = 3;

        Promise
          .all(
            [ErrorResult(expected), Aborted(expected)].map(instance => {
              return Pending(Promise.resolve(instance))
                .match({})
                .then(increment, identity)
                .then((value: any) => {
                  expect(value).to.equal(expected);
                })
                .catch(identity);
            })
          )
          .then(() => done());
      });
    });

    describe('asynchronous()', () => {
      it('should return an equivalent Pending instance', () => {
        const base = Pending(Promise.resolve(Ok(3)));

        expect(base.asynchronous()).to.equal(base);
      });
    });

    describe('flatMap(λ)', () => {
      it('should return a correct Pending if λ is asynchronous and it succeeds', done => {
        const base = 3;

        const expected = increment(base);

        const pending = Pending(Promise.resolve(Ok())).flatMap(async () => Ok(base));

        //@ts-ignore Must access a private property
        expect(pending.isResultInstance).to.equal(true);
        expect(pending.isAsynchronous).to.equal(true);

        pending
        //! This is a hack to make the compiler happy
        //@ts-ignore Temporary solution
          .map(increment)
          .toPromise()
          .then((value: any) => {
            expect(value).to.equal(expected);
          })
          .then(done, done);
      });

      it('should return a Pending wrapping an Aborted if λ is asynchronous and is rejected', done => {
        const expected = 3;

        const pending = Pending(Promise.resolve(Ok())).flatMap(constant(Promise.reject(expected)));

        //@ts-ignore Must access a private property
        expect(pending.isResultInstance).to.equal(true);
        expect(pending.isAsynchronous).to.equal(true);

        pending
        //@ts-ignore Must access a private property
          .map(increment)
          .merge()
          .then((value: any) => {
            expect(value).to.equal(expected);
          })
          .then(done, done);
      });
    });

    it('should call transformation methods on children and return a new instance', done => {
      const instances = [Ok(31), ErrorResult(32), Aborted(33)];

      const testData = [
        ['merge', []],
        ['toPromise', []],
        ['toOptional', []],
        ['abortOnError', []],
        ['valueEquals', [31]],
        ['satisfies', [() => true]],
        ['abortOnErrorWith', [increment]],
        ['map', [increment]],
        ['tap', [increment]],
        ['mapError', [increment]],
        ['tapError', [increment]],
        ['recover', [constant(1)]],
        ['filter', [constant(true)]],
        ['reject', [constant(false)]],
        ['flatMap', [constant(Ok(1))]],
        ['recoverWhen', [Boolean, increment]],
        ['replace', [1]],
        ['getOrElse', [3]],
        ['property', ['toFixed']],
        ['expectProperty', ['toFixed']],
        ['expectMap', [constant(3)]],
        ['match', [{ Ok: constant(1), Error: constant(2), Aborted: constant(3) }]]
      ];

      Promise
        .all(
          testData.map(([methodName, parameters]) => {
            return Promise.all(instances.map(async instance => {
              const expected = ((instance as any)[<any>methodName])(...parameters);

              const transformed = (instance.asynchronous() as any)[<any>methodName](...parameters);

              let values: Promise<any[]>;
              if (methodName === 'toPromise') {
                values = Promise.all(
                  [expected, transformed].map(promise => {
                    return promise
                      .then((value: any) => ({ ok: false, value }))
                      .catch((value: any) => ({ ok: true, value }));
                  })
                );
              } else {
                values = (transformed.promise || transformed).then((transformedValue: any) => {
                  return [expected, transformedValue];
                });
              }

              return values.then(([expectedValue, transformedValue]) => {
                if (JSON.stringify(expectedValue) !== JSON.stringify(transformedValue)) {
                  console.log(methodName, instance);
                }

                expect(JSON.stringify(expectedValue)).to.equal(JSON.stringify(transformedValue));
              });
            }));
          })
        )
        .then(() => done(), error => done(error));
    });

    describe('get()', () => {
      it('should return the right values for Ok instances', async () => {
        const value = 3;

        const asyncOk = Pending(Promise.resolve(Ok(value)));

        const unwrapped = asyncOk.get();

        expect(unwrapped.then !== undefined).to.equal(true);
        expect(await unwrapped).to.equal(value);
      });

      it('should throw for Error/Aborted instances', async () => {
        const value = 3;

        return Promise.all([Aborted, ErrorResult].map(async Type => {
          const pending = Pending(Promise.resolve(Type(value)));

          const unwrapped = pending.get();

          expect(unwrapped.then !== undefined).to.equal(true);

          try {
            await unwrapped;

            expect(false).to.equal(true);
          } catch (error) {
            expect(error).to.equal(value);
          }
        }));
      });
    });
  });

  describe('The Aborted subtype', () => {
    it('should have the proper flags', () => {
      const error = Aborted();

      expect(error.isResultInstance).to.equal(true);
      expect(error.isAsynchronous).to.equal(false);
      expect(error.isAborted).to.equal(true);
      expect(error.isError).to.equal(true);
      expect(error.isOk).to.equal(false);
    });

    it('should be an error that you can only unwrap at the end of a computation chain', () => {
      const value = 3;

      const aborted = Aborted(value)
        .map(increment)
        .abortOnError()
        .replace(Promise.resolve(5))
        .abortOnErrorWith(increment)
        .flatMap(increment)
        .recover(increment)
        .property('a' as any)
        .tap(increment)
        .expectProperty('a' as any)
        .reject(constant(true))
        .recoverWhen(increment, increment)
        .expectMap(increment)
        .mapError(increment);

      expect(aborted.isError).to.equal(true);
      expect(aborted.merge()).to.equal(value);
      expect(aborted.isAborted).to.equal(true);
      expect(aborted.valueEquals(value)).to.equal(false);
      expect(aborted.satisfies(() => true)).to.equal(false);
      expect(aborted.satisfies(() => false)).to.equal(false);
    });

    describe('get()', () => {
      const value = 3;

      try {
        Aborted(value).get();

        expect(false).to.equal(true);
      } catch (error) {
        expect(error).to.equal(value);
      }
    });

    describe('getOrElse(value)', () => {
      it('should return `value`', () => {
        const value = 3;

        expect(Aborted(value + 1).getOrElse(value)).to.equal(value);
      });
    });

    describe('match(callbacks)', () => {
      it('should execute callbacks.Aborted if it exists', () => {
        const expected = 3;

        expect(
          Aborted(3).match({
            Aborted: constant(expected),
            Error: constant(increment(expected))
          })
        ).to.equal(expected);
      });

      it('should just throw the wrapped error when the callbacks.Aborted callback does not exist', () => {
        const value = 3;

        try {
          Aborted(value).match({});

          expect(false).to.equal(true);
        } catch (error) {
          expect(error).to.equal(value);
        }
      });
    });

    describe('toOptional()', () => {
      it('should transform the Aborted into a None', () => {
        const expected = 3;

        const optional = ErrorResult(expected).toOptional();

        expect(optional.isOptionalInstance).to.equal(true);
        expect(optional.valueAbsent).to.equal(true);
      });
    });

    describe('toPromise()', () => {
      it('should transform the Aborted into a rejeced promise', done => {
        const expected = 3;

        const promise = Aborted(expected).toPromise();

        expect(promise.then !== undefined).to.equal(true);

        promise
          .then(constant(increment(expected)))
          .catch(identity)
          .then((value: any) => {
            expect(value).to.equal(expected);
          })
          .then(done);
      });
    });
  });

  describe('when(truthy)', () => {
    it('should convert truthies to Ok instances', () => {
      [1, 'a', 3, {}, []].forEach(truthy => {
        const value = 4;

        const result = Result.when(truthy, value);

        expect(result.isOk).to.equal(true);
        expect(result.merge()).to.equal(value);
      });
    });

    it('should convert falsies to Some instances', () => {
      ['', NaN, 0, null, undefined].forEach(falsy => {
        const value = 4;

        const result = Result.when(falsy, value + 1, value);

        expect(result.isOk).to.equal(false);
        expect(result.isAborted).to.equal(false);

        expect(result.isError).to.equal(true);
        expect(result.merge()).to.equal(value);
      });
    });
  });

  describe('expect(optionalOrResultOrPromise)', () => {
    it('should transform non-lonads and non-promises into Result using Optional.fromNullable', () => {
      const expected = 2;

      expect(Result.expect(expected).merge()).to.equal(expected);
      expect(Result.expect(null).mapError(constant(expected)).merge()).to.equal(expected);
    });

    it('should transforn Some into Ok', () => {
      const expected = 4;

      const ok = Result.expect(Some(expected));

      expect(ok.isResultInstance).to.equal(true);
      expect(ok.merge()).to.equal(expected);
      expect(ok.isOk).to.equal(true);
    });

    it('should transform None into Error', () => {
      const expected = 4;

      const error = Result.expect(None()).mapError(constant(expected));

      expect(error.isResultInstance).to.equal(true);
      expect(error.merge()).to.equal(expected);
      expect(error.isError).to.equal(true);
    });

    it('should return passed Result', () => {
      const instances = [Ok(3), ErrorResult(3), Aborted(3)];

      instances.forEach(instance => {
        expect(Result.expect(instance) === instance).to.equal(true);
      });

      let instance = Pending(Promise.resolve(Ok(3)));
      expect(Result.expect(instance) === instance).to.equal(true);
    });

    it('should return a Pending if the passed value is a promise', done => {
      const expected = 4;

      const result = Result.expect(Promise.resolve(expected));

      expect(result.isAsynchronous).to.equal(true);

      result
        .toPromise()
        .then((value: any) => {
          expect(value).to.equal(expected);
        })
        .catch(identity)
        .then(done);
    });

    it('should return a Pending wrapping an Aborted if the passed promise is rejected', done => {
      const expected = 4;

      const result = Result.expect(Promise.reject(expected)) as PendingClass<number>;

      expect(result.isAsynchronous).to.equal(true);

      result
        .promise
        .then(wrappedResult => {
          expect(wrappedResult.isResultInstance).to.equal(true);
          expect(wrappedResult.isAborted).to.equal(true);
          expect(wrappedResult.isError).to.equal(true);
        })
        .then(done, done);
    });
  });

  describe('try(λ)', () => {
    describe('should construct a Result from the result a function', () => {
      const expected = 4;

      expect(Result.try(constant(expected)).mapError(increment).merge()).to.equal(expected);
    });

    describe('should turn function execution exceptions into Errors', () => {
      const expected = 4;

      expect(Result.try(() => { throw expected; }).map(increment).merge()).to.equal(expected);
    });
    
    describe('should turn asynchronous results into Pending', () => {
      expect(Result.try(async () => { }).isAsynchronous).to.equal(true);
    });
  });

  describe('fromPromise(promise)', () => {
    it('should convert resolved Promise into Pending wrapping Oks', done => {
      const expected = 3;

      Result
        .fromPromise(Promise.resolve())
        .toPromise()
        .then(constant(expected), () => new Exception('The promise is rejected'))
        .then((value: any) => {
          expect(value).to.equal(expected);
        })
        .then(done, done);
    });

    it('should convert rejected Promise into Pending wrapping Errors', done => {
      (Result
        .fromPromise(Promise.reject()) as PendingClass<any>)
        .promise
        .then(result => {
          expect(result.isResultInstance).to.equal(true);
          expect(result.isAborted).to.equal(false);
          expect(result.isError).to.equal(true);
        })
        .then(done, done);
    });
  });
});
