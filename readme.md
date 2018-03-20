# Mannish the Manly Mediator

![Adventure Time!](mannish.jpg)

This is a fairly specific implementation of the mediator pattern - given a string name, it calls a function and returns a promise with the function's response.

It accomplishes the same goals as many dependency injection libraries (loose coupling, better testability), but focuses only on functions.

Originally inspired by Nicholas Zakas's talk on "[Creating A Scalable JavaScript Application Architecture](http://youtu.be/b5pFv9NB9fs)", this library fills the role of what he called the "sandbox" more closely than it serves the purpose he had for the mediator pattern.

Mannish focuses on decoupling the calling of functions and getting a response back.

# API

## `mediator = mannish()`

This library exports a single function that returns a new mediator.

<!-- js
const mannish = require('./')

const mediator = mannish()
-->

## `removeProvider = mediator.provide(name, function)`

Supplies a function to handle all calls to the given name.

`removeProvider` is a function that, if you call it, will cause the provider to stop handling calls to that name.

```js
mediator.provide('pie', recipe => {
	if (Array.isArray(recipe.contents)) {
		// you can return a plain value
		return 'I am a sweet pie'
	} else {
		// or a promise/thenable
		return Promise.resolve('probably just sour grapes anyway')
	}
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

## `removeProvider = mediator.provideSync(name, function)`

Same as `provide`, except the function is expected to return a value instead of a promise.

```js
mediator.provideSync('pie', recipe => {
	if (Array.isArray(recipe.contents)) {
		return 'Smushed ' + recipe.contents[0]
	} else {
		throw new Error('ERROOOOR')
	}
})
```

## `value = mediator.callSync(name, ...arguments)`

Calls the synchronous function that was provided via `provideSync`, and returns whatever value it returns.  Thrown errors are not swallowed.

```js
const grapeJuiceRecipe = { type: 'recipe', contents: [ 'Fresh grapes' ] }
mediator.callSync('pie', grapeJuiceRecipe) // => 'Smushed Fresh grapes'
```

# Open questions

- Is it ever necessary to remove all providers?

# License

[WTFPL](http://wtfpl2.com/)
