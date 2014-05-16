module.exports = function(server) {
  
  var errors = server.errors
    , Game = server.model('Game')
    ;



  return {

    index: function(req, res, next) {

      var date = new Date(2014, 5, 14); // change to 'new Date()'

      Game.findByDate(date, function(e, games) { 

        var bets = [
          {
              username: 'Phimod'
            , score: 55
            , difference: 1
          },
          {
              username: 'Dim'
            , score: 54
            , difference: -1
          },
          {
              username: 'Arno'
            , score: 50
            , difference: -1
          },
          {
              username: 'Denis'
            , score: 48
            , difference: 0
          },
        ];

        res.render('index', {
            title : 'WCBrazil'
          , games : games
          , bets  : bets
        });

      });

    },

  };

};
