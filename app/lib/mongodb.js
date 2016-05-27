var defaults = {
  host     : 'localhost',
  database : 'france2016_localhost'
};

exports.test = {
  host     : 'localhost',
  database : 'france2016_test'
};

exports.production  = defaults;

exports.development = defaults;
exports.preview     = exports.production;
