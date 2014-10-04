var express = require('express');
var router = express.Router();


module.exports = function(logger){

  router.get('/', function(req, res){
    var options = {
        from:   new Date - 24 * 60 * 60 * 1000,
        until:  new Date,
        limit:  50,
        start:  0,
        order:  'asc',
        fields: ['message']
    };
    logger.query(options, function (err, result) {
        if (err) {
            res.render('error500', {error: err.stack});
        } else{
          res.json(result['file.common']);
        }
    });
  });

  router.get('/errors', function(req, res){
    var options = {
        from:   new Date - 24 * 60 * 60 * 1000,
        until:  new Date,
        limit:  50,
        start:  0,
        order:  'asc',
        fields: ['message']
    };
    logger.query(options, function (err, result) {
        if (err) {
            res.render('error500', {error: err.stack});
        } else{
          res.json(result['file.errors']);
        }
    });
  });

  return {
    routes: router,

    console: function(err, req, res, next){
      logger.error(err.stack);
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

  };
};