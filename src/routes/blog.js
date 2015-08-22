var router = require('express').Router();
var mongoose = require('mongoose');
var Blog = require('../models/blog');

router.get('/', function(req, res, next){
  Blog.find({}, function(err, data){
  	if (err) {
      next(err);
  	} else {
  	  res.render('blog/index', {articles: data});
  	}
  });
});

router.get('/:id/show', function(req, res, next){
  var id = req.params.id;
  Blog.findOne({_id: id}, function(err, data){
  	if (err) {
      next(err);
  	} else {
  	  res.render('blog/show', {article: data});
  	}
  });
});

router.route('/:id/edit')
  .get(_isAdmin, function(req, res){
  	var id = req.params.id;
  	Blog.findOne({_id: id}, function(err, data){
  	  if (err) {
        next(err);
  	  } else {
        data.tags = data.tags.join();
  	    res.render('blog/edit', {article: data});
  	  }
    });
  })
  .post(_isAdmin, function(req, res, next){
  	var id = req.body.id;
  	var title = req.body.title;
    var sub = req.body.sub;
    var body = req.body.body;
    var tags = req.body.tags.split(',');
    var cover = req.body.cover;
    Blog.findOne({_id: id}, function(err, data){
  	  if (err) {
        next(err);
  	  } else {
  	    data.title = title;
        data.sub = sub;
  	    data.body = body;
        data.tags = tags;
        data.cover = cover;
  	    data.save(function(err){
          if (err){
            next(err);
          } else{
      	    res.redirect('/blog');
          }
  	    });
  	  }
    });
  });

router.route('/add')
  .get(_isAdmin, function(req, res){
    res.render('blog/add', {article: {}});
  })
  .post(_isAdmin, function(req, res, next){
  	var title = req.body.title;
    var sub = req.body.sub;
    var body = req.body.body;
    var tags = req.body.tags.split(',');
    var cover = req.body.cover;
    var user = req.user.name;
    var _userId = mongoose.Types.ObjectId(req.user.id);
  	var blog = new Blog({
  	  title: title,
      sub: sub,
      body: body,
      user: user,
      _userId: _userId,
      tags: tags,
      cover: cover
  	});
  	blog.save(function(err){
      if (err){
        next(err);
      } else{
      	res.redirect('/blog');
      }
  	});
  });

router.post('/:id/delete', _isAdmin, function(req, res){
  var id = req.params.id;
  Blog.remove({_id: id}, function(err){
    if(err){
      next(err);
    } else{
      res.redirect('/blog');
    }
  });
});

function _isAdmin(req, res, next){
  if (req.user && req.user.isAdmin){
    next();
  } else {
    res.redirect('/auth/login');
  }
};

module.exports = router;
