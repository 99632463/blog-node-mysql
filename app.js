var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session')

var app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.set('views','./views');
app.engine('html',ejs.__express);
app.set('view engine','html');

app.use(bodyParser.urlencoded({extended:false}));

app.use('/public',express.static(__dirname + '/public'));
app.use('/upload',express.static(__dirname + '/upload'));

app.use('/',require('./router/home'));
app.use('/admin',require('./router/admin'));

app.listen(3005,function(){
  console.log('service running......');
})
