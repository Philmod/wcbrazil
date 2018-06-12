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
   * Private endpoint to update score.
   */
  server.get('/score', function(req, res, next) {
    if (!req.query.key || req.query.key !== process.env.SCORE_KEY) {
      return res.send(401);
    }
    server.controllers.games.newScore({
        teams: req.query.teams
      , score: req.query.score
    });
    res.send(200);
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
