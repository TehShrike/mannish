# Mannish the Manly Mediator

![](mannish.jpg)

This is a fairly specific implementation of the mediator pattern - given a string name, it calls a function and returns a promise with the function's response.

It accomplishes the same goals as many dependency injection libraries, but focuses only on functions, and always returning asynchronous responses.

Originally inspired by Nicholas Zakas's talk on "[Creating A Scalable JavaScript Application Architecture](http://youtu.be/b5pFv9NB9fs)", this library fills the role of what he called the "sandbox" more closely than it serves the purpose he had for the mediator pattern.

Mannish focuses on decoupling the calling of functions and getting a response back.

# API

## `mediator = mannish()`

This library exports a single function that returns a new mediator.

<!-- js
const mannish = require('./')

const mediator = mannish()
-->

## `mediator.provide(name, function)`

Supplies a function to handle all calls to the given name.

```js
mediator.provide('pie', recipe => {
	Array.isArray(recipe.contents) // => true

	return 'I am a sweet pie'
})
```

You can return either a plain value, or a promise/thenable.

## `promise = mediator.call(name, ...arguments)`

Call whatever function is registered with the string `name`, with all other arguments being passed straight through.

No matter what the other function returns, `call` returns a `Promise` containing the value it resolves to.

```js
const recipe = { type: 'recipe', contents: [ 'Step 1: find a real cook book' ] }
mediator.call('pie', recipe).then(pie => {
	pie // => 'I am a sweet pie'
})
```

# Open questions

- Is it ever necessary to remove all providers?
- Is it ever necessary to remove a single provider?
	- If so, should anyone be able to remove the provider, or just the code that added it? (Should the mediator expose `removeProvider` or should `provide` return a removal function?)

# License

[WTFPL](http://wtfpl2.com/)
