var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('home/index', {
    title: 'home', 
	message: 'Hello world',
	online: req.online.length
  });
});

router.get('/about', function(req, res){
  res.render('home/about');
});

module.exports = router;