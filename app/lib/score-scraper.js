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
  var mainClass  = '.content';
  var teamsClass = '.ply';
  var scoreClass = '.row-light .sco';
  var scoresClass = '.row-gray .sco';
  var scoresNamesClass = '.row-gray .info';

  var mapTeam = function(team) {
    if (team === "N.Ireland")
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
        var scoresDetails = [];
        var scoresDetailsNames = [];
        var results = [];

        /**
         * Extract data.
         */
        $(mainClass + ' ' + teamsClass).each(function(i, element) {
          console.log("ya: ", $(this).html())
          var team = mapTeam($(this).html().replace('*', '').trim());
          console.log("team: ", team)
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
          scores.push(score);
        });
        $(scoresNamesClass).each(function() {
          var scoreName = $(this).html();
          var html = cheerio.load(scoreName);
          var i = 0
            , ss = [];
          html('div').each(function() {
            ss.push($(this).html());
          });
          if (ss.length > 0) {
            scoresDetailsNames.push(ss);
          }
        });
        $(scoresClass).each(function() {
          var score = $(this).html();
          var html = cheerio.load(score);
          var i = 0
            , ss = [];
          html('div').each(function() {
            var arr = /\((\d)\s-\s(\d)\)/.exec($(this).html());
            if (arr) {
              ss.push([parseInt(arr[1]), parseInt(arr[2])]);
            } else {
              ss.push([])
            }
            i += 1;
          });
          if (ss.length > 0) {
            scoresDetails.push(ss);
          }
        });

        /**
         * Gather the result in a array of objects.
         */
        for (var i = 0; i < scores.length; i++) {
          var score = scores[i];
          score = [parseInt(score.substring(0,score.indexOf('-')-1)), parseInt(score.substring(score.indexOf('-')+2))];

          // Get penaly index.
          var penaltyIndex = 2;
          for (var j = 0; j<scoresDetails[i].length; j++) {
            if (scoresDetailsNames[i][j].match('penalty'))
              penaltyIndex = j;
          };
          var scorePenalty = scoresDetails[i][penaltyIndex];

          // add the penalty result to the score
          if (scorePenalty) {
            if (scorePenalty[0] > scorePenalty[1]) {
              score[0] += 1;
            } else {
              score[1] += 1;
            }
          }

          results.push({
              teams  : [teamsA[i], teamsB[i]]
            , score  : score
            , scoreExtraTime : scoresDetails[i][1] || null
            , scorePenalty : scorePenalty || null
          });
        };

        callback(null, results);

      });
    }

  };

};
