var router = require('express').Router();
var request = require('request');

router.route('/')
  .get(function(req, res){
    res.render('contact/index', {contact: {}});
  })
  .post(function(req, res, next){
      //console.dir(req.body);
      var url = 'https://node-emailer.herokuapp.com/wbserg@gmail.com';

      var name = req.body.name;
      var email = req.body.email;
      var phone = req.body.phone;
      var message = req.body.message;
      var model = {
        name: name,
        email: email,
        phone: phone,
        message: message
      };
      var msg = model.name
        + '(' + model.email + ') says: '
        + model.message
        + (!!model.phone
          ? '. His Phone #: ' + model.phone
          : '. Have not specified phone number.');
      var jsonData = {
        to: 'wbserg@gmail.com',
        subject: 'Contact from grievoushead.cloudapp.net',
        message: msg
      };
      var secretHeader = process.env.EMAIL_HEADER;
      var secret = process.env.EMAIL_SECRET;
      var headers = {};
      headers[secretHeader] = secret;
      request({
        method: "PUT",
        uri: url,
        json: jsonData,
        headers: headers
      }, function(err, httpResponse) {
        if (!err && httpResponse.statusCode === 200) {
          console.log('contact email successfuly send');
          req.flash('success', 'Your message was successfully submitted!');
          res.render('contact/index', {contact: model, success: req.flash('success')});
        } else {
          console.error('error while sending contact email');
          req.flash('error', 'Oops, something went wrong :(');
          res.render('contact/index', {contact: model, error: req.flash('error')});
        }
      });

  });

module.exports = router;
