/*
 * KISS DI demo-framework
 */

/*
 * This is where the "magic" happens.  The idea is to take a function, then
 * parse out the parameters from the parameter-list.
 * This is very rudimentary, but roughly how angular does it.
 * ISSUES:
 *	rudimentary parsing of parameters.  
 *	In general, the parameter-list is not context-free, so properly parsing it
 *	with regex is not possible.  HOWEVER, we expect these functions to have very
 *	simple parameter-lists: a comma-separated list of services, so it's probably
 *	okay.
 */

const getArgNames = fn => 
	fn.toString()
		.match(/[^(]*\(((\s*\w*(\s*\n*)*,?)*)\)/m)[1]
		.replace(/\s*\n*/g,'')
		.split(',')
		.filter((x,i,a) => x !== '' || i < a.length - 1);

class DependencyInjector {
	constructor() {
		this.services = {};
	}

	/*
	 * ISSUES:
	 *	can't have two services whose names differ only in case of some letters
	 */
	registerService = (service) => {
		if (service.name === '') {
			throw new TypeError("service must have `.name` property to be registered");
		}
		// map all names to lower-case to simplify matching and allow camelCase args
		const normalizedName = service.name.toLowerCase();
		this.services[normalizedName] = service;
	}

	getService = serviceName => this.services[serviceName.toLowerCase()];
	createService = serviceName => this.create(this.getService(serviceName));

	/* 
	 * ISSUES:
	 *	circular dependencies will cause infinite recursion
	 */
	createArgs = argNames => argNames.map(this.createService);

	/*
	 * ISSUES:
	 *	changing the name of some parameters in a function changes the semantics
	 *	of the function.  In particular, minification will break this DI
	 *	framework...  This is also an issue in Angular, see "$inject";
	 */

	invokeFn = (f) => {
		const argNames = getArgNames(f);
		return f(...this.createArgs(argNames));
	}

	create = (cls) => {
		const argNames = getArgNames(cls.prototype.constructor);
		return new cls(...this.createArgs(argNames));
	}
}

module.exports = DependencyInjector;
