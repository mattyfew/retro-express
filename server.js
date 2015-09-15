var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var ejs = require('ejs');
var urlencodedBodyParser = bodyParser.urlencoded({extended:false});
//need to inlude DB
var methodOverride = require('method-override');

app.use(urlencodedBodyParser);
app.use(methodOverride('_method'));
app.set('view_engine', 'ejs');
app.use(express.static('public'));

app.get('/', function(req,res){
	res.redirect('/retro-express')
})

app.get('/retro-express', function(req,res){
	res.render('index.html.ejs')
})

app.listen(3000, function(){
	console.log("Listening on port 3000")
})
