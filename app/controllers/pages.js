module.exports = function(server) {
  
  var errors = server.errors
    , Game  = server.model('Game')
    ;



  return {

    index: function(req, res, next) {

      var date = new Date(2014, 5, 14); // change to 'new Date()'

      Game.findByDate(date, function(e, games) {

        console.log('gaesm : ', games.length)

        res.render('index', {
            title : 'WCBrazil'
          , games : games
        });

      });

    },

  };

};
