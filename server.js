

var express = require('express');
var fs = require('fs');
var path = require('path');



var cwd = process.cwd();
var port = process.env.PORT || 13302;


var app = express();

//app.use(express.logger());
app.use(function (req, res, next)
{
	console.log(req.url);
	next();
});
app.get('/', function (req, res)
{
	res.redirect('/index.html');
});
app.get('/favicon.ico', function (req, res){
	var filepath = path.join(cwd, 'images/favicon.ico');
	fs.exists(filepath, function (exists)
	{
		if(exists)
		{
			res.sendfile(filepath);
		}
		else
		{
			res.status(404);
		}
	});
});

app.get(/\/.*/, function (req, res){

	var filepath = path.join(cwd, req._parsedUrl.pathname);
	fs.exists(filepath, function (exists)
	{
		if(exists)
		{
			res.sendfile(filepath);
		}
		else
		{
			res.status(404);
			res.end("404 Not Found");
		}
	});

});


app.listen(port);
console.log('app: listen ' + port);