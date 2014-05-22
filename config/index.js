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
  server.utils  = require('../lib/utils');
  server.errors = require('../lib/errors');
  server.common = require('../lib/common');

  /** 
   * DB.
   */
  server.config.mongodb = require('./mongodb')[serverEnv];

  /**
   * Scraping.
   */
  server.config.scraping = {
      groups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    , dt: 5*1000
  };

  /**
   * Redis.
   */
  if (process.env.REDISTOGO_URL) {
    var rtg = require("url").parse(process.env.REDISTOGO_URL);
    server.redis = redis.createClient(rtg.port, rtg.hostname);
    server.redis.auth(rtg.auth.split(":")[1]);
  } else {
    server.redis = redis.createClient();
  }


};
