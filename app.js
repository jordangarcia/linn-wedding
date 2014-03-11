var connect = require('connect');
var http = require('http');

var port = process.env['PORT'] || 3000;
var env  = process.env['NODE_ENV'] || 'prod';

var staticDir = __dirname + '/build/' + env;

var app = connect()
  .use(connect.compress())
  .use(connect.static(staticDir));

console.info("Serving files in " + staticDir + " on port " + port + "...");

http.createServer(app).listen(port);
