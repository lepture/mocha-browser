# Mocha Browser

> Mocha test suite for browser.


## Usage

Test for local path:

```
$ mocha-browser tests/runner.html
```

Test for http server:

```
$ mocha-browser tests/runner.html -S
$ mocha-browser tests/runner.html --server
```

Test with other reporter:

```
$ mocha-browser tests/runner.html -R <name>
```

## Coverage

We have two coverage reporter:

1. html-cov for human
2. lcov for coveralls


## Thanks

Thanks to these projects:

1. [mocha](https://github.com/visionmedia/mocha)
2. [mocha-phantomjs](https://github.com/metaskills/mocha-phantomjs)

## Changelog

**April 24, 2013** `0.1.0`

First preview release.
