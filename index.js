var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

var event = new EventEmitter();

/*
 * lcov reporter for coveralls.io
 *
 * $ mocha-browser -R lcov page | coveralls
 */
function lcov() {
  var data = '';
  event.on('data', function(chunk) {
    data += chunk;
  });
  event.on('end', function() {
    var files = JSON.parse(data.replace(/^[^{]*({)/g, '$1')).files;
    for (var i in files) {
      var file = files[i];
      process.stdout.write('SF:' + file.filename + '\n');
      for (var num in file.source) {
        if (file.source[num].coverage !== '') {
          process.stdout.write('DA:' + num + ',' + file.source[num].coverage + '\n');
        }
      }
      process.stdout.write('end_of_record\n');
    }
  });
}

/*
 * html-cov reporter that really works
 *
 * $ mocha-browser -R html-cov page
 */
function htmlCov() {
  // get everything we need from mocha
  var jade = require('mocha/node_modules/jade');
  var reporter = require.resolve('mocha/lib/reporters/html-cov');
  var file = path.join(path.dirname(reporter), 'templates/coverage.jade');
  var fn = jade.compile(fs.readFileSync(file, 'utf-8'), {filename: file});
  var data = '';

  event.on('data', function(chunk) {
    data += chunk;
  });

  event.on('end', function() {
    data = JSON.parse(data.replace(/^[^{]*({)/g, '$1'));
    process.stdout.write(fn({
      cov: data,
      coverageClass: function(n) {
        if (n >= 75) return 'high';
        if (n >= 50) return 'medium';
        if (n >= 25) return 'low';
        return 'terrible';
      }
    }));
  });
}

exports = module.exports = event;

exports['lcov'] = {
  reporter: 'json-cov',
  listen: lcov
};

exports['html-cov'] = {
  reporter: 'json-cov',
  listen: htmlCov
};
