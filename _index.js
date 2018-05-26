/**
 * Dependencies.
 */
var async = require('async');
var scoreScraper = require('./app/lib/scraper-group.js')();

/**
 * Variables.
 */
var groups = ['A', 'B', 'C', 'D', 'E', 'F'];
// var groups = ['A'];

// async.concatSeries(groups, scoreScraper.scrap, function(err, results) {
//   if (err) console.log('error : ', err);
//   console.log('results scraping : ', results, results.length);
// });

require('./app/lib/score-scraper')().scrap(function(e, results) {
  console.error('E : ', e);
  console.log('results : ', results);
});
