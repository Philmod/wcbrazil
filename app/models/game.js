module.exports = function(server) {

  /**
   * Dependencies.
   */
  var mongoose = server.mongoose
    , common   = server.common
    , errors   = server.errors
    , Schema   = mongoose.Schema
    , ObjectId = Schema.ObjectId
    , Mixed    = Schema.Types.Mixed
    , async    = require('async')
    , utils    = server.utils
    , _        = utils._
    , moment   = require('moment-timezone')
    ;

  /**
   * Constants.
   */
  var FINALES_START_DATE = new Date(moment.tz("2014-06-28 00:00:00", "America/Fortaleza").format());

  /**
   * Bet schema.
   */
  var Bet = new Schema({
      user  : { type: String }
    , bet   : { type: String } // 1, X, or 2; 1+, 1++, 2+, 2++, 1X, 2X
    , points: { type: Number, default: 0 }
    /* 
      - N being the number of participants
      - W being the number of winners for that prediction
      --> The gained points P are calculated by P = N / (W + 0,1 x N)
    */
  });

  /**
   * Goal schema.
   */
  var Goal = new Schema({
      minutes : { type: Number, default: 0 }
    , score : [ { type: Number, default: 0 }]
    , time : { type: String }
    , correction : { type: Boolean, default: false }
  })

  /**
   * Game schema.
   */
  var Game = module.exports = new Schema({
      time  : { type: Date }
    , teams : [ { type: String }]
    , score : [ { type: Number, default: 0 }]
    , group : { type: String }
    , bets  : [Bet]
    , finales : { type: Number, default: -1 }
    , goals : [Goal]
  });

  Game.plugin(common.timestamps('created', 'updated'));


  /**
   * Methods.
   */
  Game.method({

    /*
     * Calculate every player's points.
     */
    calculatePoints: function(g, callback) {
      var self = this;

      // Winning bet pool.
      var win = (self.score[0] > self.score[1]) ? '1' : '2';
      if (self.score[0] === self.score[1])
        win = 'X';

      // Winning bet finales.
      if (new Date(utils.getDate()) >= FINALES_START_DATE) {
        win = null;
        var time = g.timeGoal;
        if (g.correction) {
          // find the last goal
          var i = self.goals.length-1;
          while (self.goals[i].correction && i>=0) {
            i -= 1;
          }
          time = self.goals[i].minutes || 0;
        }
        if (time <= 90) {
          if ( (Math.abs(self.score[0] - self.score[1])) >= 2)
            win = (self.score[0] > self.score[1]) ? '1++' : '2++';  
          else if ( (Math.abs(self.score[0] - self.score[1])) == 1)
            win = (self.score[0] > self.score[1]) ? '1+' : '2+';
        }
        else {
          if ( (Math.abs(self.score[0] - self.score[1])) > 0)
            win = (self.score[0] > self.score[1]) ? '1X' : '2X';  
        }
      }

      console.log('win : ', win);

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

    
    findByDate: function(date, callback) {
      date = new Date(date);
      var dateStart = new Date(2014, 5, 12);
      if (date < dateStart)
        date = dateStart;
      var start = moment(date).tz('America/Fortaleza').startOf('day').format();
      var end = moment(date).tz('America/Fortaleza').endOf('day').format();
      this.find({time: {$gte: start, $lt: end}}).sort('time').exec(callback);
    },

    /**
     * Get groups playing at that time.
     */
    groupByDate: function(date, callback) {
      date = new Date(date);
      var start = new Date(moment(date).subtract('hours', 2).format());
      var end = date;
      this.find({time: {$gte: start, $lt: end}}, function(e, games) {
        if (e) return callback(e);
        var groups = _.map(games, function(g) { return g.group});
        callback(null, _.uniq(groups));
      });
    },

    updateScore: function(g, callback) {
      this.findOne({teams: g.teams}, function(e, gameDb) {
        if (e) return callback(e);
        if (!gameDb) return callback(new Error('There is no game with these teams: ' + JSON.stringify(g.teams)));
        if ( (g.score[0] !== gameDb.score[0]) || (g.score[1] !== gameDb.score[1])) {
          gameDb.score = g.score;
          gameDb.goals.push({
              minutes : g.timeGoal || 0
            , score : g.score
            , time : moment().tz("America/Fortaleza").format()
            , correction : g.correction || false
          });
          gameDb.save(function(e, game) {
            if (e) return callback(e);
            game.calculatePoints(g, function(e) {
              callback(e, true);
            });
          });
        } else {
          callback(null, false);
        }
      });
    },

    getBetsPoints: function(date, callback) {
      date = new Date(date);
      var dateStart = new Date(2014, 5, 12);
      if (date < dateStart)
        date = dateStart;

      var self = this;
      var bets = {};
      var betsDay = {};

      // Get games until end of the day.
      var query = {
        time: {
          $lte: (moment(date).tz('America/Fortaleza').endOf('day').format())
        }
      };
      // If finales, don't take older bets.
      if (date >= FINALES_START_DATE) {
        query.time.$gte = FINALES_START_DATE;
      }
      // Querying.
      self.find(query).sort('time').exec(function(e, games) {
        if (e) return callback(e);

        _.each(games, function(g) {
          // Sum the points.
          _.each(g.bets, function(b) {
            if (!bets[b.user])
              bets[b.user] = 0;
            bets[b.user] += b.points || 0;
          });

          // Export the bets of the day.
          if (moment(g.time).tz('America/Fortaleza').format('YYYY-MM-D') === moment(date).tz('America/Fortaleza').format('YYYY-MM-D')) {
            _.each(g.bets, function(b) {
              if (!betsDay[b.user])
                betsDay[b.user] = [];
              betsDay[b.user].push(b.bet);
            });
          }
        });
        var betsOut = [];

        // Get the bets scores since the last game.
        self.getPointsBefore(date, function(e, pointsBefore, rankingBefore) {
          if (e) return callback(e);

          // Add all the information to the returned object 'betsOut'.
          for (var i in bets) {
            betsOut.push({
                user: i
              , points: Math.round(bets[i] * 10) / 10
              , differencePoints: (Math.round( (bets[i] - pointsBefore[i]) * 10) / 10)
              , ranking: null
              , rankingBefore: rankingBefore[i]
              , bets: betsDay[i]
            });
          };
          betsOut = _.sortBy(betsOut, function(b) {return -b.points});

          // Set the ranking.
          var rank = 0;
          for (var i = 0; i<betsOut.length; i++) {
            if (i===0 || betsOut[i].points !== betsOut[i-1].points) {
              rank = i + 1;  
            }
            betsOut[i].ranking = rank;
          }

          for (var i = 0; i<betsOut.length; i++) {
            betsOut[i].differenceRanking = (betsOut[i].rankingBefore) ? (betsOut[i].rankingBefore - betsOut[i].ranking) : '';
          }
// console.log('betsOut : ', betsOut);
          callback(null, betsOut);
        });
        
      });
    },

    getPointsBefore: function(date, callback) {
      var self = this;
      var bets = {};
      var betsOrdered = [];
      var ranking = {};

      // Get games until end of the day.
      var query = {
        time: {
          $lt: date
        }
      };
      // If finales, don't take older bets.
      if (date >= FINALES_START_DATE) {
        query.time.$gte = FINALES_START_DATE;
      }
      // Querying.
      console.log('query : ', query);
      self.find(query).sort('time').exec(function(e, games) {
        console.log('yo : ', e, games.length)
        if (e) return callback(e);
        if (!games) return callback();

        // Check if the last 2 games were together.
        var skip = 1;
        if (games.length > 2 && moment(games[games.length-1].time).format() == moment(games[games.length-2].time).format() )
          skip = 2;

        for (var i = 0; i<games.length-skip; i++) {
          var g = games[i];
          _.each(g.bets, function(b) {
            if (!bets[b.user])
              bets[b.user] = 0;
            bets[b.user] += b.points || 0;
          });
        }
        for (var i in bets) {
          betsOrdered.push({
              user: i
            , points: Math.round(bets[i] * 10) / 10
          });
        }
        betsOrdered = _.sortBy(betsOrdered, function(b) {return -b.points});

        // Set the ranking.
        var rank = 0;
        for (var i = 0; i<betsOrdered.length; i++) {
          if (i===0 || betsOrdered[i].points !== betsOrdered[i-1].points) {
            rank = i + 1;  
          }
          ranking[betsOrdered[i].user] = rank;
        }
console.log('before : ', bets, ranking);
        callback(null, bets, ranking);
      });
    },

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
