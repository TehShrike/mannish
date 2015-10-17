var test = require('tape')
var mannish = require('./')

test('basic event-style', function(t) {
	t.plan(1)

	var app = mannish()

	app.subscribe('book', function(book) {
		t.equal(book, 'enchiridion')
		t.end()
	})

	app.subscribe('barbecue', function() {
		t.fail('not barbecue time')
	})

	app.publish('book', 'enchiridion')
})

test('response style', function(t) {
	t.plan(3)

	var app = mannish()

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

test('aliases', function(t) {
	t.plan(2)

	var app = mannish()

	t.equal(app.subscribe, app.provide)
	t.equal(app.publish, app.request)

	t.end()
})

test('error response', function(t) {
	t.plan(2)

	var app = mannish()

	app.subscribe('loot', function(location, cb) {
		cb(new Error('skeleton'))
	})

	app.publish('loot', 'from the dungeon please', function getResponse(err, response) {
		t.ok(err instanceof Error, 'err is an Error')
		t.equal(err.message, 'skeleton')
		t.end()
	})
})

test('removes listeners', function(t) {
	var app = mannish()

	var aCalled = 0

	app.subscribe('burrito', function() {
		t.equal(aCalled, 0, "a's subscription should only be called once")
		aCalled++
		t.end()
	})
	app.publish('burrito')

	app.removeAllListeners()

	app.publish('burrito')
})
