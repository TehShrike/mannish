module.exports = function createMediator() {
	const providers = Object.create(null)
	const syncProviders = Object.create(null)

	function call(name, ...args) {
		if (providers[name]) {
			try {
				const response = providers[name](...args)

				return Promise.resolve(response)
			} catch (err) {
				return Promise.reject(err)
			}
		} else {
			return Promise.reject(new Error(`No async provider found for "${name}"`))
		}
	}

	function callSync(name, ...args) {
		if (syncProviders[name]) {
			return syncProviders[name](...args)
		} else {
			throw new Error(`No synchronous provider found for "${name}"`)
		}
	}

	return {
		provide: createProvide('async', providers),
		call,
		provideSync: createProvide('synchronous', syncProviders),
		callSync
	}
}

const createProvide = (identifier, map) => function provide(name, fn) {
	if (typeof fn !== 'function') {
		throw new Error(`${fn} is not a function`)
	} else if (typeof name !== 'string') {
		throw new Error(`The provider name must be a string`)
	} else if (map[name]) {
		throw new Error(`There is already a ${identifier} provider for "${name}"`)
	} else {
		map[name] = fn
	}
}
