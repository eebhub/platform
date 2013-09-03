
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , routes = require('./routes/routes.js')
  , lite = require("./routes/lite.js")
  , partial = require("./routes/partial.js")
  , substantial=require("./routes/substantial.js")
  , shjs = require('shelljs/global')


var app = express();

// Seting Server environments, ports and rendering
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Get Routing
app.get('/', routes.getHome);
app.get('/', routes.getHome);
app.get('/lite', routes.getLite);
app.get('/literesults', routes.getLiteResults);
app.get('/partial', routes.getPartial);
app.get('/substantial', routes.getSubstantial);
app.get('/comprehensive', routes.getComprehensive);
//app.get('/substantialresults', substantial.getSubstantialResults);


//Posts
app.post('/partialanalysis', partial.partial);
//app.post('/substantialresults', substantial.getSubstantialInput);
app.post('/substantialresults', substantial.getSubstantialResults);

app.post('/imtanalysis', lite.runIMT);
app.post('/ibmanalysis', lite.ibm);



//Server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
