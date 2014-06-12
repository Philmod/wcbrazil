
var express = require('express.io')
  , redis = require('redis')
  // , RedisStore = express.io.RedisStore
  ;

module.exports = function(server) {

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
  server.io.route('whatever', function(req) {
    req.io.emit('whatever', {message: 'yo'});
  });

  /**
   * Refresh socket.
   */
  setInterval(function() {
    server.io.broadcast('socket:refresh', {});
  }, 5*1000);

};
