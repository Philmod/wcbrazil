
var express = require('express.io')
  , redis = require('redis')
  // , RedisStore = express.io.RedisStore
  ;

module.exports = function(server) {

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
