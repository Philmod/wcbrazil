var status = require('../lib/status.js')
  ;

module.exports = function(server) {

  /** 
   * Status.
   */
  server.get('/status', status);

  /**
   * Main page.
   */
  server.get('/', function(req, res, next) {
    res.send('ok');
  })

  
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
