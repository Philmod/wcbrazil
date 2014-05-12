module.exports = function(server) {
  var fs  = require('fs')
    , ext = '.js'
    ;
    
  server.controllers = {};
   
  server.controller = function(filename) {
    return server.controllers[filename.toLowerCase()];
  };
  
  /**
   * Basic controllers.
   */
  var path = __dirname + '/../app/controllers';
  fs.readdirSync(path).forEach(function(filename) {
    if (!filename.match(ext + '$')) {
      return;
    }
    server.controllers[filename.replace(RegExp(ext + '$'), '').toLowerCase()] = require(path + '/' + filename)(server);
  });

};
