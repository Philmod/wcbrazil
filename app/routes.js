const status = require('./lib/status.js');

module.exports = function(server) {

  var pages = server.controllers.pages;

  /**
   * Status.
   */
  server.get('/status', (req, res, next) => {
    // make sure the database is connected.
    server.model('Game').count(function(e, c) {
      if (e) 
        return next(e);
      status(req, res, next);
    })
  });

  /**
   * Main page.
   */
  server.get('/', pages.index);

  /**
   * Partials.
   */
  server.get('/partial/:name', function (req, res, next) {
    res.render('partials/' + req.params.name);
  });

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
