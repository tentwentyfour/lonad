/* global describe, it */

// TODO: Test fromPromise

const { expect }     = require('chai');
const pipe           = require('lodash.flow');
const identity       = require('lodash.identity');
const constant       = require('lodash.constant');
const Result         = require('../source/result');
const { Some, None } = require('../source/optional');

const { Ok, Error, Aborted, Pending } = Result;

const increment      = n => n + 1;
const asyncIncrement = async n => n + 1;

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

    describe('map(λ)', () => {
      it('should return a new Ok instance holding the value of λ for the value of the Ok instance', () => {
        const value = 3;

        const ok = Ok(value);

        const transformed = ok.map(increment);

        expect(ok !== transformed).to.equal(true);
        expect(transformed.merge()).to.equal(increment(value));
      });

      it('should catch exceptions thrown in the map callback and return an Error', () => {
        const expected = 4;

        const result = Ok().map(() => {
          throw expected;
        });

        expect(result.isError).to.equal(true);
        expect(result.merge()).to.equal(expected);
      });

      it('should return a Pending wrapping an Ok if λ is asynchronous', done => {
        const expected = 4;

        const result = Ok(expected).map(asyncIncrement);

        expect(result.isAsynchronous).to.equal(true);

        result
        .toPromise()
        .catch(increment)
        .then(value => {
          expect(value).to.equal(increment(expected));
        })
        .catch(identity)
        .then(done);
      });

      it('should return a Pending wrapping an Error if λ throws asynchronously', done => {
        const expected = 4;

        const result = Ok().map(constant(Promise.reject(expected)));

        expect(result.isAsynchronous).to.equal(true);

        result
        .toPromise()
        .then(increment)
        .catch(identity)
        .then(value => {
          expect(value).to.equal(expected);
        })
        .catch(identity)
        .then(done);
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

    describe('recover(λ)', () => {
      it('should return an equivalent Ok', () => {
        const value = 3;

        const ok = Ok(value);

        const transformed = ok.recover(increment);

        expect(transformed.merge()).to.equal(value);
      });
    });

    describe('flatMap(λ)', () => {
      it('should pass the Ok value to an asynchronous λ and return its Result wrapped in a Pending', done => {
        const instances = [Ok(1), Error(2), Aborted(3), Pending(Promise.resolve(Ok(4)))];

        Promise
        .all(instances.map(instance => {
          return Ok()
          .flatMap(async () => instance)
          .merge()
          .then(outputInstance => {
            expect(instance.merge()).to.equal(outputInstance);
          });
        }))
        .catch(identity)
        .then(() => done());
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
        .map(increment)
        .match({
          Ok:    constant(expected),
          Error: constant(increment(expected))
        })
        .then(value => {
          expect(value).to.equal(expected);
        })
        .then(done);
      });

      it('should return a Pending wrapping an Error if λ throws asynchronously', done => {
        const expected = 4;

        const result = Ok().map(constant(Promise.reject(expected)));

        expect(result.isAsynchronous).to.equal(true);

        result
        .toPromise()
        .then(increment)
        .catch(identity)
        .then(value => {
          expect(value).to.equal(expected);
        })
        .catch(identity)
        .then(done);
      });
    });

    describe('merge()', () => {
      it('should unwrap Ok instances', () => {
        const value = 3;

        expect(Ok(value).merge()).to.equal(value);
      });
    });

    describe('abortIfError()', () => {
      it('should return an equivalent Ok', () => {
        const expected = 3;

        const result = Ok(expected).abortIfError();

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
      it('should transform the Ok into a resolve promise', done => {
        const expected = 3;

        const promise = Ok(expected).toPromise();

        expect(promise.then !== undefined).to.equal(true);

        promise
        .then(value => {
          expect(value).to.equal(expected);
        }, identity)
        .then(done);
      });
    });

    describe('asynchronous()', () => {
      it('should transform the Ok into a pending resolved with the Ok', done => {
        const expected = 3;

        const pending = Ok(expected).asynchronous();

        expect(pending.isAsynchronous).to.equal(true);

        pending
        .toPromise()
        .then(identity, constant(increment(expected)))
        .then(value => {
          expect(value).to.equal(expected);
        })
        .then(done);
      });
    });
  });

  describe('The Error subtype', () => {
    it('should have the proper flags', () => {
      const error = Error();

      expect(error.isResultInstance).to.equal(true);
      expect(error.isAsynchronous).to.equal(false);
      expect(error.isAborted).to.equal(false);
      expect(error.isError).to.equal(true);
      expect(error.isOk).to.equal(false);
    });

    describe('map(λ)', () => {
      it('should return an Error()', () => {
        expect(Error().map(increment).isError).to.equal(true);
      });
    });

    describe('synchronous mapError(λ)', () => {
      it('should return a new Error instance holding the value of λ for the value of the Error instance', () => {
        const value = 3;

        const error = Error(value);

        const transformed = error.mapError(increment);

        expect(transformed.isOk).to.equal(false);
        expect(error !== transformed).to.equal(true);
        expect(transformed.merge()).to.equal(increment(value));
      });

      it('should catch exceptions thrown in the mapError callback and return an Error', () => {
        const expected = 4;

        const result = Error().mapError(() => {
          throw expected;
        });

        expect(result.isOk).to.equal(false);
        expect(result.isError).to.equal(true);
        expect(result.merge()).to.equal(expected);
      });
    });

    describe('synchronous recover(λ)', () => {
      it('should return a new Ok instance holding the value of λ for the value of the Error instance', () => {
        const value = 3;

        const error = Error(value);

        const transformed = error.recover(increment);

        expect(transformed.isOk).to.equal(true);
        expect(error !== transformed).to.equal(true);
        expect(transformed.merge()).to.equal(increment(value));
      });

      it('should catch exceptions thrown in the mapError callback and return an Error', () => {
        const expected = 4;

        const result = Error().recover(() => {
          throw expected;
        });

        expect(result.isError).to.equal(true);
        expect(result.merge()).to.equal(expected);
      });
    });

    describe('flatMap(λ)', () => {
      it('should return an Error()', () => {
        expect(Error().flatMap(increment).isError).to.equal(true);
      });
    });

    describe('filter(λ)', () => {
      it('should return an Error()', () => {
        expect(Error().filter(constant(true)).isError).to.equal(true);
        expect(Error().filter(constant(false)).isError).to.equal(true);
      });
    });

    describe('merge()', () => {
      it('should return the wrapped error', () => {
        const value = 3;

        expect(Error(value).merge()).to.equal(value);
      });
    });

    describe('abortIfError()', () => {
      it('should return an Aborted that holds the same error', () => {
        const expected = 3;

        const result = Error(expected).abortIfError();

        expect(result.isOk).to.equal(false);
        expect(result.isAborted).to.equal(true);
        expect(result.merge()).to.equal(expected);
      });
    });

    describe('match(callbacks)', () => {
      it('should execute callbacks.Error if it exists', () => {
        const expected = 3;

        expect(Error().match({ Error: constant(expected) })).to.equal(expected);
      });

      it('should just return the wrapped error when the callbacks.Error callback does not exist', () => {
        const value = 3;

        expect(Error(value).match({})).to.equal(value);
      });
    });

    describe('toOptional()', () => {
      it('should transform the Error into a None', () => {
        const expected = 3;

        const optional = Error(expected).toOptional();

        expect(optional.isOptionalInstance).to.equal(true);
        expect(optional.valueAbsent).to.equal(true);
      });
    });

    describe('toPromise()', () => {
      it('should transform the Error into a rejeced promise', done => {
        const expected = 3;

        const promise = Error(expected).toPromise();

        expect(promise.then !== undefined).to.equal(true);

        promise
        .then(constant(increment(expected)))
        .catch(identity)
        .then(value => {
          expect(value).to.equal(expected);
        })
        .then(done);
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
      .abortIfError()
      .flatMap(increment)
      .recover(increment)
      .mapError(increment);

      expect(aborted.isError).to.equal(true);
      expect(aborted.merge()).to.equal(value);
      expect(aborted.isAborted).to.equal(true);
    });

    describe('match(callbacks)', () => {
      it('should execute callbacks.Aborted over callbacks.Error if it exists', () => {
        const expected = 3;

        expect(
          Aborted(3).match({
            Aborted: constant(expected),
            Error:   constant(increment(expected))
          })
        ).to.equal(expected);
      });

      it('should execute callbacks.Error if it exists and callbacks.Aborted does not', () => {
        const expected = 3;

        expect(Aborted().match({ Error: constant(expected) })).to.equal(expected);
      });

      it('should just return the wrapped error when callbacks.Error and callbacks.Aborted do not exist', () => {
        const value = 3;

        expect(Aborted(value).match({})).to.equal(value);
      });
    });

    describe('toOptional()', () => {
      it('should transform the Aborted into a None', () => {
        const expected = 3;

        const optional = Error(expected).toOptional();

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
        .then(value => {
          expect(value).to.equal(expected);
        })
        .then(done);
      });
    });
  });

  describe('synchronous expect(optional)', () => {
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

    it('should return passed results', () => {
      const instances = [Ok(3), Error(3), Aborted(3), Pending(Promise.resolve(Ok(3)))];

      instances.forEach(instance => {
        expect(Result.expect(instance) === instance).to.equal(true);
      });
    });
  });

  describe('synchronous try(λ)', () => {
    describe('should construct a Result from the result a function', () => {
      const expected = 4;

      expect(Result.try(constant(expected)).mapError(increment).merge()).to.equal(expected);
    });

    describe('should turn function execution exceptions into Errors', () => {
      const expected = 4;

      expect(Result.try(() => { throw expected; }).map(increment).merge()).to.equal(expected);
    });
  });
});
