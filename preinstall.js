var exec = require('child_process').exec;
var os = require('os');

process.env.PHANTOMJS_CDNURL = "http://phantomjs.qiniudn.com";
var install = exec('npm install phantomjs', {
  env: process.env
});

install.stdout.on('data', function(data) {
  process.stdout.write(data);
});

install.stderr.on('data', function(data) {
  process.stdout.write(data);
});
