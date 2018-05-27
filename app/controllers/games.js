const fs = require('fs');
const async = require('async');
const scoreScraper = require('../lib/score-scraper.js')();
const moment = require('moment-timezone');
const api = require('../lib/football-data-api')();

module.exports = function(server) {

  var Game = server.model('Game')
    , utils = server.utils
    , _ = utils._
    ;

  /**
   * Changed games.
   */
  var changedGames = function(games) {
    // Transform the scores in Integer.
    games = _.map(games, function(g) {
      g.score[0] = parseInt(g.score[0]);
      g.score[1] = parseInt(g.score[1]);
      return g;
    });

    // Filter the played games.
    games = _.filter(games, function(g) { return !_.isNaN(parseInt(g.score[0])) });

    return games;
  }

  /**
   * Update all scores.
   */
  var updateScores = function(games, callback) {
    games = changedGames(games);
    if (games.length === 0) return callback(null, 0);

    var nbUpdated = 0;
    async.each(games, function(item, cb) {
      Game.updateScore(item, function(e, isUpdated) {
        if (isUpdated) nbUpdated += 1;
        cb(e);
      });
    }, function(e) {
      callback(e, nbUpdated);
    });
  }

  /**
   * Broadcast the games.
   */
  var broadcastGames = function(date) {
    Game.findByDate(date, function(e, games) {
      if (e) console.error('Error getting the games : ', e);
      else
        server.io.sockets.emit('games:update', games);
    });
  }

  /**
   * Broadcast the bets results.
   */
  var broadcastBets = function(date) {
    Game.getBetsPoints(date, function(e, bets) {
      if (e) console.error('Error getting the bets : ', e);
      else {
        server.io.sockets.emit('bets:update', bets);
      }
    });
  }


  /**
   * Scrap scores.
   */
  var scoreScraping = setInterval(function() {

    var date = utils.getDate();

    scoreScraper.scrap(function(e, results) {
      if (e) {
        console.error('Error scraping scores : ', e);
        return
      }

      updateScores(results, function(e, nbUpdated) {
        console.log('Scraping done, at  : ', new Date(), nbUpdated);
        if (e) console.error('Error updating the scores : ', e);
        if (!e && nbUpdated > 0) {
          broadcastGames(date);
          broadcastBets(date);
        }
      });

    });

    // Also get scores from API.
    // TODO(philmod): make sure the results are "live" before considering them.
    Game.findByDate(date, function(e, games) {
      if (e) console.error('Error getting the games : ', e);
      else {
        games.forEach((game) => {
          api.gameScore(game.link, (e, score) => {
            if (e) console.error('Error getting the game score (api) : ', e);
            else console.log('Score:', score)
          });
        });
      }
    });

  }, server.config.scraping.dt);

  /**
   * Public methods.
   */
  return {

    newScore: function(game) {
      console.log(' ==> newScore called : ', new Date(), game);
      Game.updateScore(game, function(e, isUpdated) {
        if (e) console.log(' ==> newScore error : ', e);
        else console.log(' ==> newScore score updated : ', isUpdated);
        var date = utils.getDate();
        broadcastGames(date);
        broadcastBets(date);
      });
    }

  };

};
