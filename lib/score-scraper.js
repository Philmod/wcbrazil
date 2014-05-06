/**
 * Dependencies.
 */
var scraper = require('scraper');

module.exports = function (options) {

  /**
   * Constants.
   */
  var url = 'http://www.livescore.com/worldcup2014/';
  var groupsWC = [
      'Group A'
    , 'Group B'
    , 'Group C'
    , 'Group D'
    , 'Group E'
    , 'Group F'
    , 'Group G'
    , 'Group H'
  ];
  var mainClass  = '.league-table';
  var teamAClass = '.fh';
  var teamBClass = '.fa';
  var scoreClass = '.fs'; // a
  var leagueClass = '.league strong';
  var groupClass = '.league a';
  var dateClass = '.date';
  var hourClass = '.fd';

  return {

    scrap: function(callback) {

      scraper(url, function(err, $) {
        if (err)
          return callback(err);

        /**
         * Variables.
         */
        var teamsA = [];
        var teamsB = [];
        var scores = [];
        var leagues = [];
        var groups = [];
        var gamesByGroup = [];
        var dates = [];
        var hours = [];
        var results = [];

        /**
         * Extract data.
         */
        $(mainClass).each(function() {
          var html = $(this).html();
          var matches = html.match(/fh/g);
          var c = (matches) ? matches.length : 0;
          // if (c===4) 
            console.log('html : ', html)
            console.log('c : ', c);
          gamesByGroup.push(c);
        });
        $(mainClass + ' ' + teamAClass).each(function() {
          teamsA.push($(this).html());
        });
        $(mainClass + ' ' + teamBClass).each(function() {
          teamsB.push($(this).html());
        });
        $(mainClass + ' ' + hourClass).each(function() {
          hours.push($(this).html());
        });
        $(mainClass + ' ' + scoreClass).each(function() {
          var score = $(this).html();
          if (score.match('</a>'))
            score = score.substring(score.indexOf('>')+1, score.indexOf('</a>'));
          score = score.trim();
          scores.push(score);
        });
        var i = 0;
        $(mainClass + ' ' + leagueClass).each(function() {
          for (var j = 0; j < gamesByGroup[i]; j++) {
            leagues.push($(this).html());
          }
          i += 1;
        });
        var i = 0;
        $(mainClass + ' ' + groupClass).each(function() {
          for (var j = 0; j < gamesByGroup[i]; j++) {
            groups.push($(this).html());
          }
          i += 1;
        });
        var i = 0;
        $(mainClass + ' ' + dateClass).each(function() {
          console.log('this date : ', $(this).html(), gamesByGroup[i])
          for (var j = 0; j < gamesByGroup[i]; j++) {
            dates.push($(this).html());
          }
          i += 1;
        });

        /**
         * Check the arrays' lengths.
         */
        var nb = teamsA.length;
        if (teamsB.length !== nb || scores.length !== nb || leagues.length !== nb || groups.length !== nb)
          return callback(new Error('The number are not matching in the scraper.'));
console.log('hours : ', hours, hours.length);
console.log('dates : ', dates, dates.length);
console.log('gamesByGroup : ', gamesByGroup);
        /**
         * Gather the result in a array of objects.
         */
        for (var i = 0; i < groups.length; i++) {
          var score = scores[i];
          if (leagues[i] === 'World Cup' && groupsWC.indexOf(groups[i]) > -1) {
            results.push({
                league : leagues[i]
              , group  : groups[i]
              , teams  : [teamsA[i], teamsB[i]]
              , score  : [score.substring(0,score.indexOf('-')-1), score.substring(score.indexOf('-')+2)]
              , date   : dates[i]
              , hour   : hours[i]
            });
          }
        };

        callback(null, results);

      });
    }

  };

};
