'use strict';

/* Controllers */

angular.module('wcbrazilApp.controllers', [])
  .controller('AppCtrl', function ($scope, socket) {
    // socket.on('send:time', function (data) {
    //   // console.log('data : ', data);
    // });
  })
  .controller('GamesCtrl', function ($scope, socket) {
    $scope.games = games;
  });

