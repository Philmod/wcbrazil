var fs = require('fs')
  , async = require('async')
  , scoreScraper = require('../../lib/scraper-group.js')()
  ;

module.exports = function(server) {

  var Game = server.model('Game')
    , _    = server.utils._
    ;
  
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

    function random (low, high) {
      return Math.round( Math.random() * (high - low) + low );
    }
    function randomBool () {
      return !! Math.round(Math.random() * 1);
    }
    var results = _.map(games, function(g) {
      // Random changes.
      if (randomBool()) {
        g.score[0] = (randomBool()) ? random(0,5) : 0;
        g.score[1] = (randomBool()) ? random(0,5) : 0;
      }
      return g;
    });

    console.log('games scraped : ', results);

    Game.updateScores(results);
    
    // async.concatSeries(server.config.scraping.groups, scoreScraper.scrap, function(err, results) {
    //   if (err) console.log('error : ', err);
    //   console.log('results scraping : ', results, results.length);
    //   // Check if score changed.

    //   // If changed : 
    //   //   1. Update DB
    //   //   2. Broadcast to connected people
    //   //   3. Recalculate bets (+ broadcast)

    // });
    
  }, server.config.scraping.dt);

  /**
   * Public methods.
   */
  return {

  };

};

// TEMP (not to scrape for testing)
var games = [ 
  { group: 'A',
    teams: [ 'Brazil', 'Croatia' ],
    score: [ ' ?', '? ' ],
    date: ' June 12 ',
    hour: '20:00' },
  { group: 'A',
    teams: [ 'Mexico', 'Cameroon' ],
    score: [ ' ?', '? ' ],
    date: ' June 13 ',
    hour: '16:00' },
  { group: 'A',
    teams: [ 'Brazil', 'Mexico' ],
    score: [ ' ?', '? ' ],
    date: ' June 17 ',
    hour: '19:00' },
  { group: 'A',
    teams: [ 'Cameroon', 'Croatia' ],
    score: [ ' ?', '? ' ],
    date: ' June 18 ',
    hour: '22:00' },
  { group: 'A',
    teams: [ 'Cameroon', 'Brazil' ],
    score: [ ' ?', '? ' ],
    date: ' June 23 ',
    hour: '20:00' },
  { group: 'A',
    teams: [ 'Croatia', 'Mexico' ],
    score: [ ' ?', '? ' ],
    date: ' June 23 ',
    hour: '20:00' },
  { group: 'B',
    teams: [ 'Spain', 'Netherlands' ],
    score: [ ' ?', '? ' ],
    date: ' June 13 ',
    hour: '19:00' },
  { group: 'B',
    teams: [ 'Chile', 'Australia' ],
    score: [ ' ?', '? ' ],
    date: ' June 13 ',
    hour: '22:00' },
  { group: 'B',
    teams: [ 'Australia', 'Netherlands' ],
    score: [ ' ?', '? ' ],
    date: ' June 18 ',
    hour: '16:00' },
  { group: 'B',
    teams: [ 'Spain', 'Chile' ],
    score: [ ' ?', '? ' ],
    date: ' June 18 ',
    hour: '19:00' },
  { group: 'B',
    teams: [ 'Australia', 'Spain' ],
    score: [ ' ?', '? ' ],
    date: ' June 23 ',
    hour: '16:00' },
  { group: 'B',
    teams: [ 'Netherlands', 'Chile' ],
    score: [ ' ?', '? ' ],
    date: ' June 23 ',
    hour: '16:00' },
  { group: 'C',
    teams: [ 'Colombia', 'Greece' ],
    score: [ ' ?', '? ' ],
    date: ' June 14 ',
    hour: '16:00' },
  { group: 'C',
    teams: [ 'Ivory Coast', 'Japan' ],
    score: [ ' ?', '? ' ],
    date: ' June 15 ',
    hour: '01:00' },
  { group: 'C',
    teams: [ 'Colombia', 'Ivory Coast' ],
    score: [ ' ?', '? ' ],
    date: ' June 19 ',
    hour: '16:00' },
  { group: 'C',
    teams: [ 'Japan', 'Greece' ],
    score: [ ' ?', '? ' ],
    date: ' June 19 ',
    hour: '22:00' },
  { group: 'C',
    teams: [ 'Greece', 'Ivory Coast' ],
    score: [ ' ?', '? ' ],
    date: ' June 24 ',
    hour: '20:00' },
  { group: 'C',
    teams: [ 'Japan', 'Colombia' ],
    score: [ ' ?', '? ' ],
    date: ' June 24 ',
    hour: '20:00' },
  { group: 'D',
    teams: [ 'Uruguay', 'Costa Rica' ],
    score: [ ' ?', '? ' ],
    date: ' June 14 ',
    hour: '19:00' },
  { group: 'D',
    teams: [ 'England', 'Italy' ],
    score: [ ' ?', '? ' ],
    date: ' June 14 ',
    hour: '22:00' },
  { group: 'D',
    teams: [ 'Uruguay', 'England' ],
    score: [ ' ?', '? ' ],
    date: ' June 19 ',
    hour: '19:00' },
  { group: 'D',
    teams: [ 'Italy', 'Costa Rica' ],
    score: [ ' ?', '? ' ],
    date: ' June 20 ',
    hour: '16:00' },
  { group: 'D',
    teams: [ 'Costa Rica', 'England' ],
    score: [ ' ?', '? ' ],
    date: ' June 24 ',
    hour: '16:00' },
  { group: 'D',
    teams: [ 'Italy', 'Uruguay' ],
    score: [ ' ?', '? ' ],
    date: ' June 24 ',
    hour: '16:00' },
  { group: 'E',
    teams: [ 'Switzerland', 'Ecuador' ],
    score: [ ' ?', '? ' ],
    date: ' June 15 ',
    hour: '16:00' },
  { group: 'E',
    teams: [ 'France', 'Honduras' ],
    score: [ ' ?', '? ' ],
    date: ' June 15 ',
    hour: '19:00' },
  { group: 'E',
    teams: [ 'Switzerland', 'France' ],
    score: [ ' ?', '? ' ],
    date: ' June 20 ',
    hour: '19:00' },
  { group: 'E',
    teams: [ 'Honduras', 'Ecuador' ],
    score: [ ' ?', '? ' ],
    date: ' June 20 ',
    hour: '22:00' },
  { group: 'E',
    teams: [ 'Ecuador', 'France' ],
    score: [ ' ?', '? ' ],
    date: ' June 25 ',
    hour: '20:00' },
  { group: 'E',
    teams: [ 'Honduras', 'Switzerland' ],
    score: [ ' ?', '? ' ],
    date: ' June 25 ',
    hour: '20:00' },
  { group: 'F',
    teams: [ 'Argentina', 'Bosnia-Herzegovina' ],
    score: [ ' ?', '? ' ],
    date: ' June 15 ',
    hour: '22:00' },
  { group: 'F',
    teams: [ 'Iran', 'Nigeria' ],
    score: [ ' ?', '? ' ],
    date: ' June 16 ',
    hour: '19:00' },
  { group: 'F',
    teams: [ 'Argentina', 'Iran' ],
    score: [ ' ?', '? ' ],
    date: ' June 21 ',
    hour: '16:00' },
  { group: 'F',
    teams: [ 'Nigeria', 'Bosnia-Herzegovina' ],
    score: [ ' ?', '? ' ],
    date: ' June 21 ',
    hour: '22:00' },
  { group: 'F',
    teams: [ 'Bosnia-Herzegovina', 'Iran' ],
    score: [ ' ?', '? ' ],
    date: ' June 25 ',
    hour: '16:00' },
  { group: 'F',
    teams: [ 'Nigeria', 'Argentina' ],
    score: [ ' ?', '? ' ],
    date: ' June 25 ',
    hour: '16:00' },
  { group: 'G',
    teams: [ 'Germany', 'Portugal' ],
    score: [ ' ?', '? ' ],
    date: ' June 16 ',
    hour: '16:00' },
  { group: 'G',
    teams: [ 'Ghana', 'USA' ],
    score: [ ' ?', '? ' ],
    date: ' June 16 ',
    hour: '22:00' },
  { group: 'G',
    teams: [ 'Germany', 'Ghana' ],
    score: [ ' ?', '? ' ],
    date: ' June 21 ',
    hour: '19:00' },
  { group: 'G',
    teams: [ 'USA', 'Portugal' ],
    score: [ ' ?', '? ' ],
    date: ' June 22 ',
    hour: '22:00' },
  { group: 'G',
    teams: [ 'Portugal', 'Ghana' ],
    score: [ ' ?', '? ' ],
    date: ' June 26 ',
    hour: '16:00' },
  { group: 'G',
    teams: [ 'USA', 'Germany' ],
    score: [ ' ?', '? ' ],
    date: ' June 26 ',
    hour: '16:00' },
  { group: 'H',
    teams: [ 'Belgium', 'Algeria' ],
    score: [ ' ?', '? ' ],
    date: ' June 17 ',
    hour: '16:00' },
  { group: 'H',
    teams: [ 'Russia', 'South Korea' ],
    score: [ ' ?', '? ' ],
    date: ' June 17 ',
    hour: '22:00' },
  { group: 'H',
    teams: [ 'Belgium', 'Russia' ],
    score: [ ' ?', '? ' ],
    date: ' June 22 ',
    hour: '16:00' },
  { group: 'H',
    teams: [ 'South Korea', 'Algeria' ],
    score: [ ' 0', '3 ' ],
    date: ' June 22 ',
    hour: '19:00' },
  { group: 'H',
    teams: [ 'Algeria', 'Russia' ],
    score: [ ' ?', '? ' ],
    date: ' June 26 ',
    hour: '20:00' },
  { group: 'H',
    teams: [ 'South Korea', 'Belgium' ],
    score: [ ' ?', '? ' ],
    date: ' June 26 ',
    hour: '20:00' } 
];
