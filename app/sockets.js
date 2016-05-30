
var express = require('express')
  , redis = require('redis')
  ;

module.exports = function(server) {

  var Game = server.model('Game')
    , utils = server.utils;

  /**
   * Basic callbacks.
   */
  server.io.on('connection', function(socket) {
    console.log('Socket.io connection : ', socket.id);

    var refreshInterval = setInterval(function() {
      socket.emit('socket:refresh', {});
    }, 5*1000);

    socket.on('games:get', function() {
      Game.findByDate(utils.getDate(), function(e, games) {
        if (!e && games) socket.emit('games:update', games);
      });
    });
    socket.on('bets:get', function() {
      Game.getBetsPoints(utils.getDate(), function(e, bets) {
        if (!e && bets) socket.emit('bets:update', bets);
      });
    });

    socket.on('disconnect', function() {
      clearInterval(refreshInterval);
    });
  });

};
