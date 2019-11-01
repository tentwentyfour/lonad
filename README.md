
# Lonad
by [Florian Simon](https://github.com/floriansimon1)



*Like lodash, but for monads…*



## Focus



This currently provides `Optional` and `Result` types in Javascript.



What's different in this `Maybe`/`Optional`/`Either`/`Result` implementation? Here, pragmatism is valued above fantasy-land compliance. lonad draws inspiration on Haskell's `Maybe`, and, like lodash, tortures nice concepts to put emphasis on user-friendliness and convenience.



Another notable difference from folktale's `Result`: lonad's `Result` handles asynchronous computation chains.



## Installing


```bash
$ npm install lonad`
```



The library is currently not being transpiled, so you have to transpile it yourself inside your project.

## Running tests

```bash
~$ git clone https://github.com/tentwentyfour/lonad.git
~$ cd lonad && npm i
~$ npm test
```


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

## General tips

What is called a _nullable_ here is a value that is either `null` or `undefined`.



You can use `new` to instantiate `Result`/`Optional`, but it's not mandatory. Just using `Optional.Some(3)` is also OK.



Every `Optional` or `Result` method is available in an auto-curried, instance-last parameter version, which allows you to write the following code:



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

### `Result`

A model for the result of a computation chain.

#### Ok

`Result` subtype for truthy values.

#### Error

`Result` subtype for errors and falsy values.

#### Aborted

Like `Error`, but unrecoverable.

#### Pending

`Result` subtype for asynchronous data-types.

#### `Result` construction

A `Result` can be constructed by directly calling the subtype that you'd like to use:

```javascript
const result1 = Result.Ok(3);
const result2 = Result.Error({ message: 'Ooops' });
const result3 = Result.Pending();
const result4 = Result.Aborted();
```

More often, you'll find yourself using either one of `when`, `try` or `expect`.

#### `Result`'s `when(test, value, error)`

`when` evaluates the first argument passed to it, and returns `value` wrapped in an `Ok` if it's truthy, else it returns `error` wrapped in an `Error`:

```javascript
// This evaluates to Ok(3)
Result.when(true, 3, 'Oops');

// This evaluates to Error('Oops')
Result.when(false, 3, 'Oops');
```

#### `Result`'s `try(λ)`

If the result of executing `λ` is a `Result`, then this `Result` is returned.
If, however, the result of executing `λ` is a false, `null`, `undefined` or any scalar value, then it gets mapped to `Ok` for any values mapping to `Optional.Some` and to `Error` for any values mapping to `Optional.None`.

```javascript
// Evaluates to Ok(3)
Result.try(() => Result.Ok(3));

// Also evaluates to Ok(3)
Result.try(() => 3);

// Evaluates to Error()
Result.try(() => null);
```

#### `Result`'s `expect()`

```javascript
// This evaluates to Result.Error
Result.expect(null);

// This evaluates to Result.Ok()
Result.expect(3);

// This evaluates to either a Result.Ok or a Result.Aborted
Result.expect(axios.get('/api/version'));

// This evaluates to Ok()
Result.expect(Result.Ok(3));

// This evaluates to Error
Result.expect(Result.Error());

// This evaluates to Ok(x => x * 3)
Result.expect(x => x * 3);

// This evaluates to Ok(4)
Result.expect(Optional.Some(4));

// This evaluates to Error()
Result.expect(Optional.None());
```

#### `Result`'s `get`

`Result`'s `get` works similar to `Optional`'s [`get`](#optionals-get) in that it unwraps the raw value contained in your `Result`. However, `Result`'s `get` doesn't take a message.

Calling `get` on an `Error` or `Aborted` throws an error, while calling it on a `Pending` returns a `Promise`.

```javascript
// This evaluates to 6
Ok(3).map(x => x*2).get();

// Throws "Oops"
Error('Oops').get();
Aborted('Oops').get();

// Evalualtes to a Promise
Pending().get();
```

#### `Result`'s `merge`

__TODO: What's the use of this?__

```javascript
// This evaluates to 3
Ok(3).merge()

// This evaluates to 3 too
Error(3).merge()
```

#### `Result`'s `getOrElse(value)`

Unwraps the value from a `Result` if it is an `Ok`, else returns the substitute value passed to `getOrElse`.

```javascript

// This evaluates to 6
Ok(3).map(x => x * 2).getOrElse(8);

// This evaluates to 8
Error().map(x => x * 2).getOrElse(8);
```

#### `Result`'s `replace(value)`

`Result`'s `replace` will replace values wrapped in the `Ok` subtype by the `value` that you pass to `replace`.

```javascript
// This evaluates to Ok(2)
Ok(3).replace(2);

// This evaluates to Error
Error().replace(2);

// This evaluates to Aborted
Aborted().replace(2);
```

#### `Result`'s `satisfies(predicate)`

`Error` or `Aborted` subtypes never `satisfie` any predicates and always evaluate to `false`.

```javascript
// This evaluates to true
Ok(3).satisfies(x => x * 3 === 9);

// This evaluates to false
Ok(3).satisfies(x => x * 2 === 7);

// These also evaluate to false
Error().satisfies(x => x === 3);
Aborted().satisfies(x => x === 3);
```

#### `Result`'s `map(λ)`

Applies `λ` to your `Result`, returning an `Ok` wrapping the result, if the orignal `Result` is an `Ok`. Otherwise, it evaluates to whatever `Error` or `Aborted` it was applied to.

```javascript

// Evaluates to Ok(5)
Ok(4).map(x => x + 1);
```

#### `Result`'s `mapError(λ)`

Whereas `Result`'s `map` will simply return the original `Error` when applied on an `Error`, `errorMap` transforms an the value wrapped inside the `Error`.

```javascript
// Evaluates to Error(5)
Error(4).mapError(x => x + 1);

// Evaluates to 4
Ok(4).mapError(x => x + 1);

// Evaluates to Aborted
Aborted('Dead').mapError(x => x + 1);
```

#### `Result`'s `tap(λ)`

Like `map`, but returns the value wrapped by your `Result` unmodified.
You'd mostly use this if you need the value of your `Result` for side-effects, such as modifying an existing variable that lives outside your `Result` chain, or using the `Result` in an API call, but continuing with the original value, not the return value from the API call.

```javascript
// Evaluates to 4
Ok(4).tap(x => x + 1);

// Evaluates to Error
Error().tap(x => x + 1);

// Evaluates to Aborted
Aborted().tap(x => x + 1);
```

#### `Result`'s `flatMap(λ)`

If your `Result` is an `Ok`, `flatMap` maps your `Result` to `λ`, then runs the result through `Result.expect`.

__TODO__: I don't fully understand the difference to expectMap(λ)

```javascript
// Evaluates to "1,2,31" <-- is that expected?
Ok([1, 2, 3]).flatMap(x => x + 1);
```

#### `Result`'s `expectMap(λ)`

First maps the `Result` to λ, then runs an expect on it:

_TODO_ !! THIS IS'T WORKING AS EXPECTED!!

Also, what's the difference between expectMap and flatMap ?

```javascript
// Evaluates to Ok(['Bearer', 'xyz'])
Result
.expect({'authorization': 'Bearer xyz'})
.expectMap(R.split('Bearer'))
```

#### `Result`'s `expectProperty(propertyName)`

When your result is an object, runs an `expect()` on the given property and returns
that property wrapped in a `Result`.

```javascript
const header = {
  'authorization': 'Bearer xyz',
  'accept-encoding': 'UTF-8',
};

// This evaluates to Ok('Bearer xyz')
Result.Ok(header).expectProperty('authorization');

// This evaluates to Error
Result.Ok(header).expectProperty('x-custom-header');
```

#### `Result`'s `property(propertyName)`

Extracts a given property from a Result.

```javascript
const header = {
  'authorization': 'Bearer xyz',
  'accept-encoding': 'UTF-8',
};

// This evaluates to Ok('Bearer xyz')
Result.Ok(header).property('authorization');

// This evaluates to Ok(undefined) <-- not sure we want this?
Result.Ok(header).property('authorization');
```

#### `Result`'s `valueEquals(value)`

Strict compares a value to the value wrapped by the `Result` returning a boolean.
An `Error` never `equals` any `value` and always evaluates to `false`.

```javascript
// This evaluates to true
Ok(3).valueEquals(3);

// This evaluates to false
Ok(3).valueEquals('foo');

// These unconditionally evaluate to false
Error().valueEquals('bar');
Aborted().valueEquals('baz');
```

#### `Result`'s `filter(predicate)`

Only works if your `Result` is an `Ok`. Returns identity for `Result`s of type `Error` or `Aborted`.

```javascript
// This evaluates to Ok(3)
Ok(3).filter(x => x === 3)

// This evaluates to Error
Ok(3).filter(x => x === 6)
```

#### `Result`'s `reject(predicate)`

This method is the oppose of `filter(predicate)`, but it also only works if your `Result` is an `Ok`. Returns identity for `Result`s of type `Error` or `Aborted`.

```javascript
// This evaluates to Error
Ok(3).reject(x => x === 3)

// This evaluates to Ok(3)
Ok(3).reject(x => x === 6)
```

#### `Result`'s `match(callbacks)`

`match` expects an object with one or multiple `Result` types.

```javascript
// This evaluates to 4
Ok(3).match({
  Error:   Result.Error,
  Aborted: Result.Error,
  Ok(value) {
    return value + 1;
  }
});

// This evaluates to "Oops"
Error().match({
  Error() {
    return 'Oops';
  },
  Ok:      Result.Ok
});

// This will throw "Oops"
Error('Oops').match({
  Aborted: Result.Aborted,
  Ok:      Result.Ok
});
```

#### `Result`'s `recover(λ)`

Unconditionally recovers from an `Error`.

```javascript
// Evaluates to Ok('OK!')
Error('Oops').recover(() => 'OK!');

// Evaluates to Ok('Yeah!')
Ok('Yeah!').recover(() => 'OK!');
```

#### `Result`'s `recoverWhen(predicate, λ)`

`Result`'s `recoverWhen` allows you to recover from an `Error`, if the result of transforming the error through `λ` evaluates to `true`.
__Attention__: Note that the `λ` function is applied __before__ the `predicate` is evaluated, which may be unexpected.

```javascript
// This evaluates to Ok(6)
Error(3).recoverWhen(x => x === 6, x => x * 2);

// Evaluates to Ok(3)
Ok(3).recoverWhen(x => x === 6, x => x * 2);
```

#### `Result`'s `abortOnError`

Converts an `Error` into an unrecoverable `Aborted`

```javascript
// Evaluates to Ok(3)
Ok(3).abortOnError();

// Evaluates to Aborted('Oops')
Error('Oops').abortOnError();
```

#### `Result`'s `abortOnErrorWith(λOrValue)`

Transforms an `Error` into an unrecoverable `Aborted` by substituting or applying `λOrValue`

__TODO__: The last case throws, is that expected?

```javascript
// Evaluates to Ok(3)
Ok(3).abortOnErrorWith(4);

// Evaluates to Aborted('You shall not pass!')
Error('Oops').abortOnErrorWith('You shall not pass!');

// Evaluates to Aborted('Oops, that was a failure')
Error('Oops').abortOnErrorWith(x => `${x}, that was a failure`);
```

#### `Result`'s `asynchronous`

__TODO__: Not sure I get this

```javascript
// This evaluates to createPending // Pending(3) <-- expected?
Ok(3).asynchronous();

Error('Oops!').asynchronous();
```

#### `Result`'s `fromPromise`

Any value that represents a `Promise` can be converted into a `Result`. This means you can run any asynchronous functions and wrap them to handle their return value in a functional chain.
The result will be a `Result` of the `Pending` subtype, eventually resolving to an `Ok` or an `Error` subtype.

```javascript
const result1 = Result.fromPromise(axios.put(`/api/person/${person}`, person));

const result2 = Result.fromPromise(bcrypt.genSalt(saltRounds));
```

#### `Result`'s `toPromise`

Just as a promise can be turned into a `Result`, any `Result` can also be turned back into a promise if your caller expects one:

```javascript
return Result
.fromPromise(handleUpload(request, pipeFileToStorage))
.abortOnErrorWith(Response.serverError)
.map(Response.ok)
.toPromise();
```

* When applying `toPromise` to an `Aborted`, the `Promise` will be rejected.
* When applying `toPromise` to a `Pending`, the original `Promise` will be evaluated, and the result, unless it's rejected, wrapped in new resolved `Promise`.

#### `Result`'s `toOptional`

Simply transforms the `Result` into an `Optional`:

```javascript
// This evaluates to Some(3)
Ok(3).toOptional();

// This evaluates to None()
Error('Oops').toOptional();

// This evaluates to None()
Aborted('Oops').toOptional();
```
