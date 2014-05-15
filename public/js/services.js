'use strict';

/* Services */

angular.module('wcbrazilApp.services', []).
  factory('socket', function (socketFactory) {
    return socketFactory();
  }).
  value('version', '0.1');
