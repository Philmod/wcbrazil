var defaults = {
  host     : 'localhost',
  database : 'russia2018_localhost'
};

exports.test = {
  host     : 'localhost',
  database : 'russia2018_test'
};

exports.production  = defaults;

exports.development = defaults;
exports.preview     = exports.production;
