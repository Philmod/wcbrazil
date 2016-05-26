/**
 * Dependencies.
 */
var newrelic = require('newrelic');
var app = require('express')();
var server  = require('http').createServer(app);
app.io = require('socket.io')(server);
var util = require('util');
var compressor = require('node-minify');

/**
 * Set up general configuration.
 */
require('./config')(app);

/**
 * Express configuration.
 */
require('./config/express')(app);

/**
 * Models.
 */
require('./config/models')(app);

/**
 * Controllers.
 */
require('./config/controllers')(app);

/**
 * Routes.
 */
require('./config/routes')(app);

/**
 * Sockets.
 */
require('./config/sockets')(app);

/**
 * Start server.
 */
var port = app.set('port');
server.listen(process.env.PORT || port || 80, function() {
  console.log("France2016 HTTP listening on port " + port);
});

/**
 * Start twitter streaming.
 */
require('./lib/twitter-stream.js')(app);

/*
 * Check memory leaks.
 */
require('./lib/memusage')(app, {
    interval: 30000,
    maxMemory: 1024
});

/**
 * Load Data.
 */
require('./db/load_data.js')(app);

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
            , 'node_modules/socket.io-client/socket.io.js'
            , 'public/js/livefyre.js'
            ],
    fileOut: 'public/base-onefile.js',
    callback: function(err, min){
      if (err) console.log('Error minifying JS files', err);
      else console.log('JS Minified.');
    }
});
new compressor.minify({
    type: 'yui-css',
    fileIn: [ 'public/bootstrap/css/bootstrap.min.css'
            , 'public/css/app.css'
            , 'public/css/app-responsive.css'
            , 'public/css/app-browser.css'
            , 'public/css/flip.css'
            , 'public/css/anton.css'
            ],
    fileOut: 'public/base-onefile.css',
    callback: function(err, min){
      if (err) console.log('Error minifying CSS files', err);
      else console.log('CSS Minified.');
    }
});
