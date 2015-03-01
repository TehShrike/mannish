var Promise = require('promise')

module.exports = function createAppContext() {
	var eventsToEventListeners = {}

	return function createModuleContext(moduleName) {
		var unsubscribeFunctions = []

		function subscribe(event, cb) {
			unsubscribeFunctions.push(addListener(eventsToEventListeners, event, cb))
		}

		function publish(event, value) {
			return callListeners(eventsToEventListeners, event, value)
		}

		function removeAllListeners() {
			unsubscribeFunctions.forEach(function(fn) {
				fn()
			})
		}

		return {
			subscribe: subscribe,
			publish: Promise.nodeify(publish),
			removeAllListeners: removeAllListeners
		}
	}
}

function addListener(eventsToEventListeners, event, cb) {
	var id = Math.random().toString().slice(2)
	if (!eventsToEventListeners[event]) {
		eventsToEventListeners[event] = {}
	}

	eventsToEventListeners[event][id] = Promise.denodeify(cb)

	return function unsubscribe() {
		delete eventsToEventListeners[event][id]
	}
}

function callListeners(eventsToEventListeners, event, value) {
	return new Promise(function(resolve, reject) {
		if (eventsToEventListeners[event]) {
			console.log(values(eventsToEventListeners[event]).length, 'listeners for', event)
			values(eventsToEventListeners[event]).forEach(function(listener) {
				listener(value).then(resolve, reject)
			})
		}
	})
}

function values(obj) {
	return Object.keys(obj).map(function(key) {
		return obj[key]
	})
}
