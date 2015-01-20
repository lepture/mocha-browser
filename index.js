var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var path = require('path');
var exists = fs.existsSync || path.existsSync;
var cwd = process.cwd();
var event;

module.exports = function(program, callback) {
  event = new EventEmitter();
  event['lcov'] = {
    reporter: 'json-cov',
    listen: lcov
  };

  event['html-cov'] = {
    reporter: 'json-cov',
    listen: htmlCov
  };

  if (program.agent) {
    settings.userAgent = program.agent;
  }

  var script = fs.realpathSync(__dirname + '/lib/mocha-phantomjs.coffee');
  var reporter = program.reporter;

  var config = JSON.stringify({
    timeout: program.timeout,
    cookies: program.cookies,
    headers: program.headers,
    settings: program.settings,
    viewportSize: program.view,
    useColors: program.color
  });

  event.outputJSON = program.output;
  var coverter = event[reporter];
  if (coverter) {
    reporter = coverter.reporter;
  }

  var spawnArgs = [script, program.page, reporter, config];

  var phantomjs;
  for (var i=0; i < module.paths.length; i++) {
    var bin = path.join(module.paths[i], '.bin/phantomjs');
    if (process.platform === 'win32') {
      bin = '"' + bin + '.cmd"';
    }
    if (exists(bin)) {
      phantomjs = bin;
      break;
    }
  }
  if (phantomjs === undefined) {
    phantomjs = 'phantomjs';
  }

  function main(subprocess, server, complete) {
    if (coverter) {
      coverter.listen();
    }

    subprocess.stdout.on('data', function(data){
      if (coverter) {
        event.emit('data', data.toString());
      } else {
        process.stdout.write(data.toString());
      }
    });

    subprocess.stdout.on('end', function() {
      if (event) {
        event.emit('end');
      }
    });

    subprocess.on('exit', function(code){
      if (code === 127) {
        console.log("Perhaps phantomjs is not installed?");
      }
      process.nextTick(function() {
        if (server) {
          server.close();
        }
        complete && complete(code);
      });
    });
  }

  function createServer() {
    var spawn = require('win-spawn');

    if (!program.server) {
      return main(spawn(phantomjs, spawnArgs), null, callback);
    }

    var Server = require('node-static').Server;
    var http = require('http');

    var file = new Server(fs.realpathSync('.'));

    var server = http.createServer(function(request, response) {
      request.addListener('end', function() {
        file.serve(request, response);
      }).resume();
    });
    server.listen(program.port, function() {
      return main(spawn(phantomjs, spawnArgs), server, callback);
    });
  }

  createServer();

};


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
    data = cleanJSON(data);
    var files = data.files;
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
    data = cleanJSON(data);
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

function cleanJSON(data) {
  data = data.replace(/^(}?)Error loading resource .+?$/gm, '$1');
  data = data.replace(/^(}?)Unsafe JavaScript attempt to access frame .+?$/gm, '$1');
  data = data.replace(/^[^{]*({)/g, '$1');
  if (event.outputJSON) {
    fs.writeFileSync(event.outputJSON, data);
  }
  return JSON.parse(data);
}
