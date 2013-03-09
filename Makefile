test:
	npm test

test-cov:
	jscoverage src src-cov
	PHEASANT_JS_COV=1 mocha -R html-cov > coverage.html
	rm -rf src-cov

.PHONY: test
