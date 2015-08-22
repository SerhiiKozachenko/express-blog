var winston = require('winston');
var moment = require('moment');

var ADMIN_EMAIL = 'wbserg@gmail.com';

module.exports = function(app){

  app.use(_setUser);
  app.use(_setUsersOnline);
  app.use(_setMoment);

  function _setUser(req, res, next) {
    if (!!req.user) {
      res.locals.isLoggedIn = !req.user.anonymous;
      res.locals.isAdmin = req.user.email === ADMIN_EMAIL;
      req.user.isAdmin = res.locals.isAdmin;
      res.locals.userName = req.user.name;
      //winston.debug('User: ' + JSON.stringify(req.user));
    }

    next();
  };

  function _setUsersOnline(req, res, next) {
    if (!!req.online) {
      res.locals.online = req.online.length;
    }

    next();
  };

  function _setMoment(req, res, next) {
    res.locals.moment = moment;
    next();
  };

};
