var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var urlencodedBodyParser = bodyParser.urlencoded({extended:false});
//need to inlude DB
var methodOverride = require('method-override');

app.use(urlencodedBodyParser);
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.get('/retro-express', function(req,res){
	res.render('index.html')
})

app.get('/', function(req,res){
	res.redirect('/retro-express')
})

app.listen(3000, function(){
	console.log("listening on port 3000, bitch!")
})
