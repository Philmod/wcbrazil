module.exports = function(server, next) {

  /**
   * Dependencies.
   */
  var exec = require('child_process').exec
    , http = require('http')
    , fs   = require('fs')
    , path = require('path')
    , redis = require('redis')
    ;

  /**
   * Options.
   */
  Error.stackTraceLimit = 25;
  http.globalAgent.maxSockets = 100;


  /**
   * Global variables.
   */
  server.set('hostname',require('os').hostname());
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  server.set('env', process.env.NODE_ENV);


  /**
   * Configurations.
   */
  var serverEnv = server.set('env').toLowerCase();
  server.config = {};
  server.set('port', 4440);


  /**
   * Utilities.
   */
  server.utils  = require('./utils')(server);
  server.errors = require('./errors');
  server.common = require('./common');

  /**
   * DB.
   */
  server.config.mongodb = require('./mongodb')[serverEnv];

  /**
   * Timezone.
   */
  server.config.tz = 'CET';

  /**
   * Redis.
   */
  var redisOptions = {
    host: process.env.REDIS_SERVICE_HOST || process.env.REDIS_PORT_6379_TCP_ADDR || 'localhost',
    port: process.env.REDIS_SERVICE_PORT || 6379
  };
  server.redis = redis.createClient(redisOptions);
  server.redis.on("error", function(err) {
    console.log("Redis Error " + err);
  });
  server.redis.on("connect", function () {
    console.log('Redis connected.');
  });

  server.redisSub = redis.createClient(redisOptions);
  server.redisSub.on("error", function(err) {
    console.log("Redis Error " + err);
  });
  server.redisSub.on("connect", function () {
    console.log('Redis connected.');
  });

};
