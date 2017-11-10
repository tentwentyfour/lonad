/* global describe, it */

const { expect } = require('chai');
const constant   = require('lodash.constant');
const Optional   = require('../source/optional');

const { Some, None } = Optional;

const increment = n => n + 1;

describe('The Optional type', () => {
  it('should be able to convert an array of Some into a Some with an array of their values', () => {
    const values = [1, 2, 3];

    const somes = values.map(Some);

    expect(
      Optional
      .all(somes)
      .getOrElse([])
      .join('')
    ).to.equal(values.join(''));
  });

  it('should be able to convert an empty array into a Some with an empty array as value', () => {
    const notExpected = 3;

    expect(
      Optional
      .all([])
      .getOrElse(notExpected)
    ).to.not.equal(notExpected);
  });

  describe('when(truthy, value)', () => {
    it('should convert truthies to Some instances', () => {
      [1, 'a', 3, {}, []].forEach(truthy => {
        const value = 6;

        expect(Optional.when(truthy, value).value).to.equal(value);
      });
    });

    it('should convert falsies to Some instances', () => {
      ['', NaN, 0, null, undefined].forEach(falsy => {
        expect(Optional.when(falsy).valuePresent).to.equal(false);
      });
    });
  });

  describe('first(truthy)', () => {
    it('should return the first Some in a list of Optional', () => {
      const target = Optional.Some(3);

      expect(Optional.first([Optional.None(), target])).to.equal(target);
    });

    it('should return a None when all passed optionals are None instances', () => {
      expect(Optional.first([Optional.None(), Optional.None]).valueAbsent).to.equal(true);
    });
  });

  describe('fromParsedJson(optional)', () => {
    it('should throw when passed non-destringified Optionals', () => {
      let thrown = false;

      try {
        expect(Optional.fromParsedJson(3).valuePresent).to.equal(true);
      } catch (error) {
        thrown = true;
      }

      expect(thrown).to.equal(true);
    });

    it('should be able to pick up Some instances contained in deserialized JSON strings', () => {
      const some = Some(3);

      const deserializedSome = Optional.fromParsedJson(JSON.parse(JSON.stringify(some)));

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

      const deserializedNone = Optional.fromParsedJson(JSON.parse(JSON.stringify(none)));

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

    describe('valueEquals(value)', () => {
      it('should return true when the wrapped value equals `value`', () => {
        expect(Some(3).valueEquals(3)).to.equal(true);
      });

      it('should return false when the wrapped value does not equal `value`', () => {
        expect(Some(3).valueEquals(2)).to.equal(false);
      });
    });

    describe('tap(λ)', () => {
      it('should pass λ its value and return an equivalent Some', () => {
        const initialA = 2;
        const value    = 3;

        let a = initialA;

        const some = Some(value);

        const result = some.tap(x => {
          a += x;

          return a;
        });

        expect(result).to.equal(some);
        expect(result.getOrElse(0)).to.equal(value);

        expect(a).to.equal(initialA + value);
      });
    });

    describe('recover(λ)', () => {
      it('should return an equivalent Some', () => {
        const some = Some();

        expect(some.or(increment)).to.equal(some);
      });
    });

    describe('property(propertyName)', () => {
      it('should return the requested property of the wrapped value', () => {
        const some = Some({ a: 2 });

        expect(some.property('a').get()).to.equal(some.value.a);
      });
    });

    describe('nullableProperty(propertyName)', () => {
      it('should return a Some with the right value if the wrapped value has the non-null `propertyName` property', () => {
        const some = Some({ a: 2 });

        expect(some.nullableProperty('a').get()).to.equal(some.value.a);
      });

      it('should return a None if the wrapped value does not have the non-null `propertyName` property', () => {
        const some = Some({});

        expect(some.nullableProperty('a').valueAbsent).to.equal(true);
      });
    });

    describe('optionalProperty(propertyName)', () => {
      it('should return a Some with the right value if the wrapped value has a Some named `propertyName`', () => {
        const some = Some({ a: Some(2) });

        expect(some.optionalProperty('a').get()).to.equal(some.value.a.value);
      });

      it('should return a None if the wrapped value does not have a Some named `propertyName`', () => {
        const some = Some({ a: None() });

        expect(some.optionalProperty('a').valueAbsent).to.equal(true);
      });
    });

    describe('satisfies(predicate)', () => {
      it('should return true when the wrapped value satisfies the given predicate', () => {
        expect(Some(2).satisfies(value => value === 2)).to.equal(true);
      });


      it('should return false when the wrapped value does not satisfy the given predicate', () => {
        expect(Some(3).satisfies(value => value === 2)).to.equal(false);
      });
    });

    describe('or(λOrOptional)', () => {
      it('should return an equivalent Some', () => {
        const some = Some();

        expect(some.or(increment)).to.equal(some);
      });
    });

    describe('nullableMap(λ)', () => {
      it('should return a new Some instance holding the value of λ for the value of the Some instance if it is not nullable', () => {
        const value = 3;

        const some = Some(value);

        const transformed = some.nullableMap(increment);

        expect(some !== transformed).to.equal(true);
        expect(transformed.getOrElse(value)).to.equal(increment(value));
      });

      it('should return a None if the value of λ for the value of the Some instance is nullable', () => {
        const value = 3;

        const some = Some(value);

        const transformed = some.nullableMap(constant(null));

        expect(transformed.valueAbsent).to.equal(true);
      });
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
        expect(some.get()).to.equal(value);
      });

      it('should return a None if the predicate is false when passed the Some value', () => {
        const value = 3;

        const some = Some(value).filter(n => n !== value);

        expect(some.valuePresent).to.equal(false);
      });
    });

    describe('reject(λ)', () => {
      it('should return an equivalent Some value if the predicate is false when passed the Some value', () => {
        const value = 3;

        const some = Some(value).reject(n => n !== value);

        expect(some.valuePresent).to.equal(true);
        expect(some.get()).to.equal(value);
      });

      it('should return a None if the predicate is true when passed the Some value', () => {
        const value = 3;

        const some = Some(value).reject(n => n === value);

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

      it('should just return the Some value when callback.Some does not exist', () => {
        const expected = 3;
        const other    = 4;

        const returnValue = Some(expected).match({ None: () => other });

        expect(returnValue).to.equal(expected);
      });
    });
  });

  describe('The None subtype', () => {
    it('should have the proper flags', () => {
      const none = None();

      expect(none.isOptionalInstance).to.equal(true);
      expect(none.valuePresent).to.equal(false);
      expect(none.valueAbsent).to.equal(true);
    });

    describe('valueEquals(value)', () => {
      it('should return false', () => {
        expect(None().valueEquals(3)).to.equal(false);
      });
    });

    describe('property(propertyName)', () => {
      it('should return a None()', () => {
        expect(None().property('a').valueAbsent).to.equal(true);
      });
    });

    describe('nullableProperty(propertyName)', () => {
      it('should return a None()', () => {
        expect(None().nullableProperty('a').valueAbsent).to.equal(true);
      });
    });

    describe('optionalProperty(propertyName)', () => {
      it('should return a None()', () => {
        expect(None().optionalProperty('a').valueAbsent).to.equal(true);
      });
    });

    describe('satisfies(predicate)', () => {
      it('should return false', () => {
        expect(None().satisfies(() => true)).to.equal(false);
        expect(None().satisfies(() => false)).to.equal(false);
      });
    });

    describe('or(λOrOptional)', () => {
      it('should return the value of λOrOptional if it is a function', () => {
        const none = None();

        expect(none.or(() => Optional.Some(4)).value).to.equal(4);
      });

      it('should return the value of λOrOptional if it is an Optional instance', () => {
        const none = None();

        expect(none.or(Optional.Some(3)).value).to.equal(3);
      });
    });

    describe('recover(λ)', () => {
      it('should return a Some wrapping the value returned by λ', () => {
        const expected = 3;

        const some = None().recover(constant(expected));

        expect(some.valuePresent).to.equal(true);
        expect(some.get()).to.equal(expected);
      });
    });

    describe('nullableMap(λ)', () => {
      it('should return a None()', () => {
        expect(None().nullableMap(increment).valueAbsent).to.equal(true);
      });
    });

    describe('map(λ)', () => {
      it('should return a None()', () => {
        expect(None().map(increment).valueAbsent).to.equal(true);
      });
    });

    describe('tap(λ)', () => {
      it('should return a None()', () => {
        expect(None().tap(increment).valueAbsent).to.equal(true);
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

    describe('reject(λ)', () => {
      it('should return a None()', () => {
        expect(None().reject(constant(true)).valueAbsent).to.equal(true);
        expect(None().reject(constant(false)).valueAbsent).to.equal(true);
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
        const message = 'a';

        try {
          None().get(message);

          expect('This should not happen').to.equal('but it did!');
        } catch (error) {
          expect(error.message).to.equal(message);
          // Do nothing!
        }
      });
    });

    describe('match(callbacks)', () => {
      it('should execute callback.None if it exists', () => {
        const expected = 3;

        expect(None().match({ None: constant(expected) })).to.equal(expected);
      });

      it('should just throw undefined when the callback.None callback does not exist', () => {
        try {
          None().match({});

          expect(false).to.equal(true);
        } catch (error) {
          expect(error).to.equal(undefined);
        }
      });
    });
  });
});
