module.exports = function(server) {
  
  var errors = server.errors
    , moment = require('moment-timezone')
    , Game = server.model('Game')
    ;



  return {

    index: function(req, res, next) {

      var date = moment.tz("2014-06-14", "America/Fortaleza").format();

      Game.findByDate(date, function(e, games) { 

        Game.getBetsPoints(function(e, bets) {
          
          res.render('index', {
              title : 'WCBrazil'
            , games : games
            , bets  : bets
          });
          
        });

      });

    },

  };

};
