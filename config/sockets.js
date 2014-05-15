
var express = require('express.io')
  , redis = require('redis')
  , RedisStore = express.io.RedisStore
  ;

module.exports = function(server) {

  /**
   * Set Redis store.
   */
  server.io.set('store', new express.io.RedisStore({
    redisPub: redis.createClient(),
    redisSub: redis.createClient(),
    redisClient: redis.createClient()
  }));

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

};
