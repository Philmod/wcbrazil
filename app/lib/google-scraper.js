/**
 * Dependencies.
 */
const request = require('request');
const cheerio = require('cheerio');
const fakeUa = require('fake-useragent');

/**
 * Module.
 */
module.exports = function (options) {

  return {

    scrap: function(teamA, teamB, callback) {
      request({
        url: `https://www.google.com/search?q=${teamA}+vs+${teamB}`,
        headers: {
          'User-Agent': fakeUa()
        }
      }, function(e, r, b) {
        var statusCode = r && r.statusCode;
        if (e || statusCode != 200) {
          return callback(err)
        }

        $ = cheerio.load(b);
        callback(null, [$(".imso_mh__l-tm-sc").html(), $(".imso_mh__r-tm-sc").html()])
      });
    }

  }

};
