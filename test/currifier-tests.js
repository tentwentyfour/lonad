/* global describe, it */

const { expect } = require('chai');
const pipe       = require('lodash.flow');
const constant   = require('lodash.constant');
const Optional   = require('../source/optional');

const { Some, None } = Optional;

const increment = n => n + 1;

describe('The currifier', () => {
  it('should make static functions with flipped arguments that call instances methods appropriately for Optional', () => {
    const instances = [Some(3), None()];

    const calls = [
      ['get'],
      ['map',                                            increment],
      ['flatMap',     pipe(increment, Some, Optional.getOrElse(8))],
      ['filter',                                         increment],
      ['getOrElse',                                              4],
      ['match',             { Ok: constant(1), None: constant(2) }]
    ];

    calls.forEach(([methodName, parameter]) => {
      instances.forEach(instance => {
        expect(instance[methodName]).to.not.equal(undefined);
        expect(Optional[methodName]).to.not.equal(undefined);

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
          Optional[methodName].length === 1
          ? Optional[methodName]
          : Optional[methodName](parameter)
        );

        expect(typeof staticForm).to.equal('function');
        expect(executeForm(methodForm)).to.equal(executeForm(staticForm));
      });
    });
  });
});
