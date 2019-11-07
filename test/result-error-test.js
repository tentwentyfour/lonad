/* global describe, it */

const { expect }             = require('chai');
const Result                 = require('../source/result');
const { constant, identity } = require('../source/utils');

const { Ok, Error } = Result;

const increment      = n => n + 1;
const asyncIncrement = async n => n + 1;

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason);
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

  describe('replace(value)', () => {
    it('should return synchronous errors', () => {
      const value = 5;

      expect(Error(value + 1).replace(value).merge()).to.equal(value + 1);
      expect(Error(value + 1).replace(Promise.reject(value)).merge()).to.equal(value + 1);
    });
  });

  describe('satisfies(predicate)', () => {
    it('should always return false', () => {
      expect(Error(3).satisfies(() => false)).to.equal(false);
      expect(Error(3).satisfies(() => true)).to.equal(false);
    });
  });

  describe('valueEquals(value)', () => {
    it('should return false', () => {
      expect(Error(3).valueEquals(3)).to.equal(false);
    });
  });

  describe('transform(λ)', () => {
    it('should return an Error()', () => {
      expect(Error().transform(constant(2)).isError).to.equal(true);
    });

    it('should return an Error()', () => {
      expect(Error().transform(increment).isError).to.equal(true);
    });
  });

  describe('property(propertyName)', () => {
    it('should return an Error()', () => {
      expect(Error().property('a').isError).to.equal(true);
    });
  });

  describe('expectProperty(propertyName)', () => {
    it('should return an Error()', () => {
      expect(Error().expectProperty('a').isError).to.equal(true);
    });
  });

  describe('get()', () => {
    const value = 3;

    try {
      Error(value).get();

      expect(false).to.equal(true);
    } catch (error) {
      expect(error).to.equal(value);
    }
  });

  describe('tap(λ)', () => {
    it('should return an Error()', () => {
      expect(Error().tap(increment).isError).to.equal(true);
    });
  });

  describe('mapError(λ)', () => {
    it('should return a new Error instance holding the value of λ for the value of the Error instance', () => {
      const value = 3;

      const error = Error(value);

      const transformed = error.mapError(increment);

      expect(transformed.isOk).to.equal(false);
      expect(error !== transformed).to.equal(true);
      expect(transformed.merge()).to.equal(increment(value));
    });

    it('should catch exceptions thrown in the mapError callback and return an Aborted', () => {
      const expected = 4;

      const result = Error().mapError(() => {
        throw expected;
      });

      expect(result.isOk).to.equal(false);
      expect(result.isError).to.equal(true);
      expect(result.isAborted).to.equal(true);
      expect(result.merge()).to.equal(expected);
    });

    it('should return a Pending wrapping an Error if λ is asynchronous', done => {
      const expected = 4;

      const result = Error(expected).mapError(asyncIncrement);

      expect(result.isAsynchronous).to.equal(true);

      result
      .promise
      .then(value => {
        expect(value.isError).to.equal(true);
        expect(value.isAborted).to.equal(false);
      })
      .then(done, done);
    });

    it('should return a Pending wrapping an Aborted if λ throws asynchronously', done => {
      const result = Ok().transform(constant(Promise.reject()));

      expect(result.isAsynchronous).to.equal(true);

      result
      .promise
      .then(value => {
        expect(value.isError).to.equal(true);
        expect(value.isAborted).to.equal(true);
      })
      .then(done, done);
    });
  });

  describe('abortOnErrorWith(λOrValue)', () => {
    it('should return an Aborted instance holding the value of λ for the value of the Error instance if λOrValue is a function', () => {
      const value = 3;

      const error = Error(value);

      const transformed = error.abortOnErrorWith(increment);

      expect(transformed.isOk).to.equal(false);
      expect(transformed.isAborted).to.equal(true);
      expect(error !== transformed).to.equal(true);
      expect(transformed.merge()).to.equal(increment(value));
    });

    it('should catch exceptions λOrValue', () => {
      const expected = 4;

      const result = Error().abortOnErrorWith(() => {
        throw expected;
      });

      expect(result.isOk).to.equal(false);
      expect(result.isError).to.equal(true);
      expect(result.isAborted).to.equal(true);
      expect(result.merge()).to.equal(expected);
    });

    it('should wrap non-functions into Aborted', () => {
      const expected = 4;

      const aborted = Error().abortOnErrorWith(expected);

      expect(aborted.isResultInstance).to.equal(true);
      expect(aborted.merge()).to.equal(expected);
      expect(aborted.isAborted).to.equal(true);
      expect(aborted.isError).to.equal(true);
    });

    it('should return a Pending wrapping an Abored if λ throws asynchronously', done => {
      const expected = 4;

      const result = Ok().transform(constant(Promise.reject(expected)));

      expect(result.isAsynchronous).to.equal(true);

      result
      .mapError(increment)
      .toPromise()
      .then(increment)
      .catch(identity)
      .then(value => {
        expect(value).to.equal(expected);
      })
      .catch(identity)
      .then(() => done());
    });
  });

  describe('recover(λ)', () => {
    it('should return a new Ok instance holding the value of λ for the value of the Error instance', () => {
      const value = 3;

      const error = Error(value);

      const transformed = error.recover(increment);

      expect(transformed.isOk).to.equal(true);
      expect(error !== transformed).to.equal(true);
      expect(transformed.merge()).to.equal(increment(value));
    });

    it('should catch exceptions thrown in the mapError callback and return an Aborted', () => {
      const expected = 4;

      const result = Error().recover(() => {
        throw expected;
      });

      expect(result.isError).to.equal(true);
      expect(result.isAborted).to.equal(true);
      expect(result.merge()).to.equal(expected);
    });

    it('should return a Pending wrapping an Ok if λ is asynchronous', done => {
      const expected = 4;

      const result = Error(expected).recover(asyncIncrement);

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

    it('should return a Pending wrapping an Aborted if λ throws asynchronously', done => {
      const expected = 4;

      const result = Error().recover(constant(Promise.reject(expected)));

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

  describe('filter(λ)', () => {
    it('should return an Error()', () => {
      expect(Error().filter(constant(true)).isError).to.equal(true);
      expect(Error().filter(constant(false)).isError).to.equal(true);
    });
  });

  describe('reject(λ)', () => {
    it('should return an Error()', () => {
      expect(Error().reject(constant(true)).isError).to.equal(true);
      expect(Error().reject(constant(false)).isError).to.equal(true);
    });
  });

  describe('merge()', () => {
    it('should return the wrapped error', () => {
      const value = 3;

      expect(Error(value).merge()).to.equal(value);
    });
  });

  describe('getOrElse(value)', () => {
    it('should return `value`', () => {
      const value = 3;

      expect(Error(33).getOrElse(value)).to.equal(value);
    });
  });

  describe('abortOnError()', () => {
    it('should return an Aborted that holds the same error', () => {
      const expected = 3;

      const result = Error(expected).abortOnError();

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

    it('should just throw the wrapped error when the callbacks.Error callback does not exist', () => {
      const value = 3;

      try {
        Error(value).match({});

        expect(false).to.equal(true);
      } catch (error) {
        expect(error).to.equal(value);
      }
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