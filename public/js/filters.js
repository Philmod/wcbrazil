'use strict';

angular.module('russia2018App.filters', [])
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
  .filter('removeSign', function() {
    return function(nb) {
      var str = '' + nb;
      if (str[0] === '-')
        str = str.substring(1);
      if (str === '0')
        str = '-';
      return str;
    };
  })
  ;
