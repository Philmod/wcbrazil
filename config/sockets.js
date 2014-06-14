
var express = require('express.io')
  , redis = require('redis')
  // , RedisStore = express.io.RedisStore
  ;

module.exports = function(server) {

  var Game = server.model('Game')
    , utils = server.utils;

  /**
   * Configuration.
   */
  server.io.enable('browser client minification');  // send minified client
  server.io.enable('browser client etag');          // apply etag caching logic based on version number
  server.io.enable('browser client gzip');          // gzip the file

  /**
   * Set Redis store.
   */
  // server.io.set('store', new express.io.RedisStore({
  //   redisPub: server.redis,
  //   redisSub: server.redis,
  //   redisClient: server.redis
  // }));

  /**
   * Basic callbacks.
   */
  server.io.on('connection', function(socket) {
    console.log('Socket.io connection : ', socket.id);
  });

  /**
   * Routes.
   */
  server.io.route('socket:reconnected', function(req) {
    Game.findByDate(utils.getDate(), function(e, games) {
      if (!e && games) req.io.emit('games:update', games);
    });
    Game.getBetsPoints(utils.getDate(), function(e, bets) {
      if (!e && bets) req.io.emit('bets:update', bets);
    });
  });

  /**
   * Refresh socket.
   */
  setInterval(function() {
    server.io.broadcast('socket:refresh', {});
  }, 5*1000);

};
