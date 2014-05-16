module.exports = function(server) {
  var fs  = require('fs')
    , ext = '.js'
    , mongoose  = require('mongoose')
    , options   = { autoReconnect: true }
    , mongodb   = server.config.mongodb
    , auth = ''
    , db
    ;

  /**
   * Set up mongodb.
   */
  if(mongodb.user)
    auth = mongodb.user+":"+mongodb.pass+"@";

  var mongourl = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://' + auth + mongodb.host + ':' + (mongodb.port || 27017) + '/' + mongodb.database;
  
  db = mongoose.createConnection(mongourl, options, function (err, db2) {
    if (err) log.sub('MONGODB').error(err.message);
  });
  var eventHandler = db.db;

  eventHandler.on('open', function(err) {
    console.log('Mongoose connected.');
  }); 
  eventHandler.on('error', function(err) {
    log.sub('MONGODB').error(err);
  }); 
      
  server.set('db', db);


  /**
   * Models.
   */
  server.mongoose = require('mongoose');
   
  server.model = function(modelName) {
    return server.set('db').model(modelName);
  };

  var path = __dirname + '/../app/models';
  fs.readdirSync(path).forEach(function(filename) {
    if (!filename.match(ext + '$')) {
      return;
    }
    require(path + '/' + filename)(server);
  });

};
