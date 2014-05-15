'use strict';

/* Controllers */

angular.module('wcbrazilApp.controllers', [])
  .controller('AppCtrl', function ($scope, socket) {
    socket.on('message', function(data) {
      console.log('message : ', data);
    })
  })
  .controller('GamesCtrl', function ($scope, socket) {
    $scope.games = games;
    socket.on('games:update', function (data) {
      $scope.games = data;
    });
  })
  ;

