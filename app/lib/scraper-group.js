/**
 * Dependencies.
 */
var request = require('request');
var cheerio = require('cheerio');

module.exports = function (options) {

  /**
   * Constants.
   */
  var mainClass  = '.content';
  var row = '.row-gray';
  var dateClass = '.col-2';
  var hourClass = '.col-7 .col-2';
  var scoreClass = '.col-1 .tright'
  var teamsClass = '.col-7 .col-10 a';

  return {

    scrap: function(group, callback) {
      if (!group)
        return callback(null, {});
      var url = 'http://www.livescore.com/euro/' + 'group-' + group.toUpperCase();

      request(url, function(e, r, b) {
        if (e)
          return callback(e);

        b = b.replace(/<(\/?)script/g, '<$1nobreakage');

        $ = cheerio.load(b);

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
