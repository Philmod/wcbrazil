module.exports = function(server) {
  
  var errors = server.errors
    , Game  = server.model('Game')
    ;



  return {

    index: function(req, res, next) {

      Game.findByDate(new Date(2014, 5, 16), function(e, games) {

        res.render('index', {
            title : 'WCBrazil'
          , games : games
        });

      });

    },

  };

};
