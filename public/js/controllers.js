'use strict';

/* Controllers */

angular.module('wcbrazilApp.controllers', [])
  .controller('AppCtrl', function ($scope, socket) {
    
  })
  .controller('GamesCtrl', function ($scope, socket) {
    // Store games.
    $scope.games = games;
    // Update initial scores.
    loadGamesScores(games);
    // Listen to a socket.
    socket.on('games:update', function (data) {
      $scope.games = data;
      loadGamesScores(data);
    });
  })
  .controller('BetsCtrl', function ($scope, socket) {
    $scope.bets = bets;
    socket.on('bets:update', function (data) {
      $scope.bets = data;
    });
  })
  ;

var loadGamesScores = function(games) {
  setTimeout(function() {
    for (var i = 0; i<games.length; i++) {
      var game = games[i];
      var element = (game.teams[0] + game.teams[1]).replace(/\s+/g, '');
      flipTo('.' + element + '0', game.score[0]);
      flipTo('.' + element + '1', game.score[1]);
    };
  }, 0);
}

var flipTo = function(element, until) {
  var nb = parseInt($(element + ' .active a .up .inn').text()) || 0;
  var nbFlips = until - nb;
  if (nbFlips < 0)
    nbFlips = 10 - nbFlips;
  for (var i = 0; i<nbFlips; i++)
    flip(element);
}

var flip = function(element) {
    // $("#flip").removeClass("play");
    var aa = $("ul" + element + " li.active");

    if (aa.html() == undefined) {
        aa = $("ul" + element + " li").eq(0);
        aa.addClass("before")
            .removeClass("active")
            .next("li")
            .addClass("active")
            .closest("#flip")
            .addClass("play");

    }
    else if (aa.is(":last-child")) {
        $("ul" + element + " li").removeClass("before");
        aa.addClass("before").removeClass("active");
        aa = $("ul" + element + " li").eq(0);
        aa.addClass("active")
            .closest("#flip")
            .addClass("play");
    }
    else {
        $("ul" + element + " li").removeClass("before");
        aa.addClass("before")
            .removeClass("active")
            .next("li")
            .addClass("active")
            .closest("#flip")
            .addClass("play");
    }

}

