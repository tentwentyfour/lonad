/* global describe, it */

const { expect }             = require('chai');
const Result                 = require('../source/result');
const { constant, identity } = require('../source/utils');

const { Error, Aborted } = Result;

const increment      = n => n + 1;

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason);
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

  it('should be an error that you can only unwrap at the end of a computation transform', () => {
    const value = 3;

    const aborted = Aborted(value)
    .transform(increment)
    .abortOnError()
    .replace(Promise.resolve(5))
    .abortOnErrorWith(increment)
    .transform(increment)
    .recover(increment)
    .property('a')
    .tap(increment)
    .expectProperty('a')
    .reject(constant(true))
    .recoverWhen(increment, increment)
    .transform(increment)
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
          Error:   constant(increment(expected))
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