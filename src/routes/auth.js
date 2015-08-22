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
      email: email,
      name: name,
      password: password
    });
    user.save(function(err){
      if (err) {
        if (err.code === 11000 || err.code === 11001) {
          // unique constraint errors codes
          // User.email is only has unique constraint
          req.flash('error', 'Email already taken');
          res.render('auth/register', {login: user, errors: req.flash('error')});
          return;
        }
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
