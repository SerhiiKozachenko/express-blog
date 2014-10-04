var express = require('express');
var app = express();
var redis = require('redis');
var cache = redis.createClient();
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  level: 'debug',
  timestamp: true,
  colorize: true
});
winston.add(winston.transports.File, {
  name: 'file.errors',
  filename: 'logs/errors.log',
  handleExceptions: true,
  level: 'error',
  json: true
});
winston.add(winston.transports.File, {
  name: 'file.common',
  filename: 'logs/common.log',
  handleExceptions: false,
  level: 'info',
  json: true
});
winston.exitOnError = false;

process.on('uncaughtException', function (err) {
  winston.error(err.stack);
});

app.set('views', './views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

var winstonStream = {
    write: function(message, encoding){
        winston.info(message);
    }
};
app.use(require('morgan')({ "stream": winstonStream}));

app.use(session({
	store: new RedisStore(),
	secret: 'supersecretpasswordX',
	resave: false,
	saveUninitialized: false
}));

app.use(function(req, res, next){
  var ua = req.headers['user-agent'];
  cache.zadd('online', Date.now(), ua, next);
});

app.use(function(req, res, next){
  var min = 60 * 1000;
  var ago = Date.now() - min;
  cache.zrevrangebyscore('online', '+inf', ago, function(err, users){
    if (err) return next(err);
    req.online = users;
    next();
  });
});

require('./routes')(app);

var server = app.listen(3000, function(){
  winston.info('Listening on port %d', server.address().port);
});