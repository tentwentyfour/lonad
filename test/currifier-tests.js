/* global describe, it */

const { expect } = require('chai');
const pipe       = require('lodash.flow');
const constant   = require('lodash.constant');
const Result     = require('../source/result');
const Optional   = require('../source/optional');

const { Ok, Error, Aborted } = Result;
const { Some, None }         = Optional;

const increment = n => n + 1;

const runTest = ({ Monad, instances, calls }) => {
  calls.forEach(([methodName, parameter]) => {
    instances.forEach(instance => {
      expect(instance[methodName]).to.not.equal(undefined);
      expect(Monad[methodName]).to.not.equal(undefined);

      const executeForm = form => {
        try {
          let output = form(instance);

          return `OK: ${JSON.stringify(output)}`;
        } catch (error) {
          return `ERROR: ${error}`;
        }
      };

      const methodForm = optional => optional[methodName](parameter);

      const staticForm = (
        instance[methodName].length === 0
        ? Monad[methodName]
        : Monad[methodName](parameter)
      );

      expect(typeof staticForm).to.equal('function');
      expect(executeForm(methodForm)).to.equal(executeForm(staticForm));
    });
  });
};

describe('The currifier', () => {
  it('should make static functions with flipped arguments that call instances methods appropriately', () => {
    runTest({
      Monad:     Optional,
      instances: [Some(3), None()],

      calls: [
        ['get'],
        ['map',                                            increment],
        ['flatMap',     pipe(increment, Some, Optional.getOrElse(8))],
        ['filter',                                         increment],
        ['getOrElse',                                              4],
        ['match',             { Ok: constant(1), None: constant(2) }]
      ]
    });

    runTest({
      Monad:     Result,
      instances: [Ok(3), Error(4), Aborted(5)],

      calls: [
        ['merge'],
        ['toOptional'],
        ['abortIfError'],
        ['asynchronous'],
        ['map',                                            increment],
        ['flatMap',     pipe(increment, Some, Optional.getOrElse(8))],
        ['filter',                                         increment],
        ['mapError',                                       increment],
        ['recover',                                        increment],
        ['match',            { Ok: constant(1), Error: constant(2) }]
      ]
    });
  });
});
