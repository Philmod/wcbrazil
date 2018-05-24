module.exports = function(server) {

  var errors = server.errors
    , Game = server.model('Game')
    , utils = server.utils
    ;



  return {

    index: function(req, res, next) {

      var date = utils.getDate();

      Game.findByDate(date, function(e, games) {

        Game.getBetsPoints(date, function(e, bets) {

          res.render('index', {
              title : 'Russia 2018'
            , games : games
            , bets  : bets
          });

        });

      });

    },

  };

};
