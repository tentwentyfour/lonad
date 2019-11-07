/* global describe, it */

const { expect }             = require('chai');
const Result                 = require('../source/result');
const { Some, None }         = require('../source/optional');
const Exception              = require('../source/exception');
const { constant, identity } = require('../source/utils');

const { Ok, Error, Aborted, Pending } = Result;

const increment = n => n + 1;

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason);
});

describe('The Result type', () => {
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
      const instances = [Ok(3), Error(3), Aborted(3), Pending(Promise.resolve(Ok(3)))];

      instances.forEach(instance => {
        expect(Result.expect(instance) === instance).to.equal(true);
      });
    });

    it('should return a Pending if the passed value is a promise', done => {
      const expected = 4;

      const result = Result.expect(Promise.resolve(expected));

      expect(result.isAsynchronous).to.equal(true);

      result
      .toPromise()
      .then(value => {
        expect(value).to.equal(expected);
      })
      .catch(identity)
      .then(done);
    });

    it('should return a Pending wrapping an Aborted if the passed promise is rejected', done => {
      const expected = 4;

      const result = Result.expect(Promise.reject(expected));

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

      expect(Result.try(() => { throw expected; }).transform(increment).merge()).to.equal(expected);
    });

    describe('should turn asynchronous results into Pending', () => {
      expect(Result.try(async () => {}).isAsynchronous).to.equal(true);
    });
  });

  describe('fromPromise(promise)', () => {
    it('should convert resolved Promise into Pending wrapping Oks', done => {
      const expected = 3;

      Result
      .fromPromise(Promise.resolve())
      .toPromise()
      .then(constant(expected), () => new Exception('The promise is rejected'))
      .then(value => {
        expect(value).to.equal(expected);
      })
      .then(done, done);
    });

    it('should convert rejected Promise into Pending wrapping Errors', done => {
      Result
      .fromPromise(Promise.reject())
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
