module.exports = function(app){
  var home = require('./home');
  var winston = require('winston');
  var log = require('./log');

  winston.debug('Routes init started');

  app.use('/', home);
  app.use('/logs', log.routes);

  app.use(log.console);
  app.use(log.xhr);
  app.use(log.showErrorPage);

  winston.debug('Routes init done');
};