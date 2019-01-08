function test(name, fn) {
	return require(`tape`)(name, { timeout: 1000 }, async t => {
		await fn(t)
		t.end()
	})
}
const mannish = require(`../`)

test(`Basic functionality: should call the right function and get the response`, async t => {
	const mediator = mannish()

	mediator.provide(`book`, book => {
		t.equal(book, `enchiridion`)
		return Promise.resolve(`mathematical`)
	})

	mediator.provide(`unrelated book`, () => t.fail(`This function shouldn't be called`))

	const response = await mediator.call(`book`, `enchiridion`)

	t.equal(response, `mathematical`)
})

test(`Non-promise functions don't cause 'call' to return a promise`, t => {
	const mediator = mannish()

	mediator.provide(`book`, () => `mathematical`)

	t.equal(mediator.call(`book`, `enchiridion`), `mathematical`)
})

test(`Should receive rejected promise`, async t => {
	const mediator = mannish()

	mediator.provide(`loot`, location => {
		t.equal(location, `from the dungeon please`)
		return Promise.reject(new Error(`skeleton`))
	})

	await mediator.call(`loot`, `from the dungeon please`).catch(err => {
		t.ok(err instanceof Error, `err is an Error`)
		t.equal(err.message, `skeleton`)
	})
})

test(`Errors thrown in the provider should bubble normally`, t => {
	const mediator = mannish()
	t.plan(2)

	mediator.provide(`loot`, location => {
		throw new Error(`monster`)
	})

	try {
		mediator.call(`loot`, `from the dungeon please`)
	} catch (err) {
		t.ok(err instanceof Error, `err is an Error`)
		t.equal(err.message, `monster`)
	}
})

test(`Should work with multiple arguments`, async t => {
	const mediator = mannish()

	mediator.provide(`taco`, (first, second) => {
		t.equal(first, `first`)
		t.equal(second, `second`)
		return Promise.resolve(`response`)
	})
	const response = await mediator.call(`taco`, `first`, `second`)

	t.equal(response, `response`)
})

test(`Should work with multiple arguments, several of which are functions`, async t => {
	const mediator = mannish()

	function one() {}
	function two() {}

	mediator.provide(`taco`, (first, second, argone, argtwo) => {
		t.equal(first, `first`)
		t.equal(second, `second`)
		t.equal(argone, one)
		t.equal(argtwo, two)
		return Promise.resolve(`response`)
	})

	const response = await mediator.call(`taco`, `first`, `second`, one, two)

	t.equal(response, `response`)
})

test(`Provide and call synchronous functions`, t => {
	const mediator = mannish()

	mediator.provide(`getThingy`, input => `aw yeah ` + input)
	const output = mediator.call(`getThingy`, `dawg`)

	t.equal(output, `aw yeah dawg`)
})

test(`Removing providers`, t => {
	const mediator = mannish()

	let called = 0
	const remove = mediator.provide(`thingy`, () => {
		called++
	})

	mediator.call(`thingy`)

	remove()

	t.throws(() => mediator.call(`thingy`), /provider found/)

	t.equal(called, 1)
})
