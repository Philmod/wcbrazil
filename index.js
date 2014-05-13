/**
 * Dependencies.
 */
var express = require('express.io')
  , server  = express()
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
 * Start server.
 */
var port = server.set('port');
server.listen(port || 80, function() {
  console.log("WCBrazil HTTP listening on port " + port);  
});
