const filename = require('path').join(__dirname, 'games.txt');
const moment = require('moment-timezone');

var games = [];

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(filename)
});

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

lineReader
  .on('line', function (line) {
    var arr = /(\w*)\s(.*),\s?(\d\d\.\d\d)\s?\((.*)\)\s?:\s?(.*)\sVS\s(.*)\s?–\s?(Group|Match)\s(\w)/.exec(line);
    if (!arr) {
      console.log('line : ', line, arr);
    }
    var game = {
      group: arr[8],
      teams: [arr[5].trim(), arr[6].trim()],
      score: [],
      time: new Date(Date.UTC(2016, months.indexOf(arr[2].split(' ')[1]), parseInt(arr[2].split(' ')[0]), (parseInt(arr[3].split('.')[0])-2), parseInt(arr[3].split('.')[1]), 0)),
      venue: arr[4]
    };
    games.push(game);
  })
  .on('close', function() {
    setTimeout(function() {
        console.log('games : ', JSON.stringify(games));
    }, 3000);
  });
