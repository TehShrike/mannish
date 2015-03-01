var test = require('tape')
var mannish = require('./')

test('basic event-style', function(t) {
	t.plan(1)

	var app = mannish()

	var a = app('a')

	var b = app('b')

	a.subscribe('book', function(book) {
		t.equal(book, 'enchiridion')
		t.end()
	})

	a.subscribe('barbecue', function() {
		t.fail('not barbecue time')
	})

	b.publish('book', 'enchiridion')
})

test('response style', function(t) {
	t.plan(3)

	var app = mannish()

	var a = app('a')

	var b = app('b')

	a.subscribe('book', function(book, cb) {
		t.equal(book, 'enchiridion')
		cb(null, 'mathematical')
	})

	b.publish('book', 'enchiridion', function getResponse(err, response) {
		t.notOk(err)
		t.equal(response, 'mathematical')
		t.end()
	})
})

test('error response', function(t) {
	t.plan(2)

	var app = mannish()

	var a = app('a')
	var b = app('b')

	a.subscribe('loot', function(location, cb) {
		cb(new Error('skeleton'))
	})

	b.publish('loot', 'from the dungeon please', function getResponse(err, response) {
		t.ok(err instanceof Error, 'err is an Error')
		t.equal(err.message, 'skeleton')
		t.end()
	})
})

test('removes listeners', function(t) {
	var app = mannish()

	var a = app('a')
	var b = app('b')
	var c = app('c')

	var aCalled = 0
	var bCalled = 0

	a.subscribe('burrito', function() {
		t.equal(aCalled, 0, "a's subscription should only be called once")
		aCalled++
	})
	b.subscribe('burrito', function() {
		bCalled++
		if (bCalled === 2) {
			setTimeout(function() {
				t.equal(aCalled, 1)
				t.end()
			}, 50)
		}
	})

	c.publish('burrito')

	a.removeAllListeners()

	c.publish('burrito')
})

// test('throws an error if you try to register two modules with the same name?')
