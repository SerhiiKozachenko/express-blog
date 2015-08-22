var winston = require('winston');

//var ADMIN_USERNAME = 'serg';

module.exports = function(app){

  app.use(_setUser);
  app.use(_setUsersOnline);

  function _setUser(req, res, next) {
    if (!!req.user) {
      res.locals.isLoggedIn = !req.user.anonymous;
      //res.locals.isAdmin = req.user.name === ADMIN_USERNAME;
      res.locals.userName = req.user.name;
    }

    next();
  };

  function _setUsersOnline(req, res, next) {
    if (!!req.online) {
      res.locals.online = req.online.length;
    }

    next();
  };

};
