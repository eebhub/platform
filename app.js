
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
  , substantial=require("./routes/substantial.js")
  , splash = require('./routes/splash.js')
  , shjs = require('shelljs/global');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.engine('.html', cons.swig);
app.set('view engine', 'html');
swig.init({
    root: __dirname + '/views',
    allowErrors: true // allows errors to be thrown and caught by express instead of suppressed by Swig
});
app.set('views', __dirname + '/views');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', splash.getSplash);
app.get('/platform', routes.getHome);
app.get('/platform/', routes.getHome);
app.get('/platform/lite', routes.getLite);
app.get('/platform/literesults', routes.getLiteResults);
app.get('/platform/partial', routes.getPartial);
app.get('/platform/substantial', routes.getSubstantial);
app.get('/platform/comprehensive', routes.getComprehensive);
app.get('/platform/test-remote-engine', routes.getRemoteEngineRun);

//Posts
app.post('/liteanalysis', lite.liteanalysis);
app.post('/partialanalysis', partial.partial);
app.post('/substantial/analyze', substantial.getSubstantialInput);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
