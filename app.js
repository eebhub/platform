
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
          building_info: {building_name: String,  //4
                          weather_epw_location: String,  //4
                          year_completed: String, //l,p,c
                          activity_type: String, //4
                          activity_type_specific: String   //s
                          },
          architecture:  {gross_floor_area: String,    //l,s,c
                          number_of_floors: String,    //s,c
                          window_to_wall_ratio: String,   //s,c
                          footprint_shape: String,        //s,c
                          building_height: String,        //s
                          perimeter: String,              //s
                          tightness: String                //c
                          },  
          typical_room:   {room_width: String,      //p
                           room_depth: String,      //p
                           room_height: String,     //p
                           exterior_shading_orientation: String,   //p
                           window_to_wall_ratio: String,     //p
                           number_of_floors: String,  //p
                           overhang_depth: String   //p
                           },                  
          materials:      {wall_insulation_r_value: String,  //p
                           thermal_mass: String,    //p
                           window_glass_coating: String,    //p
                           window_glass_type: String,    //p,s,c
                           roof_type: String,        //p,s,c
                           roof_insulation_type: String,   //p
                           roof_insulation_location: String,     //p
                           exterior_wall_type: String          //s,c
                           },
            
          people:         {people_density: String,    //p
                           number_of_employees_during_main_shift: String     //s
                           },
                           
          lighting:       {illuminance: String        //p
                           },                      
          
          mechanical:     {equipment_power_density: String,     //p
                           ventilation_system: String,          //p
                           primary_hvac_type: String,           //s
                           electricity_used_for_main_heating: String,      //s
                           natural_gas_used_for_main_heating: String,      //s
                           fuel_oil_used_for_main_heating: String,         //s
                           propane_used_for_main_heating: String,          //s
                           district_steam_used_for_main_heating: String,    //s
                           district_hot_water_used_for_main_heating: String,   //s
                           electricity_used_for_cooling: String,               //s
                           natural_gas_used_for_cooling: String,               //s
                           fuel_oil_used_for_cooling: String,                  //s
                           propane_used_for_cooling: String,                   //s
                           district_steam_used_for_cooling: String,            //s
                           district_hot_water_used_for_cooling: String,        //s
                           district_chilled_water_used_for_cooling: String,    //s
                           electricity_used_for_water_heating: String,         //s
                           natural_gas_used_for_water_heating: String,         //s
                           fuel_oil_used_for_water_heating: String,            //s
                           propane_used_for_water_heating: String,             //s
                           district_steam_used_for_water_heating: String,      //s
                           district_hot_water_used_for_water_heating: String   //s
                           }, 
                           
          schedules:      {weekday_occupancy_start: String,    //p
                           weekday_occupancy_end: String,      //p
                           open_24_hours_a_day: String,        //s
                           average_weekly_operating_hours: String,   //s
                           open_during_week: String,                 //s
                           open_on_weekend: String,                  //s
                           weekday_occupancy_hours_day_start: String,     //s
                           weekday_occupancy_hours_day_end: String,       //s
                           saturday_occupancy_hours_day_start: String,    //s
                           saturday_occupancy_hours_day_end: String,      //s
                           sunday_occupancy_hours_day_start: String,      //s
                           sunday_occupancy_hours_day_end: String         //s
                           }
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
app.get('/platform', routes.getHome); //added to reroute outdated tools.eebhub.org/platform link
app.get("/signup", function (req, res) {
    res.render("signup");
});
app.get("/signin", function (req, res) {
    res.render("signin");
});

app.get('/logout',function(req,res){
  req.session.destroy();
  res.send("Logged out!");
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
//app.get('/partial', routes.getPartial);
app.get('/partial', function(req,res){
    if(req.session.username){
        res.render('partial_auth');
    }else{
        res.sendfile('./views/partial.html');
    }
});
//app.get('/substantial', routes.getSubstantial);
app.get('/substantial', function(req,res){
    if(req.session.username){
        res.render('substantial_auth');
    }else{
        res.sendfile('./views/substantial.html');
    }
});
//app.get('/comprehensive', routes.getComprehensive);
app.get('/comprehensive', function(req,res){
   if(req.session.username){
       res.render('comprehensive_auth');
   }else{
       res.sendfile('./views/comprehensive.html');
   } 
});
app.get('/substantialsampleres', substantial.getSubstantialSampleRes);
app.get('/substantialsampleres-energyuse', substantial.getSubstantialSampleResEnergyUse);
app.get('/substantialsampleres-stage1', substantial.getSubstantialSampleResStage1);
app.get('/substantialsampleres-stage2', substantial.getSubstantialSampleResStage2);

app.get("/mydashboard", function(req, res){
    if(req.session.username){
        res.render('dashboard', {
			 'username': req.session.username,     
		});}else{
			    res.redirect('/signin');    
			    }
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

			 res.render('dashboard', {
			       'username': req.session.username,     
			    });
            });
        } else {
            req.session.error = 'Authentication failed, please check your ' + ' username and password.';
            res.redirect('/signin');
        }
    });
});

app.post("/savebuilding-lite", function (req, res) {
	
	    if (req.session.username){
			        var building = new Building({
                            username: req.session.username,
                                building: {
          building_info: {building_name: req.body.building_name,  //4
                          weather_epw_location: req.body.weather_epw_location,  //4
                          year_completed: req.body.year_completed, //l,p,c
                          activity_type: req.body.activity_type, //4
                          activity_type_specific: ''   //s
                          },
          architecture:  {gross_floor_area: req.body.gross_floor_area,    //l,s,c
                          number_of_floors: '',    //s,c
                          window_to_wall_ratio: '',   //s,c
                          footprint_shape: '',        //s,c
                          building_height: '',        //s
                          perimeter: '',              //s
                          tightness: ''                //c
                          },  
          typical_room:   {room_width: '',      //p
                           room_depth: '',      //p
                           room_height: '',     //p
                           exterior_shading_orientation: '',   //p
                           window_to_wall_ratio: '',     //p
                           number_of_floors: '',  //p
                           overhang_depth: ''   //p
                           },                  
          materials:      {wall_insulation_r_value: '',  //p
                           thermal_mass: '',    //p
                           window_glass_coating: '',    //p
                           window_glass_type: '',    //p,s,c
                           roof_type: '',        //p,s,c
                           roof_insulation_type: '',   //p
                           roof_insulation_location: '',     //p
                           exterior_wall_type: ''          //s,c
                           },
            
          people:         {people_density: '',    //p
                           number_of_employees_during_main_shift: ''     //s
                           },
                           
          lighting:       {illuminance: ''        //p
                           },                      
          
          mechanical:     {equipment_power_density: '',     //p
                           ventilation_system: '',          //p
                           primary_hvac_type: '',           //s
                           electricity_used_for_main_heating: '',      //s
                           natural_gas_used_for_main_heating: '',      //s
                           fuel_oil_used_for_main_heating: '',         //s
                           propane_used_for_main_heating: '',          //s
                           district_steam_used_for_main_heating: '',    //s
                           district_hot_water_used_for_main_heating: '',   //s
                           electricity_used_for_cooling: '',               //s
                           natural_gas_used_for_cooling: '',               //s
                           fuel_oil_used_for_cooling: '',                  //s
                           propane_used_for_cooling: '',                   //s
                           district_steam_used_for_cooling: '',            //s
                           district_hot_water_used_for_cooling: '',        //s
                           district_chilled_water_used_for_cooling: '',    //s
                           electricity_used_for_water_heating: '',         //s
                           natural_gas_used_for_water_heating: '',         //s
                           fuel_oil_used_for_water_heating: '',            //s
                           propane_used_for_water_heating: '',             //s
                           district_steam_used_for_water_heating: '',      //s
                           district_hot_water_used_for_water_heating: ''   //s
                           }, 
                           
          schedules:      {weekday_occupancy_start: '',    //p
                           weekday_occupancy_end: '',      //p
                           open_24_hours_a_day: '',        //s
                           average_weekly_operating_hours: '',   //s
                           open_during_week: '',                 //s
                           open_on_weekend: '',                  //s
                           weekday_occupancy_hours_day_start: '',     //s
                           weekday_occupancy_hours_day_end: '',       //s
                           saturday_occupancy_hours_day_start: '',    //s
                           saturday_occupancy_hours_day_end: '',      //s
                           sunday_occupancy_hours_day_start: '',      //s
                           sunday_occupancy_hours_day_end: ''         //s
                           }
          } 
   
                        }).save(); 

					console.log(req.session);
			        res.send("building info saved!");
			       
	            
	        } else {
	            res.redirect("/signup");
	        }
	    
	

});


//Reroutes
app.get("/ideas", function (req, res) {
    res.redirect("http://eebhub.uservoice.com/forums/224458-general");
});
app.get("/weather", function (req, res) {
    res.redirect("http://developer.eebhub.org/weather.html");
});


//Server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
