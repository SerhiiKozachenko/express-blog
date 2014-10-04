module.exports = {

  index: function(req, res){
  	
    res.render('home/index', 
    	{
    		title: 'home', 
    		message: 'Hello world',
    		online: req.online.length
    	});
  },


};