
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
  , mongoose = require('mongoose');


var app = express();

mongoose.connect("mongodb://128.118.67.242/test");
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    hash: String
});

var User = mongoose.model('users', UserSchema);

var BuildingSchema = new mongoose.Schema({
    username: String,
    building: {
          building_info: {building_name: String,
                          weather_epw_location: String,
                          activity_type: String,
                          activity_type_specific: String},
          architecture:  {gross_floor_area: String,
                          number_of_floors: String,
                          window_to_wall_ratio: String,
                          footprint_shape: String,
                          building_height: String,
                          perimeter: String},
          materials:      {exterior_wall_type: String,
                           window_glass_type: String,
                           roof_type: String},
            
          people:         {number_of_employees_during_main_shift: String},
          
          mechanical:     {primary_hvac_type: String,
                           electricity_used_for_main_heating: String,
                           natural_gas_used_for_main_heating: String,
                           fuel_oil_used_for_main_heating: String,
                           propane_used_for_main_heating: String,
                           district_steam_used_for_main_heating: String,
                           district_hot_water_used_for_main_heating: String,
                           electricity_used_for_cooling: String,
                           natural_gas_used_for_cooling: String,
                           fuel_oil_used_for_cooling: String,
                           propane_used_for_cooling: String,
                           district_steam_used_for_cooling: String,
                           district_hot_water_used_for_cooling: String,
                           district_chilled_water_used_for_cooling: String,
                           electricity_used_for_water_heating: String,
                           natural_gas_used_for_water_heating: String,
                           fuel_oil_used_for_water_heating: String,
                           propane_used_for_water_heating: String,
                           district_steam_used_for_water_heating: String,
                           district_hot_water_used_for_water_heating: String},
                           
          schedules:      {open_24_hours_a_day: String,
                           average_weekly_operating_hours: String,
                           open_during_week: String,
                           open_on_weekend: String,
                           weekday_occupancy_hours_day_start: String,
                           weekday_occupancy_hours_day_end: String,
                           saturday_occupancy_hours_day_start: String,
                           saturday_occupancy_hours_day_end: String,
                           sunday_occupancy_hours_day_start: String,
                           sunday_occupancy_hours_day_end: String}
          }                  
   
});

var Building = mongoose.model('buildings', BuildingSchema);

var BuildingModelSchema = new mongoose.Schema({
    username: String,
    model: String,                  
   
});

var Buildingmodel = mongoose.model('buildingmodels', BuildingModelSchema);

function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);

    User.findOne({
        username: name
    },

    function (err, user) {
        if (user) {
            if (err) return fn(new Error('cannot find user'));
            
                if (user.password == pass) return fn(null, user);
                else return fn(new Error('invalid password'));
           
        } else {
            return fn(new Error('cannot find user'));
        }
    });

}

// Seting Server environments, ports and rendering
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser("secret"));
app.use(express.session());
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
app.get("/signup", function (req, res) {
    res.render("signup");
});
app.get("/signin", function (req, res) {
    res.render("signin");
});
//app.get('/lite', routes.getLite);
//app.get('/liteconv', routes.getLiteConv);
app.get('/lite', function(req, res){
    if(req.session.username){
        res.render('lite_auth');  
    }else{
        res.sendfile('./views/lite.html');    
    } 
});
app.get('/literesults', routes.getLiteResults);
app.get('/partial', routes.getPartial);
app.get('/substantial', routes.getSubstantial);
app.get('/comprehensive', routes.getComprehensive);
app.get('/substantialsampleres', substantial.getSubstantialSampleRes);
app.get('/substantialsampleres-energyuse', substantial.getSubstantialSampleResEnergyUse);
app.get('/substantialsampleres-stage1', substantial.getSubstantialSampleResStage1);
app.get('/substantialsampleres-stage2', substantial.getSubstantialSampleResStage2);

app.get("/mydashboard", function(req, res){
    res.render('dashboard', {
			       'username': req.session.username,     
			    });
});

app.get("/mybuildings", function(req, res){
    Building.find({username: req.session.username}, function (err, docs) {
    console.log(docs.length);    
     res.send(docs.length+ "buildings:\n"+docs);
});
    
});

app.get("/mymodels", function(req, res){
    Buildingmodel.find({username: req.session.username}, function (err, docs) {
    console.log(docs.length);    
     res.send(docs.length+ "building models:\n"+docs);
});
    
});


//Posts
app.post('/partialanalysis', partial.partial);
//app.post('/substantialresults', substantial.getSubstantialInput);
app.post('/substantialresults', substantial.getSubstantialResults);

app.post('/imtanalysis', lite.runIMT);
app.post('/ibmanalysis', lite.ibm);

app.post("/signup", function (req, res) {
	
	    User.count({
	        username: req.body.username
	    }, function (err, count) {
			console.log(count);
	        if (count === 0) {
			    //hash(req.body.password, function (err, salt, hash) {
			        //if (err) throw err;
			        var user = new User({
			            username: req.body.username,
			            password : req.body.userpassword,
			            salt: '',
			            hash: '',
			        }).save(); 
			                //res.redirect('/');
					//res.send("Welcome "+req.body.username);		
					req.session.username = req.body.username;
					console.log(req.session);
			     //   res.render('substantialwelcome', {
			     //   'username': req.body.username,     
			     //   });
			     res.send("Success!");
			       
	            
	        } else {
	            req.session.error = "User Exist";
				console.log(req.session.error);
				res.send(req.session.error);
	            //res.redirect("/signup");
	        }
	    });
	

});

app.post("/mydashboard", function (req, res) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {

            req.session.regenerate(function () {

                req.session.username = user.username;
                //req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
    //             res.render('substantialwelcome', {
			 //       'username': req.body.username,     
			 //   });
			 
<<<<<<< HEAD
			 res.send("welcome"+req.body.username);
=======
			 res.render('dashboard', {
			       'username': req.session.username,     
			    });
>>>>>>> develop
            });
        } else {
            req.session.error = 'Authentication failed, please check your ' + ' username and password.';
            res.redirect('/signin');
        }
    });
});





//Server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
