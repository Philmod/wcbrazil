/**
 * Dependencies.
 */
const request = require('request');

/**
 * Constants.
 */
const BASE_URL = 'https://api.football-data.org/v1';
const COMPETITION_ID = 467;

/**
 * Module.
 */
module.exports = function (options) {

  return {

    games: (callback) => {
      let options = {
        url: BASE_URL + '/competitions/' + COMPETITION_ID + '/fixtures',
        headers: {
          'X-Auth-Token': process.env.FOOTBALLDATA_TOKEN,
        }
      }

      request(options, (err, res, body) => {
        if (err || res.statusCode !== 200) {
          return callback(err || new Error("Error. Got status code " + res.statusCode))
        }      
        let info = JSON.parse(body);
        let games = [];
        console.log('%d games', info.fixtures.length)
        info.fixtures.forEach(game => {
          if (!game.homeTeamName || !game.awayTeamName) {
            return
          }
          games.push({
            time: new Date(game.date),
            teams: [game.homeTeamName, game.awayTeamName],
            link: game._links.self.href,
          })
        })
        return callback(null, games)
      });
    },

  }

}
