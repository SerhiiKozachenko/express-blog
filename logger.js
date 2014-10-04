var winston = require('winston');
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  level: 'debug',
  timestamp: true,
  colorize: true,
});
winston.add(winston.transports.File, {
  name: 'file.errors',
  filename: 'logs/errors.log',
  handleExceptions: true,
  level: 'error',
  json: true,
});
winston.add(winston.transports.File, {
  name: 'file.common',
  filename: 'logs/common.log',
  handleExceptions: false,
  level: 'info',
  json: true,
});
winston.exitOnError = false;

var logProxied = winston.log;
winston.log = function(){
  arguments[1] = '[Worker # '+process.pid+']: ' + arguments[1];
  logProxied.apply(this, arguments);
};

module.exports = winston;