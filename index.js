// http://www.livefyre.com/install/

/**
 * Dependencies.
 */
var async = require('async');
var scoreScraper = require('./lib/scraper-group.js')();

/**
 * Variables.
 */
var groups = [
    'A'
  , 'B'
  , 'C'
  , 'D'
  , 'E'
  , 'F'
  , 'G'
  , 'H'
];

async.concatSeries(groups, scoreScraper.scrap, function(err, results) {
  if (err) console.log('error : ', err);
  console.log('results scraping : ', results, results.length);
});
