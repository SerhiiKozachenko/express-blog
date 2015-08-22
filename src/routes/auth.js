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
    var model = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      repassword: req.body.repassword
    };
    // validate
    if (model.password !== model.repassword) {
      req.flash('error', 'Confirmation password is not match');
      res.render('auth/register', {login: model, errors: req.flash('error')});
      return;
    }
    var user = new User({
      email: model.email,
      name: model.name,
      password: model.password
    });
    user.validate(function (err) {
      if (err) {
        req.flash('error', err);
        res.render('auth/register', {login: model, errors: req.flash('error')});
        return;
      }
    });
    user.save(function(err){
      if (err) {
        if (err.code === 11000 || err.code === 11001) {
          // unique constraint errors codes
          // User.email is only has unique constraint
          req.flash('error', 'Email already taken');
          res.render('auth/register', {login: model, errors: req.flash('error')});
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

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

module.exports = router;
