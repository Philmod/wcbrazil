'use strict';

/* Services */

angular.module('russia2018App.services', []).
  factory('socket', function (socketFactory) {
    return socketFactory({
      // TODO(philmod): set this link in the config.
      ioSocket: io.connect('/russia2018/socket.io');
    });
  }).
  value('version', '0.1');
