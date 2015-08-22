var winston = require('winston');

module.exports = function(app){

  app.use(_setUser);
  app.use(_setUsersOnline);

  function _setUser(req, res, next) {
    if (!!req.user) {
      res.locals.isLoggedIn = !req.user.anonymous;
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
