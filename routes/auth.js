var router = require('express').Router();
var passport = require('passport');
var User = require('../models/user');
var winston = require('winston');

router.route('/login')
  .get(function(req, res){
  	res.render('auth/login', {login: {}, errors: req.flash('error')});
  })
  .post(
    passport.authenticate('local', { 
  	  successRedirect: '/blog',
      failureRedirect: 'login',
      failureFlash: true })
  );

router.route('/register')
  .get(function(req, res){
  	res.render('auth/register', {login: {}, errors: req.flash('error')});
  })
  .post(function(req, res, next){
    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;
    var user = new User({
      name: name,
      password: password,
      email: email
    });
    user.save(function(err){
      if (err) {
      	next(err);
      } else {
      	req.login(user, function(err) {
          if (err) {
            next(err);
          } else {
          	res.redirect('/blog');
          }
       });
      }
    });
  });

module.exports = router;