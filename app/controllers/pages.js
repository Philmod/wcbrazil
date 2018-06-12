module.exports = function(server) {

  var errors = server.errors
    , Game = server.model('Game')
    , utils = server.utils
    ;



  return {

    index: function(req, res, next) {

      var date = utils.getDate();
      if (req.query.date) {
        date = new Date(req.query.date);
      }

      Game.findByDate(date, function(e, games) {
        if (e) console.error('Error getting games: ', e);

        Game.getBetsPoints(date, function(e, bets) {
          if (e) console.error('Error getting bets: ', e);

          res.render('index', {
              title : 'Russia 2018'
            , games : games
            , bets  : bets
            , websocketHost: process.env.WEBSOCKET_HOST || 'ws://localhost:4440'
            , websocketPath: process.env.WEBSOCKET_PATH || '/socket.io'
          });

        });

      });

    },

  };

};
