var defaults = {
  host     : 'localhost',
  database : 'wcbrazil_localhost'
};

exports.test = {
  host     : 'localhost',
  database : 'wcbrazil_test'
};

exports.production  = defaults;

exports.development = defaults;
exports.preview     = exports.production;
