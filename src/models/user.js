var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true, // Creates a setter which calls .trim() on the value
    lowercase: true, // Creates a setter which calls .toLowerCase() on the value
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address'], // validate against regexp
    index: { unique: true }
  },
  name:  {
    type: String,
    required: true
  },
  password:  {
    type: String,
    required: true,
  }
}
// it is recommended this behavior be disabled in production since index creation can cause a significant performance impact
//{ autoIndex: false }
);

// compound index
//userSchema.index({ email: 1, name: 1 }); // schema level

userSchema.pre('save', function(next) {
  var user = this;
  // only hash the password if it has been modified
  if (!user.isModified('password')) return next();

  // generate salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
  });
});

// For handling unique validations it's better to check err codes after save
// if (err && (11000 === err.code || 11001 === err.code) {
/*userSchema.path('name').validate(function(v, fn) {
  // Make sure the user name is not already registered
  var UserModel = mongoose.model('User');
  UserModel.find({'name': v.toLowerCase()}, function (err, emails) {
    fn(err || emails.length === 0);
  });
}, 'Email is already registered');*/

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);
