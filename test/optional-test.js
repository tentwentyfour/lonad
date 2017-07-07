/* global describe, it */

const { expect } = require('chai');
const pipe       = require('lodash.flow');
const constant   = require('lodash.constant');
const Optional   = require('../source/optional');

const { Some, None } = Optional;

const increment = n => n + 1;

describe('The Optional type', () => {
  it('should hold curried static functions with flipped arguments that call instances methods appropriately', () => {
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

  describe('fromJson(optional)', () => {
    it('should be able to pick up Some instances contained in deserialized JSON strings', () => {
      const some = Some(3);

      const deserializedSome = Optional.fromJson(JSON.parse(JSON.stringify(some)));

      expect(deserializedSome instanceof Optional).to.equal(true);
      expect(deserializedSome instanceof Some).to.equal(true);

      Object
      .entries(some)
      .forEach(([key, property]) => {
        expect(deserializedSome[key]).to.equal(property);
      });
    });

    it('should be able to pick up None instances contained in deserialized JSON strings', () => {
      const none = None();

      const deserializedNone = Optional.fromJson(JSON.parse(JSON.stringify(none)));

      expect(deserializedNone instanceof Optional).to.equal(true);
      expect(deserializedNone instanceof None).to.equal(true);

      Object
      .entries(none)
      .forEach(([key, property]) => {
        expect(deserializedNone[key]).to.equal(property);
      });
    });
  });

  describe('fromNullable', () => {
    it('should convert null and undefined to None', () => {
      expect(Optional.fromNullable(null).valueAbsent).to.equal(true);
      expect(Optional.fromNullable(undefined).valueAbsent).to.equal(true);
    });

    it('should convert 0, NaN and empty strings to a Some', () => {
      expect(Optional.fromNullable(0).valuePresent).to.equal(true);
      expect(Optional.fromNullable('').valuePresent).to.equal(true);
      expect(Optional.fromNullable(NaN).valuePresent).to.equal(true);
    });
  });

  describe('The Some subtype', () => {
    it('should have the proper flags', () => {
      const some = Some();

      expect(some.isOptionalInstance).to.equal(true);
      expect(some.valuePresent).to.equal(true);
      expect(some.valueAbsent).to.equal(false);
    });

    describe('map(λ)', () => {
      it('should return a new Some instance holding the value of λ for the value of the Some instance', () => {
        const value = 3;

        const some = Some(value);

        const transformed = some.map(increment);

        expect(some !== transformed).to.equal(true);
        expect(transformed.getOrElse(value)).to.equal(increment(value));
      });
    });

    describe('flatMap(λ)', () => {
      it('should pass the Some value to λ and return its return value', () => {
        const value = 3;

        const some = Some(value);

        const transformed = some.flatMap(increment);

        expect(some !== transformed).to.equal(true);
        expect(transformed).to.equal(increment(value));
      });
    });

    describe('filter(λ)', () => {
      it('should return an equivalent Some value if the predicate is true when passed the Some value', () => {
        const value = 3;

        const some = Some(value).filter(n => n === value);

        expect(some.valuePresent).to.equal(true);
      });

      it('should return a None if the predicate is false when passed the Some value', () => {
        const value = 3;

        const some = Some(value).filter(n => n !== value);

        expect(some.valuePresent).to.equal(false);
      });
    });

    describe('getOrElse(λ)', () => {
      it('should return the value of Some instances', () => {
        const value        = 3;
        const defaultValue = 4;

        expect(value).to.not.equal(defaultValue);
        expect(Some(value).getOrElse(defaultValue)).to.equal(value);
      });
    });

    describe('get(λ)', () => {
      it('should unwrap Some instances', () => {
        const value = 3;

        expect(Some(value).get()).to.equal(value);
      });
    });

    describe('match(callbacks)', () => {
      it('should execute callback.Some if it exists', () => {
        const expected = 3;
        const other    = 4;

        const returnValue = Some(other).match({ Some: () => expected });

        expect(returnValue).to.equal(expected);
      });

      it('should just return an the Some value when callback.Some does not exist', () => {
        const expected = 3;
        const other    = 4;

        const returnValue = Some(expected).match({ None: () => other });

        expect(returnValue).to.equal(expected);
      });
    });
  });

  describe('The None subtype', () => {
    it('should have the proper flags', () => {
      const some = None();

      expect(some.isOptionalInstance).to.equal(true);
      expect(some.valuePresent).to.equal(false);
      expect(some.valueAbsent).to.equal(true);
    });

    describe('map(λ)', () => {
      it('should return a None()', () => {
        expect(None().map(increment).valueAbsent).to.equal(true);
      });
    });

    describe('flatMap(λ)', () => {
      it('should return a None()', () => {
        expect(None().flatMap(increment).valueAbsent).to.equal(true);
      });
    });

    describe('filter(λ)', () => {
      it('should return a None()', () => {
        expect(None().filter(constant(true)).valueAbsent).to.equal(true);
        expect(None().filter(constant(false)).valueAbsent).to.equal(true);
      });
    });

    describe('getOrElse(λ)', () => {
      it('should return the passed value', () => {
        const value = 3;

        expect(None().getOrElse(value)).to.equal(value);
      });
    });

    describe('get(λ)', () => {
      it('should throw an error', () => {
        try {
          None().get();

          expect('This should not happen').to.equal('but it did!');
        } catch (error) {
          // Do nothing!
        }
      });
    });

    describe('match(callbacks)', () => {
      it('should execute callback.None if it exists', () => {
        const expected = 3;

        expect(None().match({ None: constant(expected) })).to.equal(expected);
      });

      it('should just return undefined when the callback.None callback does not exist', () => {
        expect(None().match({})).to.equal(undefined);
      });
    });
  });
});
