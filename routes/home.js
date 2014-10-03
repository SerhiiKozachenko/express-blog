module.exports = {

  index: function(req, res){
  	throw new Error('error here');
    res.render('home/index', {title: 'home', message: 'Hello world'});
  },


};