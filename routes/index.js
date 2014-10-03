module.exports = function(app){
  var home = require('./home');
  var log = require('./log');

  console.log('routes init started');

  app.get('/', home.index);

  app.use(log.logConsole);
  app.use(log.logXhr);
  app.use(log.showErrorPage);
};