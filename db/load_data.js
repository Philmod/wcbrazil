var fs = require('fs')
  , async = require('async')
  ;

module.exports = function(server) {

  /**
   * Dependencies.
   */
  var Game  = server.model('Game')
    , utils = server.utils
    , _     = utils._
    ;

  /**
   * Data.
   */
  var games = utils.loadJSON(__dirname + '/games.json');
  var gamesFinales8 = utils.loadJSON(__dirname + '/gamesFinales8.json');
  var gamesFinales4 = []; // utils.loadJSON(__dirname + '/gamesFinales4.json');
  var gamesFinales2 = []; // utils.loadJSON(__dirname + '/gamesFinales2.json');
  var gamesFinales1 = []; // utils.loadJSON(__dirname + '/gamesFinales1.json');
  var bets = utils.loadJSON(__dirname + '/bets.json');
  var betsFinales8 = utils.loadJSON(__dirname + '/betsFinales8.json');
  var betsFinales4 = []; // utils.loadJSON(__dirname + '/betsFinales4.json');
  var betsFinales2 = []; // utils.loadJSON(__dirname + '/betsFinales2.json');
  var betsFinales1 = []; // utils.loadJSON(__dirname + '/betsFinales1.json');

  /**
   * Stop if error.
   */
  var stop = function(msg, e) {
    console.error(msg + ' : ' + e);
    process.exit();
  };

  var mapTeam = function(teams) {
    // if (teams[0] === 'Bosnia Herzegovina')
    //   teams[0] = 'Bosnia-Herzegovina';
    // if (teams[1] === 'Bosnia Herzegovina')
    //   teams[1] = 'Bosnia-Herzegovina';
    // if (teams[0] === 'United States')
    //   teams[0] = 'USA';
    // if (teams[1] === 'United States')
    //   teams[1] = 'USA';
    return teams;
  }

  /**
   * Check if data.
   */
  async.series([
    // 1. Check games.
    function(callback) {
      Game.count(function(e, c) {
        if (e) stop('Error counting the games', e);
        if (c < games.length) {
          console.log('Loading the games into the DB...');
          // Game.remove();
          async.each(games, function(item, cb) {
            var game = new Game(item);
            game.save(cb);
          }, function(e) {
            if (e) stop('Error loading the games', e);
            console.log('Games loaded');
            callback(e);
          });
        } else {
          callback();
        }
      })
    },
    // 2. Check bets.
    function(callback) {
      async.each(bets, function(item, cb) {
        var teams = [item.Team1, item.Team2];
        teams = mapTeam(teams);
        Game.findOne({teams: teams}, function(e, g) {
          if (e) return cb(e);
          if (!g) stop('These teams do not exist : ', teams);
          var users = item;
          delete users.Team1; delete users.Team2;
          var nbBets = Object.keys(users).length;
          if (g.bets.length !== nbBets) {
            var gameBets = [];
            for (var user in users) {
              gameBets.push({
                  user: user
                , bet: users[user]
              });
            }
            g.bets = gameBets;
            g.save(cb);
          } else {
            cb();
          }
        });
      }, function(e) {
        callback(e);
      });
    },
    // 3. Check games finales.
    function(callback) {

      var files = [gamesFinales8, gamesFinales4, gamesFinales2, gamesFinales1];

      async.each(files, function(file, cbFile) {

        if (!file)
          return cbFile();

        var games = file;
        var n = 0;

        async.each(games, function(item, cb) {
          Game.findOne({teams: item.teams, time: item.time, finales: item.finales}, function(e, g) {
            if (e) return cb(e);
            if (g) return cb();
            var game = new Game(item);
            n += 1;
            game.save(cb);
          });
        }, function(e) {
          if (e) stop('Error loading the games finales ', e);
          console.log('Games finales loaded : ', n);
          cbFile(e);
        });

      }, function(e) {
        if (e) stop('Error loading the finales ', e);
        callback(e);
      });


    },
    // 4. Check bets finales.
    function(callback) {
      var files = [betsFinales8, betsFinales4, betsFinales2, betsFinales1];

      async.each(files, function(file, cbFile) {

        if (!file)
          return cbFile();

        var bets = file;
        var n = 0;

        async.each(bets, function(item, cb) {
          var teams = [item.Team1, item.Team2];
          teams = mapTeam(teams);
          Game.findOne({teams: teams, finales: item.finales}, function(e, g) {
            if (e) return cb(e);
            if (!g) stop('These teams do not exist [finales] : ', teams, item);
            var users = item;
            delete users.Team1; delete users.Team2; delete users.finales;
            var nbBets = Object.keys(users).length;
            if (g.bets.length !== nbBets) {
              var gameBets = [];
              for (var user in users) {
                gameBets.push({
                    user: user
                  , bet: users[user]
                });
              }
              g.bets = gameBets;
              n += 1;
              g.save(cb);
            } else {
              cb();
            }
          });
        }, function(e) {
          if (e) stop('Error loading the bets finales ', e);
          console.log('Bets finales loaded : ', n);
          cbFile(e);
        });

      }, function(e) {
        if (e) stop('Error loading the bets ', e);
        callback(e);
      });
    }
  ], function(e) {
    if (e) stop('Error loading data', e);
    else console.log('All data loaded.')
  });

};
