test:
	mocha

# There's an issue with PhantomJS, Function.prototype.bind is undefined, so
# the tests fail. So we have to use a workaround for the moment.
# see https://code.google.com/p/phantomjs/issues/detail?id=522
test-client:
	@echo open file://`pwd`/test/client.html in your browser
	@#mocha-phantomjs test/client.html

test-cov:
	jscoverage src src-cov
	PHEASANT_COV=1 mocha -R html-cov > coverage.html
	rm -rf src-cov

test-all: test test-client test-cov

.PHONY: test
