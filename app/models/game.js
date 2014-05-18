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

  var Game = module.exports = new Schema({
      time  : { type: Date }
    , teams : [ { type: String }]
    , score : [ { type: Number, default: 0 }]
    , group : { type: String }
  });

  Game.plugin(common.timestamps('created', 'updated'));

  /**
   * Methods.
   */
  Game.method({

  });

  /**
   * Static.
   */
  Game.static({

    // Find all the game for a specific time.
    findByDate: function(date, callback) {
      var start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      var nextDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      nextDay.setDate(date.getDate()+1);
      var end = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate(), 6, 0, 0);
      this.find({time: {$gte: start, $lt: end}}, callback);
    },

    updateScores: function(games, callback) {
      var self = this
        , nbUpdated = 0;

      // Transform the scores in Integer.
      games = _.map(games, function(g) {
        g.score[0] = parseInt(g.score[0]);
        g.score[1] = parseInt(g.score[1]);
        return g;
      });
      // Filter the played games.
      games = _.filter(games, function(g) { return !_.isNaN(parseInt(g.score[0])) });
      if (games.length === 0) return callback(null, nbUpdated);

      // Update a score if needed.
      var updateScore = function(g, cb) {
        self.findOne({teams: g.teams}, function(e, gameDb) {
          if (e) return cb(e);
          if ( (g.score[0] !== gameDb.score[0]) || (g.score[1] !== gameDb.score[1])) {
            gameDb.score = g.score;
            nbUpdated += 1;
            gameDb.save(cb);
          }
        });
      };

      // Loop.
      async.each(games, updateScore, function(e) {
        callback(e, nbUpdated);
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
