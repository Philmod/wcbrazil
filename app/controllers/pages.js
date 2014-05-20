module.exports = function(server) {
  
  var errors = server.errors
    , Game = server.model('Game')
    ;



  return {

    index: function(req, res, next) {

      var date = new Date(2014, 5, 14); // change to 'new Date()'

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
