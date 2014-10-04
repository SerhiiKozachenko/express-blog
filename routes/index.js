var winston = require('winston');
var home = require('./home');
var log = require('./log');
var blog = require('./blog');

module.exports = function(app){
  
  winston.info('Routes init started');

  app.use('/', home);
  app.use('/logs', log.routes);
  app.use('/blog', blog);

  app.use(log.console);
  app.use(log.xhr);
  app.use(log.showErrorPage);

  winston.info('Routes init done');
};