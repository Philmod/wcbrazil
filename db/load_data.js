var fs = require('fs')
  , async = require('async')
  ;

module.exports = function(server) {

  /**
   * Dependencies.
   */
  var Game = server.model('Game')
    , _    = server.utils._
    ;

  /**
   * Data.
   */
  var bets = JSON.parse(fs.readFileSync(__dirname + '/bets.json', 'utf8'));
  var games = JSON.parse(fs.readFileSync(__dirname + '/games.json', 'utf8'));

  /**
   * Stop if error.
   */
  var stop = function(msg, e) {
    console.error(msg + ' : ' + e);
    process.exit();
  };

  var mapTeam = function(teams) {
    if (teams[0] === 'Bosnia Herzegovina')
      teams[0] = 'Bosnia-Herzegovina';
    if (teams[1] === 'Bosnia Herzegovina')
      teams[1] = 'Bosnia-Herzegovina';
    if (teams[0] === 'United States')
      teams[0] = 'USA';
    if (teams[1] === 'United States')
      teams[1] = 'USA';
    return teams;
  }

  /**
   * Check if data.
   */
  async.series([
    // 1. Check games.
    function(callback) {
      Game.count(function(e,c) {
        if (e) stop('Error counting the games', e);
        if (c !== games.length) {
          console.log('Loading the games into the DB...');
          Game.remove();
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
          if (!g) stop('This teams do not exist : ', teams);
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
    }
  ], function(e) {
    if (e) stop('Error loading data', e);
    else console.log('All data loaded.')
  });

};
