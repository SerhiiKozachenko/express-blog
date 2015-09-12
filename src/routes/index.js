var winston = require('winston');
var home = require('./home');
var log = require('./log');
var blog = require('./blog');
var auth = require('./auth');
var contact = require('./contact');

module.exports = function(app){

  winston.info('Routes init started');

  app.use('/auth', auth);
  app.use('/', home);
  app.use('/logs', log.routes);
  app.use('/contact', contact);
  app.use('/', blog);


  app.use(log.console);
  app.use(log.xhr);
  app.use(log.showErrorPage);

  winston.info('Routes init done');
};
