module.exports = function(server) {
  var fs  = require('fs')
    , mongoose  = require('mongoose')
    , options   = { autoReconnect: true }
    , mongodb   = server.config.mongodb
    , auth = ''
    , db
    ;

  /**
   * Set up mongodb.
   */
  if (mongodb.user)
    auth = mongodb.user+":"+mongodb.pass+"@";

  var mongourl = process.env.MONGODB_URI ||
    'mongodb://' + auth + mongodb.host + ':' + (mongodb.port || 27017) + '/' + mongodb.database;

  db = mongoose.createConnection(mongourl, options, function (err, db2) {
    if (err) console.error('MONGODB : ', err.message);
  });
  var eventHandler = db.db;

  eventHandler.on('open', function(err) {
    console.log('Mongoose connected.');
  });
  eventHandler.on('error', function(err) {
    console.error('MONGODB : ', err);
  });

  server.set('db', db);


  /**
   * Models.
   */
  server.mongoose = require('mongoose');

  var ms = {};
  var models = [
    'Game',
  ];

  server.model = (modelName) => {
    return server.set('db').model(modelName);
  };

  models.forEach(model => {
    ms[model] = require(`${__dirname}/${model.toLowerCase()}`)(server);
  });

  return ms;

};
