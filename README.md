# Mocha Browser

> Mocha test suite for browser.


## Install

Install mocha-browser with npm:

```
$ npm install mocha-browser
```

If you're in China, use the mirror cdn to download phantomjs:

```
$ PHANTOMJS_CDNURL=http://npm.taobao.org/dist/phantomjs npm install mocha-browser \
  --registry=http://registry.npm.taobao.org
```

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

All reporters that mocha-phantomjs supported can be used, even html-cov.

## Coverage

We have two coverage reporter:

1. html-cov for human
2. lcov for coveralls

The default `html-cov` reporter from mocha-phantomjs can not be used,
we built a converter for transforming json-cov data into html-cov page.

## Thanks

Thanks to these projects:

1. [mocha](https://github.com/visionmedia/mocha)
2. [mocha-phantomjs](https://github.com/metaskills/mocha-phantomjs)

The code in `lib/` are all borrowed from mocha-phantomjs.
mocha-phantomjs did the test, and we can trust it.

## Changelog

**Dec 2, 2013** `0.2.0`

Update mocha-phantomjs

**Dec 2, 2013** `0.2.0`

Update mocha-phantomjs

**Oct 16, 2013** `0.1.6`

Fixed `file?dist` not existed problem.

**Sep 11, 2013** `0.1.4` `0.1.5`

Fix for Mocha.process.

**Aug 15, 2013** `0.1.3`

Support for windows.

**July 10, 2013** `0.1.2`

Add option output for coverage.

**May 2, 2013** `0.1.1`

Process exit on nextTick.

**April 24, 2013** `0.1.0`

First preview release.
