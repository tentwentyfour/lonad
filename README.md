
# Lonad
by [Florian Simon](https://github.com/floriansimon1)

TypeScript Support by [Marx Jason](https://github.com/xxjasonxx1996)

*Like lodash, but for monads…*

![node](https://img.shields.io/node/v/lonad)
[![npm](https://img.shields.io/npm/v/lonad)](https://www.npmjs.com/package/lonad)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html)

## Focus

This currently provides `Optional` and `Result` types in Javascript & Typescript.

What's different in this `Maybe`/`Optional`/`Either`/`Result` implementation? Here, pragmatism is valued above fantasy-land compliance. lonad draws inspiration on Haskell's `Maybe`, and, like lodash, tortures nice concepts to put emphasis on user-friendliness and convenience.

Another notable difference from folktale's `Result`: lonad's `Result` handles asynchronous computation chains.


## TypeScript support

This library is written in Typescript and provides type definitions for Typescript users.

It is also written in a way that allows Typescript to infer types in most cases, so you don't have to specify them manually.

Although, it is recommended to use TypeScript, it is not mandatory. The library is written in a way that allows it to be used in Javascript projects without any hassle.

> Be aware that version `0.3.0` adds types in a limited way. This is due to the fact that Typescript curried functions are not supported yet.

### IMPORTANT:
The usage of `Typescript 4.9.5` or higher is recommended. Versions below `4.9.5` may not be able to infer types in certain cases.

### Example

```ts
import { Result } from 'lonad';

const result = Result.expect(42) // Infered type: Result<number>
  .map(x => x * 2)
  .tap(console.log) // 84
  .map(async x => x + 2) // Promise<number>
  .tap(console.log) // 86
  .get(); // Promise<number>

```

## Installing


### Node.js

`$ npm install lonad`

Once installed, you can import the library using `import` or `require`:

```js
import { Optional, Result } from 'lonad';
```

```js
const { Optional, Result } = require('lonad');
```


### Browser

`$ bower install lonad`

### CDN

> Currently unavailable!

#### ES6
```html
<script src="https://unpkg.com/lonad/bundle/lonad-bundle.js"></script>
```
Or minified version (recommended for production `~17kb`):
```html
<script src="https://unpkg.com/lonad/bundle/lonad-bundle.min.js"></script>
```
Usage:
```html
<script>
  const { Optional, Result } = lonad;
</script>
```

#### As a module
```html
<script type="module" src="https://unpkg.com/lonad/lonad-bundle.es.js"></script>
```

## ROADMAP

* [x] `Optional` type
* [x] `Result` type
* [x] Typescript support
* [x] Bundled version
* [ ] Further improve Typescript support
* [ ] Write documentation for the `generator` systems
* [ ] Immutable `Optional` and `Result` types.


## TESTS

To run the tests, simply execute:

`$ npm run test`

## What is an `Optional`



An `Optional` is, as its name suggests, a wrapper for a value that can potentially be absent. It is written as an object that can have two potential states, `Some` or `None`. When an `Optional` is a `Some`, it means that a value is present. When it's a `None`, it means that the value is absent.



### What's the point?



This allows you to avoid the dreaded `x is undefined` class of Javascript errors completely, by providing a safe API, that the rest of this document will explain.



## What is a `Result`



A `Result` models the result of a computation chain in a functional way. In other words, it encapsulates the result of executing code. It can handle asynchronous code, code that may fail with a specific value and even computation chains that may be interrupted (*aborted*) in the middle of the chain if some error occurred. A `Result` can have one of the 4 following subtypes:



* `Ok`: Similar to `Optional`'s `Some`, models return values of computation chains.

* `Error`: Similar to `Optional`'s `None`, models chains that errored in a recoverable way. The difference with `None` is that errors can also have values.

* `Aborted`: Same as `Error`, but it's not recoverable.

* `Pending`: Wraps the 3 other types in asynchronous contexts.



### What's the point?



The point here is the same as for `Optional` (safety), but with a focus on readability. Returning a `Result` from a function signals that your function may fail and gives you details about the failure when it occurs. In certain contexts, you can also see it as an interruptible `Promise` chain. If you never liked `async`/`await` because of the verbosity of error handling using `try`/`catch`, then you'll love `Result`. A nice advantage is that it makes it easy to be specific about errors without writing tons of try catch blocks, which makes your error-handling code more testable.



### Recipes



#### `Optional` recipes

| Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
|-----|-------------|
| `get` | Get the value or **throws** an error. |
| `getOrElse` | Get the value or return a default value. |
| `filter` | Checks whether the Optional's value passes a predicate. |
| `reject` | Checks whether the Optional's value fails a predicate. |
| `or` | Returns the original optional if it is present, or the return value of the provided replacement function if the original value is not present. |
| `map` | Alias for `transform`. |
| `nullableMap` | Maps the value of the Optional to a new value and allows the transformation to return `null` or `undefined`. |
| `flatMap` | Maps the value of the Optional to a new value and returns either the new value or itself if the Optional is `None`. |
| `transform` | Maps the value of the Optional to a new value. |
| `match` | Pattern matches on the optional value and returns the result of executing the corresponding function for the matching case. |
| `property` | Maps the value of the Optional to a property of the value and wraps the value in an `Some Optional`. |
| `nullableProperty` | Maps the value of the Optional to a property of the value and wraps the value in an `Optional`. |
| `optionalProperty` | Maps the value of the Optional to a property of the value. |
| `tap` | Executes a function if the Optional is present. |
| `satisfies` | Checks whether the Optional satisfies a predicate. |
| `valueEquals` | Checks whether the Optional's value is equal to another value. |
| `recover` | Recovers from a `None` Optional. |
| `replace` | Replace the value of the Optional. |

* [⚓](#optional-construction) Constructing an `Optional`.

* [⚓](#optionalfromnullablenullablevalue) Constructing an `Optional` using a nullable value.

* [⚓](#optionals-mapλ) Transforming the value wrapped in an `Optional`.

* [⚓](#optionals-replacevalue) Changing the value wrapped in an `Optional` to another value.

* [⚓](#optionals-get) Unsafe unboxing of `Optional` values.

* [⚓](#optional-value-presence) Checking presence or absence of `Optional` value.

* [⚓](#optionals-satisfiespredicate) Checking that a wrapped value satisfies a predicate.

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

* [⚓](#optionalwhentruthy-value) Construct a new Some if a condition is met.

* [⚓](#optionals-tapλ) Executing a function on a Some without changing it.



#### `Result` recipes


| Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
| ----- | ----------- |
| [⚓](#result’s-get) `get` | Returns the `value` of the result. If the result is not `Ok`, it will throw an **error**. |
| [⚓](#result’s-getorelse) `getOrElse` | Returns the `value` of the result. If the result is not Ok, it will return the `value` provided. |
| [⚓](#result’s-merge) `merge` | Returns the result value if it is `Ok`, otherwise returns the `error` value. |
| [⚓](#result’s-recover) `recover` | Recovers from an error if an error occured. |
| [⚓](#result’s-replace) `replace` | Replace the `value` of the result. Will only replace the value if the result is `Ok`. |
| [⚓](#result’s-property) `property` | Returns the wrapped property value if the result contains an object. Will always return an `Ok` result even if the property was not found. |
| [⚓](#result’s-expectproperty) `expectProperty` | Returns the wrapped property value if the result contains an object. Will return an `Error` result if the property was not found. |
| [⚓](#result’s-tap) `tap` | Tap into the result and perform an action. Will only perform the action if the result is `Ok`. |
| [⚓](#result’s-taperror) `tapError` | Tap the error value if result is an `error`. |
| [⚓](#result’s-satisfies) `satisfies` | Test if the result satisfies a predicate. Will only test the predicate if the result is `Ok`. |
| [⚓](#result’s-valueequals) `valueEquals` | Test if the result value equals another value. Will only test the equality if the result is `Ok`. |
| [⚓](#result’s-map) `map` | Maps the result value, returns an `Ok` result even if the passed value is `undefined`. |
| [⚓](#result’s-maperror) `mapError` | Map the error value if result is an `error`. |
| [⚓](#result’s-expectmap) `expectMap` | Maps the result `value`, returns an Error result if the passed value is `undefined`. |
| [⚓](#result’s-transform) `transform` | Alias for `map`. Maps the result value, returns an Ok result even if the passed value is `undefined`. |
| [⚓](#result’s-flatmap) `flatMap` | Maps the result value and *flattens* the result. |
| [⚓](#result’s-reject) `reject` | Rejects the result if the predicate returns true. Will only test the predicate if the result is `Ok`. |
| [⚓](#result’s-filter) `filter` | Filters the result if the predicate returns true. Will only test the predicate if the result is `Ok`. |
| [⚓](#result’s-match) `match` | Match the result type and return a value. |
| [⚓](#result’s-abortonerror) `abortOnError` | Aborts the excution if the result is an `error`. |
| [⚓](#result’s-abortonerrorwith) `abortOnErrorWith` | Aborts the excution if the result is an `error` with an error value. |
| [⚓](#result’s-recoverwhen) `recoverWhen` | Recover the result if it is an `error` and the predicate returns true. |
| [⚓](#result’s-asynchronous) `asynchronous` | Converts the result to a `asyncronous` result. |
| [⚓](#result’s-topromise) `toPromise` | Converts the result to a `promise`. |
| [⚓](#result’s-tooptional) `toOptional` | Converts the result to an `optional` object. |


## General tips



What is called a nullable here is a value that is either `null` or `undefined`.



You can use `new` to instantiate `Result`/`Optional`, but it's not mandatory. Just using `Optional.Some(3)` is also OK.



Every `Optional` or `Result` method is available in auto-curried, instance-last parameter version, which allows you to write the following code:



```javascript

const  optionals  = [1, 2, 3].map(Optional.Some);

const  addThree  =  x  =>  x  +  3;



// This evaluates to [4, 5, 6].

const  results  =  optionals

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

const  present1  =  Some(value);

const  absent1  =  None();



const  present2  =  new  Some(value);

const  absent2  =  new  None();

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



*Note: using this is **NOT** recommended!*.



```javascript

// This will evaluate to 2.

Some(2).get();



// This will throw.

None().get();



// You can also pass a custom exception message:

try {

None().get("message");

} catch (error) {

// This will log "message".

console.log(error.message);

}

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



#### `Optional`'s `satisfies(predicate)`



```javascript

// This evaluates to true.

Some(3).satisfies(x  =>  x  ===  3);



// These evaluate to false.

Some(3).satisfies(x  =>  x  ===  4);

None().satisfies(() =>  true);

```



#### `Optional`'s `getOrElse(value)`



```javascript

// This will evaluate to 2.

Some(2).getOrElse(0);



// This will evaluate to 0.

None().getOrElse(0);

```



#### `Optional`'s `map(λ)`



*`map` is also aliased to `transform` if you have a tendency to confuse `Optional`'s `map` with `Array`'s.*



```javascript

// This will evaluate to 3.

Some(2).map(x  =>  x  +  1).getOrElse(0);



// This will evaluate to 0.

None().map(x  =>  x  +  1).getOrElse(0);

```



#### `Optional`'s `replace(value)`



```javascript

// This will evaluate to 3.

Some(2).replace(3).getOrElse(0);



// This will evaluate to 0.

None().replace(3).getOrElse(0);

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



function  retrieveUserFromDatabase(id) {

if (id  ===  1) {

return  Some({ id, carId: Some(1) });

} else  if (id  ===  2) {

return  Some({ id, carId: None() });

}



return  None();

}



function  retrieveCarFromDatabase(id) {

if (id  ===  1) {

return  Some({ id, model: 'Ford T' });

}



return  None();

}

```



#### `Optional`'s `match(matcher)`



```javascript

// This evaluates to 1.

Some(3).match({

Some: value  =>  value  -  2,

None: () =>  2

});



// This evaluates to 3.

Some(3).match({ None: () =>  2 });



// This evaluates to 1.

Some(3).match({ Some: value  =>  value  -  2 });



// This will throw.

None().match({ Some: value  =>  value  -  2 });



// This evaluates to 1.

None().match({ None: () =>  1 });

```



#### `Optional`'s `recover(λ)`



*Kind of equivalent to `map` but for `None` instances.*



```javascript

// This evaluate to Some(3).

None().recover(() =>  Some(3));



// This evaluates to Some(2).

Some(2).recover(() =>  3);

```



#### `Optional`'s `or(λOrOptional)`



*When passed a function, it is kind of equivalent to `flatMap` but for `None` instances.*



```javascript

// These evaluate to Some(3).

None().or(Some(3));

None().or(() =>  Some(3));



// These evaluate to None().

None().or(None());

None().or(None);



// These evaluate to Some(2).

Some(2).or(None);

Some(2).or(Some(3));

Some(2).or(() =>  Some(3));

```



#### `Optional` serialization



```javascript

// As long as the wrapped value is serializable, you can serialize using JSON.stringify.

const  serialized  =  JSON.stringify(Some(3));



// And deserialize it using Optional.fromParsedJson. This evaluates to Some(3).

Optional.fromParsedJson(JSON.parse(serialized));

```



#### `Optional.when(truthy, value)`



```javascript

// These evaluate to None().

Optional.when(null);

Optional.when(undefined);

Optional.when(0);

Optional.when('');

Optional.when(NaN);



// These evaluate to Some(4).

Optional.when(true, 4);

Optional.when(' ', 4);

Optional.when({}, 4);

Optional.when(1, 4);

```



#### `Optional.first(optionals)`



```javascript

// This evaluates to None().

Optional.first([None(), None(), None()]);



// These evaluate to Some(3).

Optional.first([Some(3), None(), None()]);

Optional.first([None(), Some(3), None()]);

Optional.first([None(), None(), Some(3)]);

```



#### `Optional.all(optionals)`



*Works a bit like `Promise.all`.*



```javascript

// These evaluate to None().

Optional.all([Some(3), Some(3), None()]);

Optional.all([Some(3), None(), Some(3)]);

Optional.all([None(), Some(3), Some(3)]);



// This evaluates to Some([1, 2, 3]).

Optional.all([Some(1), Some(2), Some(3)]);

```



#### `Optional`'s `tap(λ)`



```javascript

// This prints 'hello' and evaluates to Some(3).

Optional.Some(3).tap(x  =>  console.log("Hello") ||  x  +  1);



// This does not call λ and does not print 'Test'.

Optional.None().tap(x  =>  console.log("Test"));

```

### Result

Wraps a value that can either be a `Ok` or a `Error`. It is useful for error handling and for functions that can fail.

#### Ok

`Result` subclass that wraps a value that represents a successful operation.

```js
const myResult = Result.Ok(3);

// This will evaluate to 3.
console.log(myResult.value);
```

> Note, it is bad pratice to directly access properties, use appropriate methods instead.

#### Error

`Result` subclass that wraps a value that represents a failed operation.

```js
const myResult = Result.Error('Something went wrong');

// This will evaluate to 'Something went wrong'.
console.log(myResult.error);
```

> Note, it is bad pratice to directly access properties, use appropriate methods instead.

#### Aborted

`Result` subclass that wraps a value that represents an aborted operation. This breaks the chain of operations. It cannot be recovered from.

```js
const myResult = Result.Aborted('Something went wrong');

// This will evaluate to 'Something went wrong'.
console.log(myResult.error);
```

> Note, it is bad pratice to directly access properties, use appropriate methods instead.

#### Pending

`Result` subclass that wraps a value that represents a pending operation. Once a single link in a chain of operations is pending, the whole chain becomes asynchronous.

```js
const myResult = Result.Pending(Promise.resolve(3));

// This will evaluate to 3.
console.log(await myResult.promise);
```

> Note, it is bad pratice to directly access properties, use appropriate methods instead.

#### `Result`'s `expect(value)`

The `expect` method is used to wrap a value that can either be a `Ok` or a `Error`. The value can also be asynchronous.

```js
// This evaluates to Ok(3).
Result.expect(3);

// This evaluates to Error('Something went wrong').
Result.expect(undefined);

// This evaluates to Pending(3).
Result.expect(Promise.resolve(3));
```

#### `Result`'s `get`

Returns the value of the `Result` instance. If the instance is a `Error` or `Aborted` it will **throw** an error.

Definition:
```ts
function get(): T | Promise<T>;
```

Example:
```js
// This evaluates to 3.
Result.Ok(3).get();

// This will throw.
Result.Error('Something went wrong').get();
```

#### `Result`'s `getOrElse`

Returns the value of the `Result` instance. If the instance is a `Error` or `Aborted` it will return the provided default value.

Definition:
```ts
function getOrElse<Y>(value?: Y): T | Y | Promise<T> | Promise<Y>;
```

Example:
```js
// This evaluates to 3.
Result.Ok(3).getOrElse();

// This evaluates to 4.
Result.Error('Something went wrong').getOrElse(4);
```

#### `Result`'s `merge`

Returns the result value if it is Ok, otherwise returns the error value.

Definition:
```ts
function merge(): T | Promise<T>;
```

Example:
```js
// This evaluates to 3.
Result.Ok(3).merge();

// This evaluates to 'Something went wrong'.
Result.Error('Something went wrong').merge();
```

#### `Result`'s `recover`

Recovers from an error if an error occured.

Definition:
```ts
function recover<R>(λ: (x: any) => R): Result<T | R>;
```

Example:
```js
// This evaluates to Ok(3).
Result.Ok(3).recover(() => 4);

// This evaluates to Ok(4).
Result.Error('Something went wrong').recover(() => 4);
```

#### `Result`'s `replace`

Replace the value of the result. Will only replace the value if the result is Ok.

Definition:
```ts
function replace<Y = T>(value: Y | Promise<Y>): Result<Y>;
```

Example:
```js
// This evaluates to Ok(4).
Result.Ok(3).replace(4);

// This evaluates to Ok(4).
Result.Error('Something went wrong').replace(4);

// This evaluates to Aborted('Something went wrong').
Result.Aborted('Something went wrong').replace(4);
```

#### `Result`'s `property`

Returns the wrapped property value if the result contains an object. Will always return an Ok result even if the property was not found.

Definition:
```ts
function property<Y extends string>(propertyName: Y): Result<T[Y]>;
```

Example:
```js
// This evaluates to Ok(3).
Result.Ok({ a: 3 }).property('a');

// This evaluates to Ok(undefined).
Result.Ok({ a: 3 }).property('b');

// This evaluates to Error('Something went wrong').
Result.Error('Something went wrong').property('a');
```

#### `Result`'s `expectProperty`

Returns the wrapped property value if the result contains an object. Will return an Error result if the property was not found.

Definition:
```ts
function expectProperty<Y extends string>(propertyName: Y): Result<T[Y]>;
```

Example:
```js
// This evaluates to Ok(3).
Result.Ok({ a: 3 }).expectProperty('a');

// This evaluates to Error('Property "b" not found').
Result.Ok({ a: 3 }).expectProperty('b');

// This evaluates to Error('Something went wrong').
Result.Error('Something went wrong').expectProperty('a');
```

#### `Result`'s `tap`

Tap into the result and perform an action. Will only perform the action if the result is Ok.

Definition:
```ts
function tap(λ: (x: T) => void | Promise<void>): Result<T>;
```

Example:
```js
// This prints 3.
Result.Ok(3).tap(x => console.log(x));

// This prints also prints 3.
Result.Ok(3).tap(console.log);

// This does not print anything.
Result.Error('Something went wrong').tap(x => console.log(x));
```

#### `Result`'s `tapError`

Tap the error value if result is an error.

Definition:
```ts
function tapError(λ: (x: any) => Promise<void> | void): Result<T>;
```

Example:
```js
// This prints 'Something went wrong'.
Result.Error('Something went wrong').tapError(x => console.log(x));

// This does not print anything.
Result.Ok(3).tapError(x => console.log(x));
```

#### `Result`'s `satisfies`

Test if the result satisfies a predicate. Will only test the predicate if the result is Ok.

Definition:
```ts
function satisfies(predicate: (x: T) => T | boolean): boolean | Promise<boolean>;
```

Example:
```js
// This evaluates to true.
Result.Ok(3).satisfies(x => x === 3);

// This evaluates to false.
Result.Ok(3).satisfies(x => x === 4);

// This evaluates to false.
Result.Error('Something went wrong').satisfies(x => x === 3);
```

#### `Result`'s `valueEquals`

Test if the result value equals another value. Will only test the equality if the result is Ok.

Definition:
```ts
function valueEquals(value: T): boolean | Promise<boolean>;
```

Example:
```js
// This evaluates to true.
Result.Ok(3).valueEquals(3);

// This evaluates to false.
Result.Ok(3).valueEquals(4);

// This evaluates to false.
Result.Error('Something went wrong').valueEquals(3);
```

#### `Result`'s `map`

Maps the result value, returns an Ok result even if the passed value is undefined.

Definition:
```ts
function map<Y>(λ: (x: T) => Y | Promise<Y>): Result<Y>;
```

Example:
```js
// This evaluates to Ok(4).
Result.Ok(3).map(x => x + 1);

// This evaluates to Ok(undefined).
Result.Ok(3).map(x => undefined);

// This evaluates to Error('Something went wrong').
Result.Error('Something went wrong').map(x => x + 1);
```

#### `Result`'s `mapError`

Map the error value if result is an error.

Definition:
```ts
function mapError(λ: (x: any) => Promise<any> | any): Result<T>;
```

Example:
```js
// This evaluates to Error('tapped error').
Result.Error('Something went wrong').mapError(x => 'tapped error');

// This evaluates to Ok(3).
Result.Ok(3).mapError(x => 'tapped error');
```

#### `Result`'s `expectMap`

Maps the result value, returns an Error result if the passed value is undefined.

Definition:
```ts
function expectMap<Y>(λ: (x: T) => Y | Promise<Y>): Result<Y>;
```

Example:
```js
// This evaluates to Ok(4).
Result.Ok(3).expectMap(x => x + 1);

// This evaluates to Error('Expected value but got undefined').
Result.Ok(3).expectMap(x => undefined);

// This evaluates to Error('Something went wrong').
Result.Error('Something went wrong').expectMap(x => x + 1);
```

#### `Result`'s `flatMap`

Maps the result value and flattens the result. Returns an Error result if the passed value is undefined.

Definition:
```ts
function flatMap<Y>(λ: (x: T) => Y | Promise<Y> | Result<Y>): Result<Y>;
```

Example:
```js
// This evaluates to Ok(4).
Result.Ok(3).flatMap(x => x + 1);

// This evaluates to Ok(4).
Result.Ok(3).flatMap(x => Result.Ok(x + 1));

// This evaluates to Error('Expected value but got undefined').
Result.Ok(3).flatMap(x => undefined);

// This evaluates to Error('Something went wrong').
Result.Error('Something went wrong').flatMap(x => x + 1);
```

#### `Result`'s `reject`

Rejects the result if the predicate returns true. Will only test the predicate if the result is Ok.

Definition:
```ts
function reject(predicate: (x: T) => Promise<boolean> | boolean): Result<T>;
```

Example:
```js
// This evaluates to Ok(3).
Result.Ok(3).reject(x => x === 4);

// This evaluates to Error('Rejected').
Result.Ok(3).reject(x => x === 3);

// This evaluates to Error('Something went wrong').
Result.Error('Something went wrong').reject(x => x === 3);
```

#### `Result`'s `filter`

Allows the result if the predicate returns true. Will only test the predicate if the result is Ok.

Definition:
```ts
function filter(predicate: (x: T) => Promise<boolean> | boolean): Result<T>;
```

Example:
```js
// This evaluates to Ok(3).
Result.Ok(3).filter(x => x === 3);

// This evaluates to Error('Filtered').
Result.Ok(3).filter(x => x === 4);

// This evaluates to Error('Something went wrong').
Result.Error('Something went wrong').filter(x => x === 3);
```

#### `Result`'s `match`

Matches the result type and returns the result of the matched function.

Definition:
```ts
function match<Y>(λ: {
  Ok: (x: T) => Y | Promise<Y>;
  Error: (x: any) => Y | Promise<Y>;
  Aborted: (x: any) => Y | Promise<Y>;;
}): Y | Promise<Y>;
```

Example:
```js
// This evaluates to 3.
Result.Ok('some Value').match({
  Ok: (x) => 3,
  Error: (x) => 4,
  Aborted: (x) => 5,
});

// This evaluates to 4.
Result.Error('Something went wrong').match({
  Ok: () => 3,
  Error: () => 4,
  Aborted: () => 5,
});

// This evaluates to 5.
Result.Aborted('Something went wrong').match({
  Ok: () => 3,
  Error: () => 4,
  Aborted: () => 5,
});
```

#### `Result`'s `abortOnError`

Aborts the excution if the result is an error.

Definition:
```ts
function abortOnError(): Result<T>;
```

Example:
```js
// This evaluates to Ok(3).
Result.Ok(3).abortOnError();

// This evaluates to Aborted('Something went wrong').
Result.Error('Something went wrong').abortOnError();

// This evaluates to Ok(4).
Result.expect(3)
  .map(x => x + 1)
  .abortOnError();

// This evaluates to Aborted('Value is not equal').
Result.expect(3)
  .map(x => x + 1)
  .valueEquals(5)
  .abortOnError();
```

#### `Result`'s `abortOnErrorWith`

Aborts the excution if the result is an error with an error value.

```ts
function abortOnErrorWith(error: any): Result<T>;
```

Example:
```js
// This evaluates to Ok(3).
Result.Ok(3).abortOnErrorWith('Something went wrong');

// This evaluates to Aborted('Something went wrong').
Result.Error('other error').abortOnErrorWith('Something went wrong');

// This evaluates to Ok(4).
Result.expect(3)
  .map(x => x + 1)
  .abortOnErrorWith('Something went wrong');

// This evaluates to Aborted('Something went wrong').
Result.expect(3)
  .map(x => x + 1)
  .valueEquals(5)
  .abortOnErrorWith('Something went wrong');
```

#### `Result`'s `recoverWhen`

Recover the result if it is an error and the predicate returns true.

Definition:
```ts
function recoverWhen<Y>(predicate: (x: T) => boolean | Promise<boolean>, λ: (x: T) => Y): Result<Y>;
```

Example:
```js
// This evaluates to Ok(3).
Result.Ok(3).recoverWhen(x => true, x => 4);

// This evaluates to Ok(4).
Result.Error('Something went wrong').recoverWhen(x => true, x => 4);

// This evaluates to Error('Something went wrong').
Result.Error('Something went wrong').recoverWhen(x => false, x => 4);
```

#### `Result`'s `asynchronous`

Converts the result to a asyncronous result.

Definition:
```ts
function asynchronous(): Result<T>;
```

Example:
```js
// This evaluates to Pending(Ok(3)).
Result.Ok(3).asynchronous();

// This evaluates to Pending(Error('Something went wrong')).
Result.Error('Something went wrong').asynchronous();
```

#### `Result`'s `toPromise`

Converts the result to a promise.

Definition:
```ts
function toPromise(): Promise<T>;
```

Example:
```js
// This evaluates to 3.
await Result.Ok(3).toPromise();

// This throws an error.
await Result.Error('Something went wrong').toPromise();

// This evaluates to 4.
await Result.expect(3)
  .map(x => x + 1)
  .toPromise();
```

#### `Result`'s `toOptional`

Converts the result to an optional object.

Definition:
```ts
function toOptional(): Optional<T>;
```

Example:
```js
// This evaluates to Some(3).
Result.Ok(3).toOptional();

// This evaluates to None.
Result.Error('Something went wrong').toOptional();

// This evaluates to Some(4).
Result.expect(3)
  .map(x => x + 1)
  .toOptional();
```
