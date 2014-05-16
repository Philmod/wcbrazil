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

// Test socket
var Game = server.model('Game');
function random (low, high) {
  return Math.round( Math.random() * (high - low) + low );
}
setInterval(function () {
  var date = new Date(2014, 5, 14); // change to 'new Date()'
  Game.findByDate(date, function(e, games) { 
    games[0].score[0] = random(0,5);
    games[1].score[0] = random(0,5);
    games[1].score[1] = random(0,5);
    games[2].score[1] = random(0,5);
    
    server.io.broadcast('games:update', games);

  });
}, 2000);
