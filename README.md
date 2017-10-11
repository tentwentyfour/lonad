# Lonad

*Like lodash, but for monads…*

## Focus

This currently provides `Optional` and `Result` quasi-monadic types in Javascript.

What's different in this `Maybe`/`Optional`/`Either`/`Result` implementation? Here, pragmatism is valued above fantasy-land compliance. Like lodash, lonad draws inspiration on Haskell's `Maybe` and tortures the concept to put emphasis on user-friendliness and convenience.

## Installing

`$ npm install lonad`

The library is currently not going transpiled, so you have to transpile it yourself inside your project.

## What is an `Optional`

An `Optional` is, as its name suggests, a wrapper for a value that can potentially be absent. It is written as an object that can have two potential states, `Some` or `None`. When an `Optional` is a `Some`, it means that a value is present. When it's a `None`, it means that the value is absent.

### What's the point?

This allows you to avoid the dreaded `x is undefined` class of Javascript errors completely, by providing a safe API, that the rest of this document will explain.

### Recipes

* [⚓](#optional-construction) Constructing an `Optional`.
* [⚓](#optionalfromnullablenullablevalue) Constructing an `Optional` using a nullable value.
* [⚓](#optionals-mapλ) Transforming the value wrapped in an `Optional`.
* [⚓](#optionals-get) Unsafe unboxing of `Optional` values.
* [⚓](#optional-value-presence) Checking presence or absence of `Optional` value.
* [⚓](#optionals-getorelsevalue) Safe unboxing of `Optional` values.
* [⚓](#optionals-filterλ) Transforming a `Some` into a `None` when a condition is met.
* [⚓](#optionals-rejectλ) Transforming a `Some` into a `None` when a condition is not met.
* [⚓](#optionals-propertypropertyname) Transforming a `Some` into a `Some` wrapping a property of the initial `Some`'s wrapped value.
* [⚓](#optionals-nullablepropertypropertyname) Transforming a `Some` into an `Optional` based on a nullable property of the initial `Some`'s wrapped value.
* [⚓](#optionals-optionalpropertypropertyname) Transforming a `Some` into an `Optional` based on a nullable property of the initial `Some`'s wrapped value.
* [⚓](#optionals-valueequalsvalue) Checking if a `Some`'s value equals a given value.
* [⚓](#optionals-flatmapλ) Transforming a `Some` into another `Optional`.
* [⚓](#optionals-matchmatcher) `Optional` pattern matching.
* [⚓](#optionals-orλoroptional) Selecting the first available `Some`.
* [⚓](#optionalfirstoptionals) Selecting the first available `Some` in an array.
* [⚓](#optionals-recoverλ) Transforming a `None` into a `Some`.
* [⚓](#optionals-orλoroptional) Transforming a `None` into an `Optional`.
* [⚓](#optional-serialization) `Optional` serialization.
* [⚓](#optionalalloptionals) Constructing a `Some` wrapping an array of values from other `Some` instances.
* [⚓](#optionalwhentruthy) Construct a new Some if a condition is met.

## General tips

What is called a nullable here is a value that is either `null` or `undefined`.

You can use `new` to instantiate `Result`/`Optional`, but it's not mandatory. Just using `Optional.Some(3)` is also OK.

Every `Optional` or `Result` method is available in auto-curried, instance-last parameter version, which allows you to write the following code:

```javascript
const optionals = [1, 2, 3].map(Optional.Some);
const addThree  = x => x + 3;

const results = optionals
.map(Optional.map(addThree))
.map(Optional.getOrElse(0));
```

## Reference (by example)

### Optional

*Wrapper for values that can be absent.*

#### Some

*`Optional` subtype for present values.*

#### None

*`Optional` subtype for absent values.*

#### `Optional` construction

```javascript
const present1 = Some(value);
const absent1  = None();

const present2 = new Some(value);
const absent2  = new None();
```

#### `Optional.fromNullable(nullableValue)`

```javascript
// These will evaluate to Some instances.
Optional.fromNullable(3);
Optional.fromNullable(0);
Optional.fromNullable('');
Optional.fromNullable(NaN);

// These will evaluate to None().
Optional.fromNullable(null);
Optional.fromNullable(undefined);
```

#### `Optional`'s `get()`

*Note: using this is **NOT** recommended!*

```javascript
// This will evaluate to 2.
Some(2).get();

// This will throw.
None().get();
```

#### `Optional` value presence

*Note: writing a check based on these flags, then doing `optional.get()` is a **very bad** code smell.*

```javascript
// These will evaluate to true.
Some(2).valuePresent;
None().valueAbsent;

// These will evaluate to false.
None().valuePresent;
Some(2).valueAbsent;
```

#### `Optional`'s `getOrElse(value)`

```javascript
// This will evaluate to 2.
Some(2).getOrElse(0);

// This will evaluate to 0.
None().getOrElse(0);
```

#### `Optional`'s `map(λ)`

```javascript
// This will evaluate to 3.
Some(2).map(x => x + 1).getOrElse(0);

// This will evaluate to 0.
None().map(x => x + 1).getOrElse(0);
```

#### `Optional`'s `filter(λ)`

*Opposite of `reject`.*

```javascript
// This will evaluate to Some(2).
Some(2).filter(Boolean);

// This will evaluate to None().
Some(0).filter(Boolean);

// This will evaluate to None().
None().filter(Boolean);
```

#### `Optional`'s `reject(λ)`

*Opposite of `filter`.*

```javascript
// This will evaluate to None().
Some(2).reject(Boolean);

// This will evaluate to Some(0).
Some(0).reject(Boolean);

// This will evaluate to None().
None().reject(Boolean);
```


#### `Optional`'s `property(propertyName)`

```javascript
// This will evaluate to Some(2).
Some({ a: 2 }).property('a');

// This will evaluate to None().
None().property('a');
```


#### `Optional`'s `nullableProperty(propertyName)`

```javascript
// This will evaluate to Some(2).
Some({ a: 2 }).nullableProperty('a');

// This will evaluate to None().
Some({ a: 2 }).nullableProperty('b');

// This will evaluate to None().
None().nullableProperty('a');
```


#### `Optional`'s `optionalProperty(propertyName)`

```javascript
// This will evaluate to Some(2).
Some({ a: Some(2) }).optionalProperty('a');

// This will evaluate to None().
Some({ a: None() }).optionalProperty('a');

// This will evaluate to None().
None().optionalProperty('a');
```

#### `Optional`'s `valueEquals(value)`

*This functions uses triple equal (`===`) for comparisons.*

```javascript
// This will evaluate to true.
Some(2).valueEquals(2);

// This will evaluate to false.
Some(3).valueEquals(2);

// This will evaluate to false.
None().valueEquals('a');
```

#### `Optional`'s `flatMap(λ)`

*This is used to nest transformations that return `Optional` instances, as you can see in the example below.*

```javascript
// This will evaluate to Some('Ford T').
retrieveUserFromDatabase(1)
.optionalProperty('carId')
.flatMap(retrieveCarFromDatabase)
.property('model')

// This will evaluate to None().
retrieveUserFromDatabase(2)
.optionalProperty('carId')
.flatMap(retrieveCarFromDatabase)
.property('model')

// This will evaluate to None().
retrieveUserFromDatabase(3)
.optionalProperty('carId')
.flatMap(retrieveCarFromDatabase)
.property('model')

function retrieveUserFromDatabase(id) {
  if (id === 1) {
    return Some({ id, carId: Some(1) });
  } else if (id === 2) {
    return Some({ id, carId: None() });
  }

  return None();
}

function retrieveCarFromDatabase(id) {
  if (id === 1) {
    return Some({ id, model: 'Ford T' });
  }

  return None();
}
```

#### `Optional`'s `match(matcher)`

```javascript
// This evaluates to 1.
Some(3).match({
  Some: value => value - 2,
  None: () => 2
});

// This evaluates to 3.
Some(3).match({ None: () => 2 });

// This evaluates to 1.
Some(3).match({ Some: value => value - 2 });

// This will throw.
None().match({ Some: value => value - 2 });

// This evaluates to 1.
None().match({ None: () => 1 });
```

#### `Optional`'s `recover(λ)`

*Kind of equivalent to `map` but for `None` instances.*

```javascript
// This evaluate to Some(3).
None().recover(() => Some(3));

// This evaluates to Some(2).
Some(2).recover(() => 3);
```

#### `Optional`'s `or(λOrOptional)`

*When passed a function, it is kind of equivalent to `flatMap` but for `None` instances.*

```javascript
// These evaluate to Some(3).
None().or(Some(3));
None().or(() => Some(3));

// These evaluate to None().
None().or(None());
None().or(None);

// These evaluate to Some(2).
Some(2).or(None);
Some(2).or(Some(3));
Some(2).or(() => Some(3));
```

#### `Optional` serialization

```javascript
// As long as the wrapped value is serializable, you can serialize using JSON.stringify.
const serialized = JSON.stringify(Some(3));

// And deserialize it using Optional.fromParsedJson. This evaluates to Some(3).
Optional.fromParsedJson(JSON.parse(serialized));
```

#### `Optional.when(truthy)`

```javascript
// These evaluate to None().
Optional.when(null);
Optional.when(undefined);
Optional.when(0);
Optional.when('');
Optional.when(NaN);

// These evaluate to Some(undefined).
Optional.when(true);
Optional.when(' ');
Optional.when(1);
Optional.when({});
```

#### `Optional.first(optionals)`

```javascript
// This evaluates to None().
Optional.first([None(), None(), None()]);

// These evaluate to Some(3).
Optional.first([Some(3), None(),  None()]);
Optional.first([None(),  Some(3), None()]);
Optional.first([None(),  None(),  Some(3)]);
```

#### `Optional.all(optionals)`

*Works a bit like `Promise.all`.*

```javascript
// These evaluate to None().
Optional.all([Some(3), Some(3), None()]);
Optional.all([Some(3), None(),  Some(3)]);
Optional.all([None(),  Some(3), Some(3)]);

// This evaluates to Some([1, 2, 3]).
Optional.all([Some(1), Some(2), Some(3)]);
```
