const denodeify = require('then-denodeify')
const nodeify = require('then-nodeify')

module.exports = function createAppContext() {
	const eventsToEventListeners = Object.create(null)
	const unsubscribeFunctions = []

	function callListeners(event, ...eventArguments) {
		const args = []

		eventArguments.forEach((argument, i) => {
			const isCallbackFunction = i === eventArguments.length - 1 && typeof argument === 'function'

			if (!isCallbackFunction) {
				args.push(argument)
			}
		})

		return new Promise((resolve, reject) => {
			if (eventsToEventListeners[event]) {
				values(eventsToEventListeners[event]).forEach(listener => {
					listener(...args).then(resolve, reject)
				})
			}
		})
	}
	function subscribe(event, cb) {
		const unsubscribeEvent = addListener(eventsToEventListeners, event, cb)
		unsubscribeFunctions.push(unsubscribeEvent)

		return function unsubscribe() {
			unsubscribeEvent()
			const index = unsubscribeFunctions.indexOf(unsubscribeEvent)
			if (index !== -1) {
				unsubscribeFunctions.splice(index, 1)
			}
		}
	}

	function removeAllListeners() {
		unsubscribeFunctions.forEach(fn => fn())
	}

	const promiseyPublish = nodeify(callListeners)

	return {
		subscribe: subscribe,
		provide: subscribe,
		publish: promiseyPublish,
		request: promiseyPublish,
		removeAllListeners: removeAllListeners
	}
}

function addListener(eventsToEventListeners, event, cb) {
	const id = Math.random().toString().slice(2)
	if (!eventsToEventListeners[event]) {
		eventsToEventListeners[event] = {}
	}

	eventsToEventListeners[event][id] = denodeify(cb)

	return function unsubscribe() {
		delete eventsToEventListeners[event][id]
	}
}

function values(obj) {
	return Object.keys(obj).map(key => obj[key])
}
