var express = require('express');
var router = express.Router();
var winston = require('winston');

var logQuery = {
    from:   new Date - 24 * 60 * 60 * 1000,
    until:  new Date,
    limit:  50,
    start:  0,
    order:  'asc',
    fields: ['message']
};

router.get('/', function(req, res){
  winston.query(logQuery, function (err, result) {
    if (err) {
      res.render('error500', {error: err.stack});
    } else{
      res.json(result['file.common']);
    }
  });
});

router.get('/errors', function(req, res){
  winston.query(logQuery, function (err, result) {
    if (err) {
      res.render('error500', {error: err.stack});
    } else{
      res.json(result['file.errors']);
    }
  });
});

module.exports = {
    routes: router,

    console: function(err, req, res, next){
      winston.error(err.stack);
      next(err);
    },

    xhr: function(err, req, res, next){
      if (req.xhr){
        res.status(500).send({error: err.stack});
      } else{
        next(err);
      }
    },

    showErrorPage: function(err, req, res, next){
      res.status(500).render('error500', {error: err.stack});
    },

    showNotFoundPage: function(req, res){
      winston.error("404 Not Found - URL: " + req.url);
      res.status(404).render('error404');
    },

};
