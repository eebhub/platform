
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , routes = require('./routes/routes.js')
  , lite = require("./routes/lite.js")
<<<<<<< HEAD
  , partial = require("./routes/partial.js")
  , substantial=require("./routes/substantial.js")
  , splash = require('./routes/splash.js')
  , shjs = require('shelljs/global');
=======
  , partial = require("./routes/partial.js");
>>>>>>> 6b3089e3f2c427112d671d3ae6df74c14d6fc4f8

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

<<<<<<< HEAD
app.get('/', splash.getSplash);
app.get('/platform', routes.getHome);
app.get('/platform/', routes.getHome);
app.get('/platform/lite', routes.getLite);
app.get('/platform/literesults', routes.getLiteResults);
app.get('/platform/partial', routes.getPartial);
app.get('/platform/substantial', routes.getSubstantial);
app.get('/platform/comprehensive', routes.getComprehensive);
app.get('/platform/test-remote-engine', routes.getRemoteEngineRun);
=======
//Get Routing
app.get('/', routes.getHome);
app.get('/', routes.getHome);
app.get('/lite', routes.getLite);
app.get('/literesults', routes.getLiteResults);
app.get('/partial', routes.getPartial);
app.get('/substantial', routes.getSubstantial);
app.get('/comprehensive', routes.getComprehensive);
>>>>>>> 6b3089e3f2c427112d671d3ae6df74c14d6fc4f8

//Posts
app.post('/partialanalysis', partial.partial);
<<<<<<< HEAD
app.post('/substantial/analyze', substantial.getSubstantialInput);
=======
app.post('/imtanalysis', lite.imt);
app.post('/ibmanalysis', lite.ibm);
>>>>>>> 6b3089e3f2c427112d671d3ae6df74c14d6fc4f8

//Server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
