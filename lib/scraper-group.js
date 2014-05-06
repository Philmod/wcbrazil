/**
 * Dependencies.
 */
var scraper = require('scraper');

module.exports = function (options) {

  /**
   * Constants.
   */
  var mainClass  = '.league-wc.fixtures';
  var row = 'tr';
  var dateClass = '.dt';
  var hourClass = '.tm';
  var scoreClass = '.sc';
  var teamsClass = 'a';

  return {

    scrap: function(group, callback) {
      var url = 'http://www.livescore.com/worldcup/' + 'group-' + group.toUpperCase();

      scraper(url, function(err, $) {
        if (err)
          return callback(err);

        /**
         * Variables.
         */
        var scores = [];
        var dates = [];
        var hours = [];
        var results = [];
        var teams = [];

        /**
         * Extract data.
         */
        $(mainClass + ' ' + row + ' ' + dateClass).each(function() {
          dates.push($(this).html());
        });
        $(mainClass + ' ' + row + ' ' + hourClass).each(function() {
          hours.push($(this).html());
        });
        $(mainClass + ' ' + row + ' ' + scoreClass).each(function() {
          scores.push($(this).html());
        });
        $(mainClass + ' ' + row + ' ' + teamsClass).each(function() {
          var html = $(this).html();
          var t = [];
          t.push(html.substring(0,html.indexOf('vs')-1));
          t.push(html.substring(html.indexOf('vs')+3))
          teams.push(t);
        });

        /**
         * Gather the result in a array of objects.
         */
        for (var i = 0; i < scores.length; i++) {
          var score = scores[i];
          results.push({
              group  : group
            , teams  : teams[i]
            , score  : [score.substring(0,score.indexOf('-')-1), score.substring(score.indexOf('-')+2)]
            , date   : dates[i]
            , hour   : hours[i]
          });
        };

        callback(null, results);

      });
    }

  };

};
