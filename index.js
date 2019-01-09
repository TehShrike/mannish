module.exports = function createMediator() {
	const providers = Object.create(null)

	return {
		provide(name, fn) {
			if (typeof fn !== `function`) {
				throw new Error(`${ fn } is not a function`)
			} else if (typeof name !== `string`) {
				throw new Error(`The provider name must be a string`)
			} else if (providers[name]) {
				throw new Error(`There is already a provider for "${ name }"`)
			} else {
				providers[name] = fn
			}

			let removed = false
			return () => {
				if (!removed) {
					delete providers[name]
					removed = true
				}
			}
		},
		call(name, ...args) {
			if (providers[name]) {
				return providers[name](...args)
			} else {
				throw new Error(`No provider found for "${ name }"`)
			}
		},
	}
}
