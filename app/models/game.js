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

    updateScore: function(g, callback) {
      this.findOne({teams: g.teams}, function(e, gameDb) {
        if (e) return callback(e);
        if ( (g.score[0] !== gameDb.score[0]) || (g.score[1] !== gameDb.score[1])) {
          gameDb.score = g.score;
          gameDb.save(callback);
        }
      });
    }

  });

  /**
   * Methods.
   */
  Game.method({

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
