var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var redis = require('redis');
var cache = redis.createClient();
var winston = require('winston');

var REDIS_USER_EXPIRATION_SECONDS = 21600; // 6 Hrs

// Used every time when login check happened
passport.use(new LocalStrategy({
    // Map form fields
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    winston.debug('Passport: Find User by email: ' + email);
    User.findOne({ email: email }, function(err, user) {
      if (err) return done(err);
      if (!user) {
        return done(null, false, 'User with email: '+ email + ' not found');
      }
      user.comparePassword(password, function(err, isMatch){
        if (err) return done(err);
        if (!isMatch){
          done(null, false, 'Incorrect password');
        } else {
          done(null, user);
        }
      });
    });
  }
));

// Used every time when user login success
passport.serializeUser(function(user, done) {
  winston.debug('Passport: SerializeUser');
  _saveUserToRedis(user);
  done(null, user.id);
});

// Used on each auth request when user login success
passport.deserializeUser(function(id, done) {
  winston.debug('Passport: DeserializeUser');
  cache.get('user_'+id, function(err, result){
    if (err){
      winston.error('Redis, deserializeUser: '+ err.stack);
    } else if (!result) {
      winston.debug('Redis, deserializeUser: empty get from db');
      User.findById(id, function(err, user) {
        if (!err) {
          _saveUserToRedis(user);
        }
        done(err, user);
      });
    } else {
      winston.debug('Redis, deserializeUser: cool get from redis');
      done(null, JSON.parse(result));
    }
  })
});

function _saveUserToRedis(user){
  // wipeout password before cache
  var userCacheModel = {
    id: user.id,
    name: user.name,
    email: user.email
  };
  cache.setex('user_'+user.id, REDIS_USER_EXPIRATION_SECONDS, JSON.stringify(userCacheModel));
};
