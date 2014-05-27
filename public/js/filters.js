'use strict';

angular.module('wcbrazilApp.filters', [])
  .filter('hours', function (version) {
    return function (date) {
      return new Date(date).getHours();
    }
  })
  .filter('minutes', function (version) {
    return function (date) {
      var minutes = new Date(date).getMinutes();
      if (minutes === 0)
        minutes = '00';
      return minutes
    }
  })
  .filter('removeSpace', function() {
    return function(str) {
      return str.replace(/\s+/g, '');
    };
  })
  ;
