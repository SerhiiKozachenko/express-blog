module.exports = {
  logConsole: function(err, req, res, next){
  	console.log('logConsole');
    console.log(err.stack);
    next(err);
  },
  logXhr: function(err, req, res, next){
  	console.log('logXhr');
    if (req.xhr){
	  res.status(500)
	  	 .send({error: err.stack});
    } else{
    	next(err);
    }
  },
  showErrorPage: function(err, req, res, next){
  	console.log('showErrorPage');
    res.status(500);
    res.render('error500', {error: err.stack});
  },
};