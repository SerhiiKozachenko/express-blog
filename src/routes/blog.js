var router = require('express').Router();
var mongoose = require('mongoose');
var Blog = require('../models/blog');
var winston = require('winston');
var sluger = require('slug');

router.get('/blog', function(req, res, next){

  function response(err, data){
    winston.debug('err: ' + err);
  	if (err) {
      next(err);
  	} else {
  	  res.render('blog/index', {articles: data});
  	}
  };

  // only admin can see draft articles
  if (_adminLoggedIn(req)) {
    winston.debug('_adminLoggedIn: true');
    Blog.all(response);
  } else {
    winston.debug('_adminLoggedIn: false');
    Blog.allNonDraft(response);
  }

});

router.get('/:slug', function(req, res, next){
  winston.debug('show hitted');
  res.end();
  var slug = req.params.slug;
  Blog.findOne({slug: slug}, function(err, data){
  	if (err) {
      next(err);
  	} else {
  	  res.render('blog/show', {article: data});
  	}
  });
});

router.route('/:slug/edit')
  .get(_isAdmin, function(req, res){
  	var slug = req.params.slug;
  	Blog.findOne({slug: slug}, function(err, data){
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
    var slug = sluger(title);
    var sub = req.body.sub;
    var body = req.body.body;
    var tags = req.body.tags.split(',');
    var cover = req.body.cover;
    var draft = req.body.draft;
    Blog.findOne({_id: id}, function(err, data){
  	  if (err) {
        next(err);
  	  } else {
  	    data.title = title;
        data.slug = slug;
        data.sub = sub;
  	    data.body = body;
        data.tags = tags;
        data.cover = cover;
        data.draft = !!draft;
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

router.route('/blog/add')
  .get(_isAdmin, function(req, res){
    res.render('blog/add', {article: {}});
  })
  .post(_isAdmin, function(req, res, next){
  	var title = req.body.title;
    var slug = sluger(title);
    var sub = req.body.sub;
    var body = req.body.body;
    var tags = req.body.tags.split(',');
    var cover = req.body.cover;
    var draft = req.body.draft;
    var user = req.user.name;
    var _userId = mongoose.Types.ObjectId(req.user.id);
  	var blog = new Blog({
  	  title: title,
      slug: slug,
      sub: sub,
      body: body,
      user: user,
      _userId: _userId,
      tags: tags,
      cover: cover,
      draft: !!draft
  	});
  	blog.save(function(err){
      if (err){
        next(err);
      } else{
      	res.redirect('/blog');
      }
  	});
  });

router.post('/blog/:slug/delete', _isAdmin, function(req, res){
  var slug = req.params.slug;
  Blog.remove({slug: slug}, function(err){
    if(err){
      next(err);
    } else{
      res.redirect('/blog');
    }
  });
});

function _isAdmin(req, res, next){
  if (_adminLoggedIn(req)){
    next();
  } else {
    res.redirect('/auth/login');
  }
};

function _adminLoggedIn(req){
  return req.user && req.user.isAdmin;
}

module.exports = router;
