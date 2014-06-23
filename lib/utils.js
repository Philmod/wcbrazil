/** 
 * Dependencies.
 */
var _ = require('underscore')
  , moment = require('moment-timezone')
  , fs = require('fs')
  ;

/**
 * Additional underscore functions. 
 *
 * [https://gist.github.com/ElliotChong/3861963]
 */
(function() {
  var arrays, basicObjects, deepClone, deepExtend, deepExtendCouple, isBasicObject,
    __slice = [].slice;
 
  deepClone = function(obj) {
    var func, isArr;
    if (!_.isObject(obj) || _.isFunction(obj)) {
      return obj;
    }
    if (_.isDate(obj)) {
      return new Date(obj.getTime());
    }
    if (_.isRegExp(obj)) {
      return new RegExp(obj.source, obj.toString().replace(/.*\//, ""));
    }
    isArr = _.isArray(obj || _.isArguments(obj));
    func = function(memo, value, key) {
      if (isArr) {
        memo.push(deepClone(value));
      } else {
        memo[key] = deepClone(value);
      }
      return memo;
    };
    return _.reduce(obj, func, isArr ? [] : {});
  };
 
  isBasicObject = function(object) {
    return (object.prototype === {}.prototype || object.prototype === Object.prototype) && _.isObject(object) && !_.isArray(object) && !_.isFunction(object) && !_.isDate(object) && !_.isRegExp(object) && !_.isArguments(object);
  };
 
  basicObjects = function(object) {
    return _.filter(_.keys(object), function(key) {
      return isBasicObject(object[key]);
    });
  };
 
  arrays = function(object) {
    return _.filter(_.keys(object), function(key) {
      return _.isArray(object[key]);
    });
  };
 
  deepExtendCouple = function(destination, source, maxDepth) {
    var combine, recurse, sharedArrayKey, sharedArrayKeys, sharedObjectKey, sharedObjectKeys, _i, _j, _len, _len1;
    if (maxDepth == null) {
      maxDepth = 20;
    }
    if (maxDepth <= 0) {
      console.warn('_.deepExtend(): Maximum depth of recursion hit.');
      return _.extend(destination, source);
    }
    sharedObjectKeys = _.intersection(basicObjects(destination), basicObjects(source));
    recurse = function(key) {
      return source[key] = deepExtendCouple(destination[key], source[key], maxDepth - 1);
    };
    for (_i = 0, _len = sharedObjectKeys.length; _i < _len; _i++) {
      sharedObjectKey = sharedObjectKeys[_i];
      recurse(sharedObjectKey);
    }
    sharedArrayKeys = _.intersection(arrays(destination), arrays(source));
    combine = function(key) {
      return source[key] = _.union(destination[key], source[key]);
    };
    for (_j = 0, _len1 = sharedArrayKeys.length; _j < _len1; _j++) {
      sharedArrayKey = sharedArrayKeys[_j];
      combine(sharedArrayKey);
    }
    return _.extend(destination, source);
  };
 
  deepExtend = function() {
    var finalObj, maxDepth, objects, _i;
    objects = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), maxDepth = arguments[_i++];
    if (!_.isNumber(maxDepth)) {
      objects.push(maxDepth);
      maxDepth = 20;
    }
    if (objects.length <= 1) {
      return objects[0];
    }
    if (maxDepth <= 0) {
      return _.extend.apply(this, objects);
    }
    finalObj = objects.shift();
    while (objects.length > 0) {
      finalObj = deepExtendCouple(finalObj, deepClone(objects.shift()), maxDepth);
    }
    return finalObj;
  };
 
  _.mixin({
    deepClone: deepClone,
    isBasicObject: isBasicObject,
    basicObjects: basicObjects,
    arrays: arrays,
    deepExtend: deepExtend
  });
 
}).call(this);

/**
 * Parse JSON.
 */
var parseJSON = function(json) {
  var out = {};
  if (!json || (typeof json === 'undefined')) return out;
  try {
    out = JSON.parse(json);
  } catch(e) {
    // console.error('Error parsing JSON: ', e, json);
    out = json;
  }
  return out;
};

/**
 * Expose methods.
 */
module.exports = {

  /**
   * Underscore.
   */
  _: _,

  /**
   * Parse JSON.
   */
  parseJSON: parseJSON,

  /**
   * Is the same day.
   */
  isSameDay: function(d1, d2) {
    d1 = new Date(d1).setHours(0, 0, 0, 0);
    d2 = new Date(d2).setHours(0, 0, 0, 0);
    return d1 === d2;
  },

  getDate: function() {
    return moment.tz("2014-06-28 10:00:00", "America/Fortaleza").format();
    // return new Date();
  },

  loadJSON: function(path) {
    var content;
    try {
      content = JSON.parse(fs.readFileSync(path, 'utf8'));
    }
    catch(e) {
      // console.log('Error loading the file : ', e);
    }
    return content;
  }

};
