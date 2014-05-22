/**
 * Dependencies.
 */
var newrelic = require('newrelic');
var express = require('express.io')
  , server  = express()
  , util = require('util')
  ;

server.http().io();

/**
 * Set up general configuration.
 */
require('./config')(server);

/**
 * Express configuration.
 */
require('./config/express')(server);

/**
 * Models.
 */
require('./config/models')(server);

/**
 * Controllers.
 */
require('./config/controllers')(server);

/**
 * Routes.
 */
require('./config/routes')(server);

/**
 * Sockets.
 */
require('./config/sockets')(server);

/**
 * Start server.
 */
var port = server.set('port');
server.listen(process.env.PORT || port || 80, function() {
  console.log("WCBrazil HTTP listening on port " + port);  
});

/*
 * Check memory leaks.
 */
setInterval(function() {
  console.log('Memory : ', util.inspect(process.memoryUsage()));
}, 10000);

/**
 * Load Data.
 */
require('./db/load_data.js')(server);
