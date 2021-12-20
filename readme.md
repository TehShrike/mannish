# Mannish the Manly Mediator

![Adventure Time!](mannish.jpg)

*[changelog](./changelog.md)*

This is a fairly specific implementation of the mediator pattern - given a string name, it calls a function and returns that function's response.

It accomplishes the same goals as many dependency injection libraries (loose coupling, better testability), but focuses only on functions.

Originally inspired by Nicholas Zakas's talk on "[Creating A Scalable JavaScript Application Architecture](http://youtu.be/b5pFv9NB9fs)", this library fills the role of what he called the "sandbox" more closely than it serves the purpose he had for the mediator pattern.

Mannish focuses on decoupling the calling of functions and getting a response back.

# API

```js
const mannish = require('mannish')
// or
import * as mannish from 'mannish'
```

## `mediator = mannish()`

This library exports a single function that returns a new mediator.

<!-- js
const mannish = require('./')
-->

```js
const mediator = mannish()
```

## `removeProvider = mediator.provide(name, function)`

Supplies a function to handle all calls to the given name.

`removeProvider` is a function that, if you call it, will cause the provider to stop handling calls to that name.

```js
mediator.provide('pie', recipe => {
	// whatever you return is provided to the caller
	return 'I am a sweet pie'
})
```

## `response = mediator.call(name, ...arguments)`

Call whatever function is registered with the string `name`, with all other arguments being passed straight through.

`call` will return whatever value the provider returns.

```js
const recipe = { type: 'recipe', contents: [ 'Step 1: find a real cook book' ] }
mediator.call('pie', recipe) // => 'I am a sweet pie'
```

# Usage tips

Some of your providers will probably be asynchronous - I would recommend making your provider function an [async function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/async_function) so that you don't have to worry about some edge case that causes your ostensibly-promise-returning providers to respond with a synchronous value or error.

# License

[WTFPL](http://wtfpl2.com/)
