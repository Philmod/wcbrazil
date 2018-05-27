/**
 * Dependencies.
 */
const request = require('request');
const cheerio = require('cheerio');
const fakeUa = require('fake-useragent');

/**
 * Module.
 */
module.exports = function (options) {

  /**
   * Constants.
   */
  var url = 'http://terrikon.com/livescore'; // http://www.livescore.cz/
  var mainClass  = '.content-site';
  var teamsClass = '.gameresult .team';
  var scoreClass = '.score';

  var mapTeam = function(team) {
    if (team === "N.Ireland" || team === "North. Ireland")
      team = "Northern Ireland";
    if (team === "Ireland")
      team = "Republic of Ireland";
      
    return team;
  }

  return {

    scrap: function(callback) {

      request({
        url: url,
        headers: {
          'User-Agent': fakeUa()
        }
      }, function(e, r, b) {
        if (e)
          return callback(e);
        statusCode = r && r.statusCode
        if (statusCode != 200) {
          return callback(new Error(statusCode))
        }

        b = b.replace(/<(\/?)script/g, '<$1nobreakage');

        $ = cheerio.load(b);

        /**
         * Variables.
         */
        var teamsA = [];
        var teamsB = [];
        var scores = [];
        var scoresPenalty = [];
        var results = [];

        /**
         * Extract data.
         */
        $(mainClass + ' ' + teamsClass).each(function(i, element) {
          var team = mapTeam($(this).html().replace('*', '').trim());
          team = team.substring(team.indexOf('>')+1, team.indexOf('</a>'));
          if (team) {
            if (teamsA.length > teamsB.length) {
              teamsB.push(team);
            } else {
              teamsA.push(team);
            }
          }
        });
        $(mainClass + ' ' + scoreClass).each(function() {
          var score = $(this).html();
          if (score.match('</a>'))
            score = score.substring(score.indexOf('>')+1, score.indexOf('</a>'));
          score = score.trim();
          scoreSplit = score.split('<br>')
          if (scoreSplit.length > 1) {
            scores.push(scoreSplit[0]);
            scoresPenalty.push(scoreSplit[1].replace('(', '').replace(')', '').trim());
          } else {
            scores.push(score);
            scoresPenalty.push('')
          }
        });

        /**
         * Gather the result in a array of objects.
         */
        for (let i = 0; i < scores.length; i++) {
          let score = scores[i];
          score = [parseInt(score.substring(0,score.indexOf(':'))), parseInt(score.substring(score.indexOf(':')+1,score.length))];

          // add the penalty result to the score
          let scorePenalty = scoresPenalty[i];
          if (scorePenalty) {
            scorePenalty = [parseInt(scorePenalty.substring(0,scorePenalty.indexOf(':'))), parseInt(scorePenalty.substring(scorePenalty.indexOf(':')+1,scorePenalty.length))];
            if (scorePenalty[0] > scorePenalty[1]) {
              score[0] += 1;
            } else {
              score[1] += 1;
            }
          }

          results.push({
              teams  : [teamsA[i], teamsB[i]]
            , score  : score
            // TODO(philmod): detect extra time score.
            , scoreExtraTime : null
            , scorePenalty : scorePenalty || null
          });
        };

        callback(null, results);

      });
    }

  };

};
