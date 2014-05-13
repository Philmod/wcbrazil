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
