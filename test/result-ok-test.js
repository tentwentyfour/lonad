/* global describe, it */

const { expect }             = require('chai');
const Result                 = require('../source/result');
const { Some, None }         = require('../source/optional');
const Exception              = require('../source/exception');
const { constant, identity } = require('../source/utils');

const { Ok, Error, Aborted, Pending } = Result;

const increment      = n => n + 1;
const asyncIncrement = async n => n + 1;

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason);
});

describe('Result.Ok subtype', () => {
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
      expect(Ok(3).satisfies(x => x === 3)).to.equal(true);
    });

    it('should return false when the wrapped value does not satisfy the passed predicate', () => {
      expect(Ok(3).satisfies(x => x === 2)).to.equal(false);
    });

    it('should return Boolean results', () => {
      expect(Ok(2).satisfies(x => x)).to.equal(true);
      expect(Ok(0).satisfies(x => x)).to.equal(false);
      expect(Error().satisfies(x => x)).to.equal(false);
      expect(Aborted().satisfies(x => x)).to.equal(false);
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
      const ok = Ok({ a: 2 });

      expect(ok.property('a').getOrElse(ok.value.a + 1)).to.equal(ok.value.a);
    });
  });

  describe('expectProperty(propertyName)', () => {
    it('should return a Ok with the right value if the wrapped value has an property named `propertyName` that is 0, "" or NaN', () => {
      const ok1 = Ok({ a: NaN });
      const ok2 = Ok({ a: '' });
      const ok3 = Ok({ a: 0 });

      expect(ok1.expectProperty('a').isOk).to.equal(true);
      expect(ok2.expectProperty('a').isOk).to.equal(true);
      expect(ok3.expectProperty('a').isOk).to.equal(true);

      expect(ok2.expectProperty('a').value).to.equal(ok2.value.a);
      expect(ok3.expectProperty('a').value).to.equal(ok3.value.a);
      expect(isNaN(ok1.expectProperty('a').value)).to.equal(true);
    });

    it('should return a Ok with the right value if the wrapped value has an expectable property named `propertyName` that is a OK', () => {
      const ok = Ok({ a: Ok(2) });

      expect(ok.expectProperty('a').getOrElse(ok.value.a.value + 1)).to.equal(ok.value.a.value);
    });

    it('should return a None if the wrapped value does not have a Some named `propertyName`', () => {
      const ok = Ok({});

      expect(ok.expectProperty('a').isError).to.equal(true);
    });
  });

  describe('transform(λ)', () => {
    it('should return a Ok with the right value when applying the wrapped value to λ returns a Ok expectable value', () => {
      const value = 2;

      expect(Ok().transform(constant(value)).getOrElse(value + 1)).to.equal(value);
    });

    it('should return a None when applying λ to the wrapped value returns a non-Ok expectable value', () => {
      expect(Ok().transform(constant(null)).isError).to.equal(true);
    });

    it('should return a new Ok instance holding the value of λ for the value of the Ok instance', () => {
      const value = 3;

      const ok = Ok(value);

      const transformed = ok.transform(increment);

      expect(ok !== transformed).to.equal(true);
      expect(transformed.merge()).to.equal(increment(value));
    });

    it('should catch exceptions thrown in the transform callback and return an Aborted', () => {
      const expected = 4;

      const result = Ok().transform(() => {
        throw expected;
      });

      expect(result.isError).to.equal(true);
      expect(result.isAborted).to.equal(true);
      expect(result.merge()).to.equal(expected);
    });

    it('should return a Pending wrapping an Ok if λ is asynchronous', done => {
      const expected = 4;

      const result = Ok(expected).transform(asyncIncrement);

      expect(result.isAsynchronous).to.equal(true);

      result
      .toPromise()
      .catch(() => Promise.reject(new Exception('The promise is not rejected')), increment)
      .then(value => {
        expect(value).to.equal(increment(expected));
      })
      .then(done, done);
    });

    it('should return a Pending wrapping an Aborted if λ throws asynchronously', done => {
      const result = Ok().transform(constant(Promise.reject()));

      expect(result.isAsynchronous).to.equal(true);

      result
      .promise
      .then(wrappedResult => {
        expect(wrappedResult.isError).to.equal(true);
        expect(wrappedResult.isAborted).to.equal(true);
        expect(wrappedResult.isResultInstance).to.equal(true);
      })
      .then(done, done);
    });

    it('should pass the Ok value to an asynchronous λ and pass the output through Result.expect() except if λ throws or returns a rejected promise', done => {
      const instances = [
        null,
        3,
        Promise.resolve(1),
        Some(5),
        None(),
        Ok(9),
        Error(6),
        Aborted(3),
        Pending(Promise.resolve(Ok(4)))
      ];

      Promise
      .all(instances.map(instance => {
        return Ok()
        .transform(constant(instance))
        .asynchronous()
        .promise
        .then(outputInstance => {
          return Result
          .expect(instance)
          .asynchronous()
          .promise
          .then(throughExpect => {
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
        () => Promise.reject()
      ];

      Promise
      .all(cases.map(λ => {
        return Ok()
        .transform(λ)
        .asynchronous()
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

  describe('tap(λ)', () => {
    it('should return an equivalent Ok instance and pass λ its value', () => {
      const value = 3;

      let called = false;

      const ok = Ok(value);

      const transformed = ok.tap(x => {
        called = true;

        return value + 1;
      });

      expect(called).to.equal(true);
      expect(ok === transformed).to.equal(true);

      expect(ok.merge()).to.equal(value);
      expect(transformed.merge()).to.equal(value);
    });

    it('should catch exceptions thrown in the tap callback and return an Aborted', () => {
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
      .catch(() => Promise.reject(new Exception('The promise is not rejected')), increment)
      .then(value => {
        expect(value).to.equal(expected);
      })
      .then(done, done);
    });

    it('should return a Pending wrapping an Aborted if λ throws asynchronously', done => {
      const result = Ok().transform(constant(Promise.reject()));

      expect(result.isAsynchronous).to.equal(true);

      result
      .promise
      .then(wrappedResult => {
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
        Error:   constant(false),
        Ok:      constant(false)
      });

      expect(isAborted).to.equal(true);
      expect(await result.merge()).to.equal(expected);
    });

    it('should return a Pending wrapping an Ok with the new value for async values', async () => {
      const initial  = 2;
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
  });

  describe('filter(λ)', () => {
    it('should return an equivalent Ok if the predicate is true when passed the Ok value', () => {
      const value = 3;

      const ok = Ok(value).filter(n => n === value);

      expect(ok.isOk).to.equal(true);
      expect(ok.merge()).to.equal(value);
    });

    it('should return an Error if the predicate is false when passed the Ok value', () => {
      const value = 3;

      const ok = Ok(value).filter(n => n !== value);

      expect(ok.isError).to.equal(true);
    });

    it('should return a Pending wrapping an Ok if the predicate is true asynchronously', done => {
      const expected = 4;

      const result = Ok().filter(async () => true);

      expect(result.isAsynchronous).to.equal(true);

      result
      .transform(increment)
      .match({
        Ok:    constant(expected),
        Error: constant(increment(expected))
      })
      .then(value => {
        expect(value).to.equal(expected);
      })
      .then(done, done);
    });

    it('should return a Pending wrapping an Aborted if λ throws asynchronously', done => {
      const expected = 4;

      const result = Ok().filter(constant(Promise.reject(expected)));

      expect(result.isAsynchronous).to.equal(true);

      result
      .promise
      .then(wrappedResult => {
        expect(wrappedResult.isResultInstance).to.equal(true);
        expect(wrappedResult.isAborted).to.equal(true);
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

      const ok = Ok(value).reject(n => n !== value);

      expect(ok.isOk).to.equal(true);
      expect(ok.merge()).to.equal(value);
    });

    it('should return an Error if the predicate is true when passed the Ok value', () => {
      const value = 3;

      const ok = Ok(value).reject(n => n === value);

      expect(ok.isError).to.equal(true);
    });

    it('should return a Pending wrapping an Ok if the predicate is false asynchronously', done => {
      const expected = 4;

      const result = Ok().reject(async () => false);

      expect(result.isAsynchronous).to.equal(true);

      result
      .transform(increment)
      .match({
        Ok:    constant(expected),
        Error: constant(increment(expected))
      })
      .then(value => {
        expect(value).to.equal(expected);
      })
      .then(done, done);
    });

    it('should return a Pending wrapping an Aborted if λ throws asynchronously', done => {
      const expected = 4;

      const result = Ok().reject(constant(Promise.reject(expected)));

      expect(result.isAsynchronous).to.equal(true);

      result
      .promise
      .then(wrappedResult => {
        expect(wrappedResult.isResultInstance).to.equal(true);
        expect(wrappedResult.isAborted).to.equal(true);
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
      const other    = 4;

      const returnValue = Ok(other).match({ Ok: () => expected });

      expect(returnValue).to.equal(expected);
    });

    it('should just return the Ok value when callbacks.Ok does not exist', () => {
      const expected = 3;
      const other    = 4;

      const returnValue = Ok(expected).match({ Error: () => other });

      expect(returnValue).to.equal(expected);
    });
  });

  describe('toOptional()', () => {
    it('should transform the Ok into a Some', () => {
      const expected = 3;

      const optional = Ok(expected).toOptional();

      expect(optional.isOptionalInstance).to.equal(true);
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
        value => {
          expect(value).to.equal(expected);
        },
        () => Promise.reject(new Exception('The promise is rejected'))
      )
      .then(done, done);
    });
  });

  describe('asynchronous()', () => {
    it('should transform the Ok into a pending resolved with the Ok', done => {
      const pending = Ok().asynchronous();

      expect(pending.isAsynchronous).to.equal(true);

      pending
      .promise
      .catch(Error)
      .then(value => {
        expect(value.isOk).to.equal(true);
      })
      .then(done, done);
    });
  });
});