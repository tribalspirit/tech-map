
/**
 * Module dependencies.
 */

var express = require('express'),
    index = require('./app/routes/index'),
    api = require('./app/routes/api'),
    http = require('http'),
    path = require('path'),
    bodyParser= require('body-parser'),
    favicon = require('serve-favicon');





var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'ejs');
app.use(favicon("./public/images/favicon.ico"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());



app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/api', api);


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
