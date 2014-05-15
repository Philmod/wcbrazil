'use strict';

/* Controllers */

angular.module('wcbrazilApp.controllers', [])
  .controller('AppCtrl', function ($scope, socket) {
    // 
  })
  .controller('GamesCtrl', function ($scope, socket) {
    $scope.games = games;
    socket.on('games', function (data) {
      $scope.games = data;
    });
  })
  ;

