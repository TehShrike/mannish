const test = require('tape')
const mannish = require('../')

test(`Should throw an error on 'call' if there is no listener`, t => {
	const mediator = mannish()

	mediator.call('unhandled').then(
		() => t.fail('Should not have succeeded'),
		err => {
			t.ok(err instanceof Error, 'err is an Error')
			t.ok(err.message.includes('No async provider'))
			t.end()
		}
	)
})

test(`Should throw an error when attempting to add a second provider`, t => {
	const mediator = mannish()

	mediator.provide('important', () => {})
	t.throws(() => mediator.provide('important', () => {}), /already/)
	t.end()
})

test(`Should throw an error if the provider is not a function`, t => {
	const mediator = mannish()

	t.throws(() => mediator.provide('important', 'o hai'), /not a function/)
	t.end()
})

test(`Should throw an error if the name is not a string`, t => {
	const mediator = mannish()

	t.throws(() => mediator.provide({}, () => {}), /a string/)
	t.end()
})
