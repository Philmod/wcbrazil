var fs = require('fs')
  , async = require('async')
  , scoreScraper = require('../../lib/scraper-group.js')()
  ;

module.exports = function(server) {

  var Game = server.model('Game');
  
  /**
   * First import.
   */
  // var games = fs.readFileSync('./db/games.json').toString();
  // games = JSON.parse(games);
  // games.forEach(function(g) {
  //   var game = new Game(g);
  //   game.save(function(e) {
  //     console.log('e : ', e);
  //   })
  // });

  /**
   * Scrap scores.
   */
  var scoreScraping = setInterval(function() {
    console.log('Start scraping scores, at ', new Date());
    async.concatSeries(server.config.scraping.groups, scoreScraper.scrap, function(err, results) {
      if (err) console.log('error : ', err);
      console.log('results scraping : ', results, results.length);
      // Check if score changed.

      // If changed : 
      //   1. Update DB
      //   2. Broadcast to connected people
      //   3. Recalculate bets (+ broadcast)

    });
  }, server.config.scraping.dt);

  /**
   * Public methods.
   */
  return {

  };

};
