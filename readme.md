# Mannish the Manly Mediator

Inspired by Nicholas Zakas's talk on "[Creating A Scalable JavaScript Application Architecture](http://youtu.be/b5pFv9NB9fs)", this is a mediator to let modules communicate without tight coupling - for whatever "module" means to you.

# Usage

## Create a new app context

	var mannish = require('mannish')

	var appContext = mannish()

## Create a new module context

	var moduleAContext = appContext('module A')

	var module1Context = appContext('module 1')

## Subscribe, adding yourself as a provider

	moduleAContext.subscribe('unixTimestamp', function(someDate, cb) {
		cb(null, Math.round(someDate.getTime() / 1000))
	})

Mannish uses promises internally to keep Zalgo at bay and prevent multiple subscribers from answering the same request.

If you just want to subscribe to events and it doesn't make sense to provide a response value, just ignore the callback.

If you want to use promises, then instead of calling the callback you can just return a promise instead.

## Publish a request for something

	module1Context.publish('unixTimestamp', new Date(), function(err, result) {
		// result is a ten-digit number, wheee
	})

The callback function is totally optional.  You can publish data objects to the app without any need for a response.

	module1Context.subscribe('flex', function(err, muscle) {
		muscle.squeeze()
	})

	moduleAContext.publish('flex', new Muscle())

## Remove all subscribers

Say module A is an on-screen widget - if the page changes, the widget needs to clean up its event handlers.

	moduleAContext.removeAllListeners()

# License

[WTFPL](http://wtfpl2.com/)

[![Build Status](https://travis-ci.org/TehShrike/mannish.svg?branch=master)](https://travis-ci.org/TehShrike/mannish)
