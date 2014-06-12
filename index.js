/**
 * Dependencies.
 */
var newrelic = require('newrelic');
var express = require('express.io')
  , server  = express()
  , util = require('util')
  , compressor = require('node-minify')
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

/*
 * Check memory leaks.
 */
require('./lib/memusage')(server, {
    interval: 60000,
    maxMemory: 1024
});

/**
 * Load Data.
 */
require('./db/load_data.js')(server);

/**
 * Compress/minify statics.
 */
new compressor.minify({
    type: 'uglifyjs',
    fileIn: [ 'public/bower_components/angular/angular.js'
            , 'public/bower_components/angular-route/angular-route.js'
            , 'public/bower_components/angular-socket-io/socket.js'
            , 'public/js/lib/jquery/jquery-2.0.3.min.js'
            , 'public/bootstrap/js/bootstrap.min.js'
            , 'public/bootstrap/js/holder.js'
            , 'public/js/app.js'
            , 'public/js/services.js'
            , 'public/js/controllers.js'
            , 'public/js/filters.js'
            , 'node_modules/express.io/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.min.js'
            ],
    fileOut: 'public/base-onefile.js',
    callback: function(err, min){
      if (err) console.log('Error minifying JS files', err);
      else console.log('JS Minified.');
      // console.log(min);
    }
});
new compressor.minify({
    type: 'yui-css',
    fileIn: [ 'public/bootstrap/css/bootstrap.min.css'
            , 'public/css/app.css'
            , 'public/css/app-responsive.css'
            , 'public/css/app-browser.css'
            , 'public/css/flip.css'
            ],
    fileOut: 'public/base-onefile.css',
    callback: function(err, min){
      if (err) console.log('Error minifying CSS files', err);
      else console.log('CSS Minified.');
      // console.log(min);
    }
});
