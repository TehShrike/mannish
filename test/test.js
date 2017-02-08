function test(name, fn) {
	return require('tape')(name, { timeout: 1000 }, fn)
}
const mannish = require('../')

test('Basic functionality: should call the right function and get the response', t => {
	t.plan(2)

	const mediator = mannish()

	mediator.provide('book', function(book) {
		t.equal(book, 'enchiridion')
		return Promise.resolve('mathematical')
	})

	mediator.provide('unrelated book', () => t.fail(`This function shouldn't be called`))

	mediator.call('book', 'enchiridion').then(response => {
		t.equal(response, 'mathematical')
		t.end()
	})
})

test('Should receive a non-promise response, too', t => {
	const mediator = mannish()

	mediator.provide('book', () => 'mathematical')

	mediator.call('book', 'enchiridion').then(response => {
		t.equal(response, 'mathematical')
		t.end()
	})
})

test('Should receive rejected promise', t => {
	const mediator = mannish()

	mediator.provide('loot', function(location) {
		t.equal(location, 'from the dungeon please')
		return Promise.reject(new Error('skeleton'))
	})

	mediator.call('loot', 'from the dungeon please').catch(err => {
		t.ok(err instanceof Error, 'err is an Error')
		t.equal(err.message, 'skeleton')
		t.end()
	})
})

test(`Errors thrown in the provider should result in rejected responses`, t => {
	const mediator = mannish()

	mediator.provide('loot', function(location) {
		throw new Error('monster')
	})

	mediator.call('loot', 'from the dungeon please').catch(err => {
		t.ok(err instanceof Error, 'err is an Error')
		t.equal(err.message, 'monster')
		t.end()
	})
})

test('Should work with multiple arguments', t => {
	const mediator = mannish()

	mediator.provide('taco', function(first, second) {
		t.equal(first, 'first')
		t.equal(second, 'second')
		return Promise.resolve('response')
	})
	mediator.call('taco', 'first', 'second').then(response => {
		t.equal(response, 'response')
		t.end()
	})
})

test('Should work with multiple arguments, several of which are functions', t => {
	const mediator = mannish()

	function one() {}
	function two() {}

	mediator.provide('taco', function(first, second, argone, argtwo) {
		t.equal(first, 'first')
		t.equal(second, 'second')
		t.equal(argone, one)
		t.equal(argtwo, two)
		return Promise.resolve('response')
	})
	mediator.call('taco', 'first', 'second', one, two).then(response => {
		t.equal(response, 'response')
		t.end()
	})
})
