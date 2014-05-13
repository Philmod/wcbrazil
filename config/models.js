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

  var mongourl = 'mongodb://' + auth + mongodb.host + ':' + (mongodb.port || 27017) + '/' + mongodb.database;
  
  if(mongodb.replicaSet) {
    for(var i=0, len = mongodb.replicaSet.length; i<len; i++) {
       var replica = mongodb.replicaSet[i];
       var replica_url = 'mongodb://' + auth + replica.host + ':' + (replica.port || 27017) + '/' + replica.database;
       mongourl += ','+replica_url;
    }
  }

  if (mongourl.indexOf(',') != -1) {
    db = mongoose.connectSet(mongourl, options);
    var eventHandler = db.connection;
  } else {
    db = mongoose.createConnection(mongourl, options, function (err, db2) {
      if (err) log.sub('MONGODB').error(err.message);
    });
    var eventHandler = db.db;
  }
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