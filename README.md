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
