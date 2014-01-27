MOCHA=mocha
DESTDIR=build
COVDIR=${DESTDIR}-cov

test: build
	${MOCHA}

test-client: build
	mocha-phantomjs -R dot test/client.html
	mocha-phantomjs -R dot test/client-min.html

test-cov: build
	@rm -rf ${COVDIR}
	jscoverage ${DESTDIR} ${COVDIR}
	PHEASANT_COV=1 ${MOCHA} -R html-cov > coverage.html
	rm -rf ${COVDIR}

test-all: test test-client

build: src/pheasant.js
	mkdir -p ${DESTDIR}
	cp src/pheasant.js ${DESTDIR}/pheasant.js
	uglifyjs src/pheasant.js > ${DESTDIR}/pheasant.min.js

clear:
	rm -rf ${DESTDIR}
	rm -rf ${COVDIR}

.PHONY: build test
