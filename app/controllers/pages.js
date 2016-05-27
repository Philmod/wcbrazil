module.exports = function(server) {

  var errors = server.errors
    , Game = server.model('Game')
    , utils = server.utils
    ;



  return {

    index: function(req, res, next) {

      var date = utils.getDate();
      var date = new Date("2014-06-13T20:00:00.000Z") //utils.getDate();

      Game.findByDate(date, function(e, games) {

        Game.getBetsPoints(date, function(e, bets) {

          res.render('index', {
              title : 'France 2016'
            , games : games
            , bets  : bets
          });

        });

      });

    },

  };

};
