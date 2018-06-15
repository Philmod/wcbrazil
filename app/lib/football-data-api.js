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
 * Parse JSON.
 */
var parseJSON = function(json) {
  var out = {};
  if (!json || (typeof json === 'undefined')) return out;
  try {
    out = JSON.parse(json);
  } catch(e) {
    // console.error('Error parsing JSON: ', e, json);
    out = json;
  }
  return out;
};

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
        let info = parseJSON(body);
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

    gameScore: (link, callback) => {
      let options = {
        url: link,
        headers: {
          'X-Auth-Token': process.env.FOOTBALLDATA_TOKEN,
        }
      }

      request(options, (err, res, body) => {
        if (err || res.statusCode !== 200) {
          return callback(err || new Error("Error. Got status code " + res.statusCode))
        }
        let info = parseJSON(body);
        let result = info.fixture.result;
        // console.log('Result from API:', result)
        return callback(null, {
            teams  : [info.fixture.homeTeamName, info.fixture.awayTeamName]
          , score  : [result.goalsHomeTeam || 0, result.goalsAwayTeam || 0]
          , scoreExtraTime : ( result.extraTime && [result.extraTime.goalsHomeTeam, result.extraTime.goalsAwayTeam] ) || null
          , scorePenalty : ( result.penaltyShootout && [result.penaltyShootout.goalsHomeTeam, result.penaltyShootout.goalsAwayTeam] ) || null
        })
      });
    },

  }

}
