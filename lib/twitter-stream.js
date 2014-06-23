/**
 * Listen to a twitter stream to get the score.
 *
 * Borrowed from https://github.com/xdamman/ReplayLastGoal.
 */

/**
 * Dependencies.
 */
var twitter = require('twitter')
  , humanize = require('humanize')
  , fs = require('fs')
  ;

/**
 * Constants.
 */
var TWITTER_USERNAME = "GoalFlash";

module.exports = function(server) {

  /**
   * Dependencies.
   */
  var Games = server.controllers.games;

  /**
   * Variables.
   */
  var twitterCreds = {
      consumer_key: process.env.WCBRAZIL_TWITTER_CONSUMER_KEY
    , consumer_secret: process.env.WCBRAZIL_TWITTER_CONSUMER_SECRET
    , access_token_key: process.env.WCBRAZIL_TWITTER_ACCESS_TOKEN_KEY
    , access_token_secret: process.env.WCBRAZIL_TWITTER_ACCESS_TOKEN_SECRET
  };
  var twit = new twitter(twitterCreds);
  var isConnected = true;

  /**
   * Map teams.
   */
  var mapTeam = function(team) {
    if (team === "Côte d'Ivoire")
      team = "Ivory Coast";
    if (team === "United States")
      team = "USA";

    return team;
  }

  /**
   * Analyze tweet to extract teams and score.
   */
  var analyzeTweet = function(tweet) {
    var text = tweet.text;
    var arr = /(\D*)\s.?(\d)\-(\d).?\s(\D*)\s\(/.exec(text);
    return {
        teams: [mapTeam(arr[1]), mapTeam(arr[4])]
      , score: [parseInt(arr[2]), parseInt(arr[3])]
    }
  }

  /**
   * TEMP.
   */
  // var tweets = JSON.parse(fs.readFileSync(__dirname + '/../test/mocks/GoalFlashTweets.json', 'utf-8'));
  // setTimeout(function() {
  //   var data = tweets[0];
  //   if(!data.text) return;       
  //   if(data.user.screen_name != TWITTER_USERNAME) return;
  //   console.log('GOOOOALLLL : ');
  //   console.log(humanize.date("Y-m-d H:i:s")+" DATA: ", data.text);
  //   isConnected = true;
  //   Games.newScore(analyzeTweet(data));
  // }, 3000);

  /**
   * Connect to the twitter stream.
   */
  var connectStream = function() {
    if (!twitterCreds.consumer_key) {
      console.error('There is no twitter credentials for the stream. Set them in env variables.');
      process.exit();
    }
    console.log(humanize.date("Y-m-d H:i:s")+" Connecting to the Twitter Stream for @"+TWITTER_USERNAME);
    twit.stream('user', {track:TWITTER_USERNAME}, function(stream) {
      console.log(humanize.date("Y-m-d H:i:s")+" Connected");
      stream.on('data', function(data) {
        if(!data.text) return;       
        if(data.user.screen_name != TWITTER_USERNAME) return;
        console.log('GOOOOALLLL : ');
        console.log(humanize.date("Y-m-d H:i:s")+" DATA: ", data.text);
        isConnected = true;
        Games.newScore(analyzeTweet(data));
      });

      stream.on('error', function(error) {
        console.error("Error in the twitter stream: ", error);
        isConnected = false;
        // process.exit(1);
      });

      stream.on('end', function() {
        console.error("Twitter stream ended - exiting.");
        isConnected = false;
        connectStream();
      });
    });
  }
  connectStream();

  /**
   * Public methods.
   */
  return {

    isConnected: function() {
      return isConnected;
    },

    // getTweets: function(options, callback) {
    //   if (typeof options === 'function') {
    //     callback = options;
    //     options = {};
    //   }

    // }

  }

}