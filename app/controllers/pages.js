module.exports = function(server) {
  
  var errors   = server.errors
    ;


  return {


    index: function(req, res, next) {

      res.render('index', {
        title : 'WCBrazil'
      });

    },

  };

};
