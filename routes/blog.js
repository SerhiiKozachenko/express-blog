var router = require('express').Router();

var blogs = [{
  id: 0,
  title: 'My First blog entry',
  body: 'The beginging in the ssdasd..',
  date: new Date().toISOString(),
  author: 'Sergey Kozachenko'
}, {
  id: 1,
  title: 'My Second blog entry',
  body: 'The asdasdasd in the ssdasd..',
  date: new Date().toISOString(),
  author: 'Sergey Kozachenko'
}];

router.get('/', function(req, res){
  res.render('blog/index', {articles: blogs});
});

router.get('/:id/show', function(req, res){
  var id = req.params.id;
  res.render('blog/show', {article: blogs[id]});
});

router.route('/:id/edit')
  .get(function(req, res){
  	var id = req.params.id;
    res.render('blog/edit', {article: blogs[id]});
  })
  .post(function(req, res){
  	var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    blogs[id].title = title;
    blogs[id].body = body;
    res.redirect('/blog');
  });

router.route('/add')
  .get(function(req, res){
    res.render('blog/add', {article: {}});
  })
  .post(function(req, res){
  	var id = blogs.length;
    var title = req.body.title;
    var body = req.body.body;
    blogs.push({
      id: id,
      title: title,
      body: body,
      date: new Date().toISOString(),
      author: 'Sergey Kozachenko'
    });
    res.redirect('/blog');
  });

router.post('/:id/delete', function(req, res){
  var id = req.params.id;
  blogs.splice(id, 1);
  res.redirect('/blog');
});

module.exports = router;