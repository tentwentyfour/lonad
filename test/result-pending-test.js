/* global describe, it */

const { expect }             = require('chai');
const Result                 = require('../source/result');
const { constant, identity } = require('../source/utils');

const { Ok, Error, Aborted, Pending } = Result;

const increment      = n => n + 1;

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason);
});

describe('The Pending subtype', () => {
  it('should have the proper flags', () => {
    const pending = Ok().asynchronous();

    expect(pending.isResultInstance).to.equal(true);
    expect(pending.isAsynchronous).to.equal(true);
  });

  it('should throw an exception when isOk, isError or isAborted are accessed', () => {
    ['isOk', 'isError', 'isAborted'].forEach(property => {
      try {
        identity(Ok().asynchronous()[property]);

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
    .then(value => {
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
        [Error(expected), Aborted(expected)].map(instance => {
          return Pending(Promise.resolve(instance))
          .match({})
          .then(increment, identity)
          .then(value => {
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

  describe('chain(λ)', () => {
    it('should return a correct Pending if λ is asynchronous and it succeeds', done => {
      const base = 3;

      const expected = increment(base);

      const pending = Pending(Promise.resolve(Ok())).chain(async () => Ok(base));

      expect(pending.isResultInstance).to.equal(true);
      expect(pending.isAsynchronous).to.equal(true);

      pending
      .chain(increment)
      .toPromise()
      .then(value => {
        expect(value).to.equal(expected);
      })
      .then(done, done);
    });

    it('should return a Pending wrapping an Aborted if λ is asynchronous and is rejected', done => {
      const expected = 3;

      const pending = Pending(Promise.resolve(Ok())).chain(constant(Promise.reject(expected)));

      expect(pending.isResultInstance).to.equal(true);
      expect(pending.isAsynchronous).to.equal(true);

      pending
      .chain(increment)
      .merge()
      .then(value => {
        expect(value).to.equal(expected);
      })
      .then(done, done);
    });
  });

  it('should call transformation methods on children and return a new instance', done => {
    const instances = [Ok(31), Error(32), Aborted(33)];

    const testData = [
      ['merge',                                                                         []],
      ['toPromise',                                                                     []],
      ['toOptional',                                                                    []],
      ['abortOnError',                                                                  []],
      ['valueEquals',                                                                 [31]],
      ['satisfies',                                                           [() => true]],
      ['abortOnErrorWith',                                                     [increment]],
      ['chain',                                                                [increment]],
      ['tap',                                                                  [increment]],
      ['mapError',                                                             [increment]],
      ['recover',                                                            [constant(1)]],
      ['filter',                                                          [constant(true)]],
      ['reject',                                                         [constant(false)]],
      ['recoverWhen',                                                 [Boolean, increment]],
      ['replace',                                                                      [1]],
      ['getOrElse',                                                                    [3]],
      ['property',                                                             ['toFixed']],
      ['expectProperty',                                                       ['toFixed']],
      ['match',            [{ Ok: constant(1), Error: constant(2), Aborted: constant(3) }]]
    ];

    Promise
    .all(
      testData.map(([methodName, parameters]) => {
        return Promise.all(instances.map(async instance => {
          const expected = instance[methodName](...parameters);

          const transformed = instance.asynchronous()[methodName](...parameters);

          let values;

          if (methodName === 'toPromise') {
            values = Promise.all(
              [expected, transformed].map(promise => {
                return promise
                .then(value => ({ ok: false, value }))
                .catch(value => ({ ok: true, value }));
              })
            );
          } else {
            values = (transformed.promise || transformed).then(transformedValue => {
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

      return Promise.all([Aborted, Error].map(async Type => {
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