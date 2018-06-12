'use strict';

/* Services */

angular.module('russia2018App.services', []).
  factory('socket', function (socketFactory) {
    return socketFactory({
      ioSocket: io(websocketHost, {path: websocketPath}),
    });
  }).
  value('version', '0.1');
