module.exports = function(server) {

  var mongoose = server.mongoose
    , common   = server.common
    , errors   = server.errors
    , Schema   = mongoose.Schema
    , ObjectId = Schema.ObjectId
    , Mixed    = Schema.Types.Mixed
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
