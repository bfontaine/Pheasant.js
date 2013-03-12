MOCHA=mocha
DESTDIR=build
COVDIR=${DESTDIR}-cov

BROWSER=chromium-browser

test: build
	${MOCHA}

# There's an issue with PhantomJS, Function.prototype.bind is undefined, so
# the tests fail. So we have to use a workaround for the moment.
# see https://code.google.com/p/phantomjs/issues/detail?id=522
test-client: build
	${BROWSER} file://`pwd`/test/client.html file://`pwd`/test/client-min.html
	@#mocha-phantomjs test/client.html
	@#mocha-phantomjs test/client-min.html

test-cov: build
	jscoverage ${DESTDIR} ${COVDIR}
	PHEASANT_COV=1 ${MOCHA} -R html-cov > coverage.html
	${BROWSER} coverage.html
	rm -rf ${COVDIR}

test-build: build test
	PHEASANT_MIN=1 ${MOCHA}

test-all: test test-client test-cov test-build

build: src/pheasant.js
	mkdir -p ${DESTDIR}
	cp src/pheasant.js ${DESTDIR}/pheasant.js
	uglifyjs src/pheasant.js > ${DESTDIR}/pheasant.min.js

clear:
	rm -rf ${DESTDIR}
	rm -rf ${COVDIR}

.PHONY: test
