module.exports = function(server) {

  var mongoose = server.mongoose
    , common   = server.common
    , errors   = server.errors
    , Schema   = mongoose.Schema
    , ObjectId = Schema.ObjectId
    , Mixed    = Schema.Types.Mixed
    , async    = require('async')
    , _        = server.utils._
    ;

  var Bet = new Schema({
      user  : { type: String }
    , bet   : { type: String } // 1, X, or 2
    , points: { type: Number, default: 0 }
    /* 
      - N being the number of participants
      - W being the number of winners for that prediction
      --> The gained points P are calculated by P = N / (W + 0,1 x N)
    */
  });

  var Game = module.exports = new Schema({
      time  : { type: Date }
    , teams : [ { type: String }]
    , score : [ { type: Number, default: 0 }]
    , group : { type: String }
    , bets  : [Bet]
  });

  Game.plugin(common.timestamps('created', 'updated'));


  /**
   * Methods.
   */
  Game.method({

    /*
     * Calculate every player's points.
     */
    calculatePoints: function(callback) {
      var self = this;

      // Winning bet.
      var win = (self.score[0] > self.score[1]) ? '1' : '2';
      if (self.score[0] === self.score[1])
        win = 'X';

      // Number of winning bets.
      var nbPlayers = self.bets.length;
      var nbWin = 0;
      _.each(self.bets, function(b) {
        if (b.bet === win)
          nbWin += 1;
      });

      // Calculate the points for everyone.
      self.bets = _.map(self.bets, function(b) {
        if (b.bet === win)
          b.points = nbPlayers / (nbWin + 0.1*nbPlayers);
        else
          b.points = 0;
        return b;
      });

      self.save(callback);
    }

  });


  /**
   * Static.
   */
  Game.static({

    // Find all the game for a specific time.
    findByDate: function(date, callback) {
      var dateStart = new Date(2014, 5, 12);
      if (date < dateStart)
        date = dateStart;
      var start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      var nextDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      nextDay.setDate(date.getDate()+1);
      var end = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate(), 6, 0, 0);
      this.find({time: {$gte: start, $lt: end}}, callback);
    },

    updateScore: function(g, callback) {
      this.findOne({teams: g.teams}, function(e, gameDb) {
        if (e) return callback(e);
        if ( (g.score[0] !== gameDb.score[0]) || (g.score[1] !== gameDb.score[1])) {
          gameDb.score = g.score;
          gameDb.save(function(e, game) {
            if (e) return callback(e);
            game.calculatePoints(function(e) {
              callback(e, true);
            });
          });
        } else {
          callback(null, false);
        }
      });
    },

    getBetsPoints: function(callback) {
      var bets = {};
      this.find({}, function(e, games) {
        if (e) return callback(e);
        _.each(games, function(g) {
          _.each(g.bets, function(b) {
            if (!bets[b.user])
              bets[b.user] = 0;
            bets[b.user] += b.points || 0;
          });
        });
        var betsOut = [];
        for (var i in bets) {
          betsOut.push({
              user: i
            , points: Math.round(bets[i] * 10) / 10
          });
        };
        betsOut = _.sortBy(betsOut, function(b) {return -b.points});
        callback(null, betsOut);
      });
    }

  });

  
  /**
   * Pre save.
   */
  Game.pre('save', function(next) {
    var self = this;
    
    if (this.isNew || this.isModified('score')) {
      // Recalculate the users scores.

      next();
    } else {
      next();
    }
    
  });

  /**
   * Create model.
   */
  mongoose.model('Game', Game);

}
