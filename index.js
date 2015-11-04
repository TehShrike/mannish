var Promise = require('native-promise-only')
var denodeify = require('then-denodeify')
var nodeify = require('then-nodeify')

module.exports = function createAppContext() {
	var eventsToEventListeners = {}
	var unsubscribeFunctions = []

	function callListeners(event) {
		var args = []
		for (var i = 1; i < arguments.length; ++i) {
			var isCallbackFunction = i === arguments.length - 1 && typeof arguments[i] === 'function'

			if (!isCallbackFunction) {
				args.push(arguments[i])
			}
		}
		return new Promise(function(resolve, reject) {
			if (eventsToEventListeners[event]) {
				values(eventsToEventListeners[event]).forEach(function(listener) {
					listener.apply(null, args).then(resolve, reject)
				})
			}
		})
	}
	function subscribe(event, cb) {
		unsubscribeFunctions.push(addListener(eventsToEventListeners, event, cb))
	}

	function removeAllListeners() {
		unsubscribeFunctions.forEach(function(fn) {
			fn()
		})
	}

	var promiseyPublish = nodeify(callListeners)

	return {
		subscribe: subscribe,
		provide: subscribe,
		publish: promiseyPublish,
		request: promiseyPublish,
		removeAllListeners: removeAllListeners
	}
}

function addListener(eventsToEventListeners, event, cb) {
	var id = Math.random().toString().slice(2)
	if (!eventsToEventListeners[event]) {
		eventsToEventListeners[event] = {}
	}

	eventsToEventListeners[event][id] = denodeify(cb)

	return function unsubscribe() {
		delete eventsToEventListeners[event][id]
	}
}

function values(obj) {
	return Object.keys(obj).map(function(key) {
		return obj[key]
	})
}
