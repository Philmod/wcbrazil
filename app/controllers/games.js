var fs = require('fs');

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

  return {

  };

};
