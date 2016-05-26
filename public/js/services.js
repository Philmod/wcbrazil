'use strict';

/* Services */

angular.module('france2016App.services', []).
  factory('socket', function (socketFactory) {
    return socketFactory();
  }).
  value('version', '0.1');
