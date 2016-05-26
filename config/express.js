const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const path = require('path');

module.exports = function(server) {

  // Statics.
  server.use(express.static('public'));

  // Views rendering.
  server.set('view engine', 'jade');
  server.set('views', path.join(__dirname, '../app/views'));

  // Sessions.
  var options = {
    client: server.redis
  };
  server.use(session({
    store: new RedisStore(options),
    secret: '3e78406bffdf4d0b3a35c1d1697d6504e18ac28e',
    resave: false,
    saveUninitialized: true
  }));

  // Body parser.
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // Logs.
  server.use(morgan('dev'));

  // Error handling.
  server.use(errorhandler());

};
