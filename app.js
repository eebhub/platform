
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , cons = require("consolidate")
  , swig = require("swig")
  , routes = require('./routes/routes.js')
  , lite = require("./routes/lite.js")
  , partial = require("./routes/partial.js")
  , splash = require('./routes/splash.js');

var app = express();

// Seting Server environments, ports and rendering
app.set('port', process.env.PORT || 3000);
app.engine('.html', cons.swig);
app.set('view engine', 'html');
swig.init({
    root: __dirname + '/views',
    allowErrors: true // allows errors to be thrown and caught by express instead of suppressed by Swig
});
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
app.get('/', splash.getSplash);
app.get('/platform', routes.getHome);
app.get('/platform/', routes.getHome);
app.get('/platform/lite', routes.getLite);
app.get('/platform/literesults', routes.getLiteResults);
app.get('/platform/partial', routes.getPartial);
app.get('/platform/substantial', routes.getSubstantial);
app.get('/platform/comprehensive', routes.getComprehensive);

//Posts
app.post('/partialanalysis', partial.partial);
app.post('/imtanalysis', lite.imt);
app.post('/ibmanalysis', lite.ibm);

//Server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
