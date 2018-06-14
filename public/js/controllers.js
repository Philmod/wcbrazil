'use strict';

/* Controllers */

angular.module('russia2018App.controllers', ['chart.js'])
  .config(['ChartJsProvider', function (ChartJsProvider) {
    ChartJsProvider.setOptions({
      chartColors: [ '#4d5360', '#dcdcdc', '#BE131A'],
      responsive: false,
    });
  }])

  .controller('AppCtrl', function ($scope, socket) {
    // Check if ie8.
    if (get_browser() === 'MSIE' && get_browser_version() === '8') {
      var root = document.documentElement;
      root.className += " ie8";
    }
    // Socket.io
    var disconnected = false;
    socket.on('socket:refresh', function (data) {
      console.log('socket refreshed.');
    });
    socket.on('connect', function() {
      $scope.closeAlert();
      if (disconnected) {
        showAlert('alert-success', 'Connected to the server.');
        socket.emit('games:get');
        socket.emit('bets:get');
        setTimeout(function() {
          $scope.closeAlert();
          disconnected = false;
        }, 500);
      }
    });
    socket.on('disconnect', function() {
      if (!refreshing)
        showAlert('alert-danger', 'You have been disconnected of the server. Refresh if this message doesn\'t disappear');
      disconnected = true;
      // socket.reconnect();
    });
    socket.on('connect_failed', function() {
      showAlert('alert-danger', 'The browser cannot connect to the realtime server. Refresh or contact the webmaster.');
    });
    socket.on('error', function(e) {
      console.log('socket error : ', e);
    });
    socket.on('reconnect_failed', function() {
      showAlert('alert-danger', 'The browser cannot reconnect to the realtime server. Refresh or contact the webmaster.');
      disconnected = true;
    });
    // Alerts.
    $scope.mainAlert = {
      isShown: false
    };
    function showAlert(alertType, message) {
      $scope.mainAlert.message = message;
      $scope.mainAlert.isShown = true;
      $scope.mainAlert.alertType = alertType;
    }
    $scope.closeAlert = function() {
      $scope.mainAlert.isShown = false;
    };
    // Catch refresh.
    var refreshing = false;
    window.onbeforeunload = function() {
      refreshing = true;
    }

    /**
     * Set up pie charts.
     */
    var labels = [];
    var choices = [];
    var betChoices = {};
    var nbGames = 0;
    if (bets && bets[0]) {
      nbGames = bets[0].bets.length;
    }
    bets.forEach(function(b) { 
      for (var i = 0; i < nbGames; i++) {
        var choice = b.bets[i].toUpperCase(); // !!!
        if (!betChoices[i]) {
          betChoices[i] = {};
          choices[i] = [];
          labels[i] = [];
        }
        if (!betChoices[i][choice]) {
          betChoices[i][choice] = 0;
        }
        betChoices[i][choice] += 1;
      }
    });
    for (var gameIndex in betChoices) {
      for (var key in betChoices[gameIndex]) {
        if (betChoices[gameIndex].hasOwnProperty(key)) {
          if (key != "X") {
            labels[gameIndex].push( games[gameIndex].teams[parseInt(key)-1] );
          } else {
            labels[gameIndex].push(key);
          }
          choices[gameIndex].push(betChoices[gameIndex][key]);
        }
      }
    }
    $scope.labels = labels;
    $scope.choices = choices;

  })

  .controller('GamesCtrl', function ($scope, socket) {
    // Store games.
    $scope.games = games;
    // Update initial scores.
    loadGamesScores(games);
    // Listen to a socket.
    socket.on('games:update', function (data) {
      console.log('games:update : ', data);
      $scope.games = data;
      loadGamesScores(data);
    });
  })

  .controller('BetsCtrl', function ($scope, socket) {
    $scope.bets = bets;
    socket.on('bets:update', function (data) {
      console.log('bets:update : ', data);
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

function get_browser(){
  var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if(/trident/i.test(M[1])){
      tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE '+(tem[1]||'');
      }
  if(M[1]==='Chrome'){
      tem=ua.match(/\bOPR\/(\d+)/)
      if(tem!=null)   {return 'Opera '+tem[1];}
      }
  M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
  return M[0];
}

function get_browser_version(){
  var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if(/trident/i.test(M[1])){
      tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE '+(tem[1]||'');
      }
  if(M[1]==='Chrome'){
      tem=ua.match(/\bOPR\/(\d+)/)
      if(tem!=null)   {return 'Opera '+tem[1];}
      }
  M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
  return M[1];
}
