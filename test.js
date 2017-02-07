const test = require('tape')
const mannish = require('./')

test('basic event-style', t => {
	t.plan(1)

	const app = mannish()

	app.subscribe('book', function(book) {
		t.equal(book, 'enchiridion')
		t.end()
	})

	app.subscribe('barbecue', function() {
		t.fail('not barbecue time')
	})

	app.publish('book', 'enchiridion')
})

test('response style', t => {
	t.plan(3)

	const app = mannish()

	app.subscribe('book', function(book, cb) {
		t.equal(book, 'enchiridion')
		cb(null, 'mathematical')
	})

	app.publish('book', 'enchiridion', function getResponse(err, response) {
		t.notOk(err)
		t.equal(response, 'mathematical')
		t.end()
	})
})

test('aliases', t => {
	t.plan(2)

	const app = mannish()

	t.equal(app.subscribe, app.provide)
	t.equal(app.publish, app.request)

	t.end()
})

test('error response', t => {
	t.plan(2)

	const app = mannish()

	app.subscribe('loot', function(location, cb) {
		cb(new Error('skeleton'))
	})

	app.publish('loot', 'from the dungeon please', function getResponse(err, response) {
		t.ok(err instanceof Error, 'err is an Error')
		t.equal(err.message, 'skeleton')
		t.end()
	})
})

test('removes listeners', t => {
	const app = mannish()

	let aCalled = 0

	app.subscribe('burrito', function() {
		t.equal(aCalled, 0, "burrito's subscription should only be called once")
		aCalled++
		t.end()
	})
	app.publish('burrito')

	app.removeAllListeners()

	app.publish('burrito')
})

test('remove single listener', t => {
	const app = mannish()

	t.plan(4)

	let aCalled = 0
	let bCalled = 0

	const unsubscribeA = app.subscribe('burrito', function() {
		aCalled++
		t.equal(aCalled, 1, "burrito's A subscription should only be called once")
	})
	app.subscribe('burrito', function(cb) {
		bCalled++
		cb(null, bCalled)
	})

	app.publish('burrito', function(err, bResponse) {
		t.equal(bResponse, 1)
	})

	unsubscribeA()

	app.publish('burrito', function(err, bResponse) {
		t.equal(bResponse, 2)
		t.equal(bCalled, 2, "burrito's B subscription should be called twice")
		t.end()
	})
})

test('multiple arguments', t => {
	const app = mannish()

	app.subscribe('taco', function(first, second, cb) {
		t.equal(first, 'first')
		t.equal(second, 'second')
		cb('response')
	})
	app.publish('taco', 'first', 'second', function(response) {
		t.equal(response, 'response')
		t.end()
	})
})

test('multiple arguments, several of which are functions', t => {
	const app = mannish()

	function one() {}
	function two() {}

	app.subscribe('taco', function(first, second, argone, argtwo, cb) {
		t.equal(first, 'first')
		t.equal(second, 'second')
		t.equal(argone, one)
		t.equal(argtwo, two)
		cb('response')
	})
	app.publish('taco', 'first', 'second', one, two, function(response) {
		t.equal(response, 'response')
		t.end()
	})
})
