var exec = require('child_process').exec;
var os = require('os');
var install;

if (os.platform() === 'win32') {
  exec('set PHANTOMJS_CDNURL=http://phantomjs.qiniudn.com&& npm install phantomjs',
    function (error, stdout, stderr) {
      console.log(stdout);
    });
} else {
  exec('PHANTOMJS_CDNURL=http://phantomjs.qiniudn.com npm install phantomjs',
    function (error, stdout, stderr) {
      console.log(stdout);
    });
}
