var status = require('../lib/status.js')
  ;

module.exports = function(server) {

  var pages = server.controller('pages');

  /** 
   * Status.
   */
  server.get('/status', status);

  /**
   * Main page.
   */
  server.get('/', pages.index);

  
  /**
   * Error handler.
   */
  server.use(function(err, req, res, next) {
    console.log('ERROR EXPRESS : ', err);
    res.header('Cache-Control', 'no-cache');
    if (!err.code) err.code = 500;
    res.send(err.code, {error: err});
  });

};
