var logger = require('./logger');
var mongoose = require('mongoose');

module.exports = function(onDbConnected){
  logger.info('Connecting to blog db');
  var conn = mongoose.connect('mongodb://localhost/blog', function(err){
  	if (err){
      logger.error('Connection failed to blog db');
  	} else {
      logger.info('Connected to blog db');
      onDbConnected();
  	}
  });

  mongoose.connection.on('error', function(err){
    logger.error('DB ERROR: '+err);
  });
};
