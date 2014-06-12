var express = require('express.io')
  , exec    = require('child_process').exec
  , winston = require('winston')
  , expressWinston = require('express-winston')
  , RedisStore = require('connect-redis')(express)
  ;

module.exports = function(server) {

  server.configure(function() {

    server.use(express.logger('dev'));

    server.use(express.compress());
    server.use(express.static(__dirname + '/../public'));
    // server.use(express.favicon(__dirname + '/../public/img/alarmclock.ico'))
    server.use(express.bodyParser());
    server.use(express.methodOverride());
    server.use(express.cookieParser('7ec7f11a3447b6f3b935ee7ee1e6423667cc3f09'));

    /**
     * Winston errors logs.
     */
    server.use(expressWinston.errorLogger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        })
      ]
    }));

    server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  });

  /**
   * Session store.
   */
  var store = new RedisStore({
    client: server.redis
  });
  server.configure(function() {
    server.use(express.session({
        secret: '3e78406bffdf4d0b3a35c1d1697d6504e18ac28e'
      , store: store
    }));
    express.session.ignore = ['/robots.txt','/status','/favicon.ico'];
  });


  /**
   * Options depending on the environment.
   */
  server.set('protocol', 'http');
  server.configure('development', function() {
  });

  server.configure('test', function() {
  });

  server.configure('preview', function() {
  });

  server.configure('production', function() {
    server.set('protocol', 'https');
  });
  /** **/

  server.configure(function() {

    /**
     * View configuration.
     */
    server.set('views', __dirname + '/../app/views');
    server.set('view engine', 'jade');


  });


};
