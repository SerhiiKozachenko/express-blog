var router = require('express').Router();
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
  	    res.render('blog/edit', {article: data});
  	  }
    });
  })
  .post(_isAdmin, function(req, res, next){
  	var id = req.body.id;
  	var title = req.body.title;
    var body = req.body.body;
    Blog.findOne({_id: id}, function(err, data){
  	  if (err) {
        next(err);
  	  } else {
  	    data.title = title;
  	    data.body = body;
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
    var body = req.body.body;
  	var blog = new Blog({
  	  title: title,
      body: body,
      date: new Date().toISOString(),
      author: 'Sergey Kozachenko'
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
