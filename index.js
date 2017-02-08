module.exports = function createMediator() {
	const providers = Object.create(null)

	function call(name, ...args) {
		if (providers[name]) {
			try {
				const response = providers[name](...args)

				return Promise.resolve(response)
			} catch (err) {
				return Promise.reject(err)
			}
		} else {
			return Promise.reject(new Error(`No provider found for "${name}"`))
		}
	}

	function provide(name, fn) {
		if (typeof fn !== 'function') {
			throw new Error(`${fn} is not a function`)
		} else if (typeof name !== 'string') {
			throw new Error(`The provider name must be a string`)
		} else if (providers[name]) {
			throw new Error(`There is already a provider for "${name}"`)
		} else {
			providers[name] = fn
		}
	}

	return {
		provide,
		call
	}
}
