const DependencyInjector = require('./di.js');

// DEMO

class Logger {
	constructor() {}

	log = (...args) => console.log('%c[Logger]','font-weight:bold',...args);
}

class DummyService {
	constructor(logger) {
		this.logger = logger;
	}

	getData() {
		this.logger.log('DummyService: getting data');
		return [...Array(4)].map(() => Math.random());
	}
}

const di = new DependencyInjector();
di.registerService(Logger);
di.registerService(DummyService);

function f(logger) {
	logger.log('hello');
}

di.invokeFn(f);

class A {
	constructor(logger, dummyService) {
		this.logger = logger;
		this.dummyService = dummyService;
	}

	foo() {
		this.logger.log('A.foo()');
		this.logger.log(this.dummyService.getData());
	}
}

const a = di.create(A);
a.foo();
