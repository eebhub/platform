var fs = require("fs");
var dainput = require("../lib/mit.js");
var newShell = require("../lib/newShell-mit.js");
var timestp = require("../lib/timestamp.js");

module.exports = {

    partial: function(request, response) {
        console.log(request.body);
        //Common Body Variables, missing building orientation and Footprint
        var building_name = request.body.building_name.replace(/\s+/g, '') || "NoName";
        var year_completed = request.body.year_completed;
        var number_of_floors = request.body.number_of_floors ;
        var people_density = request.body.people_density;
        var activity_type = request.body.activity_type;
        var weather_epw_location = request.body.weather_epw_location;
        var window_to_wall_ratio = request.body.window_to_wall_ratio;
        var weekday_occupancy_start = request.body.weekday_occupancy_start;
        var weekday_occupancy_end = request.body.weekday_occupancy_end;
        var window_glass_type = request.body.window_glass_type;
        var thermal_mass = request.body.thermal_mass;
        var roof_type = request.body.roof_type;
        var roof_insulation_type = request.body.roof_insulation_type;
        var roof_insulation_location = request.body.roof_insulation_location;
        var wall_insulation_r_value = request.body.wall_insulation_r_value;
        var ventilation_system = request.body.ventilation_system;
        var equipment_power_density = request.body.equipment_power_density;
        var illuminance = request.body.illuminance;

        //Typical Room Inputs
        var room_depth = request.body.room_depth;
        var room_width = request.body.room_width;
        var room_height = request.body.room_height;
        var exterior_shading_orientation = request.body.exterior_shading_orientation;
        var window_glass_coating = request.body.window_glass_coating;
        var overhang_depth = request.body.overhang_depth;

        //Inputs
        var timestamp = timestp.createTimestamp();
        var BuildingInputName =  building_name+timestamp;
        
        fs.mkdirSync('../mit/' + BuildingInputName, function(error) {
            if (error) throw error;
        });

        dainput.MITinputFile(BuildingInputName, roof_type, roof_insulation_type, number_of_floors, roof_insulation_location, weather_epw_location,
                        exterior_shading_orientation, room_width, room_depth, room_height,
                        window_glass_type, window_to_wall_ratio, ventilation_system, wall_insulation_r_value, illuminance,
                        equipment_power_density, weekday_occupancy_start, weekday_occupancy_end, overhang_depth, thermal_mass, people_density, window_glass_coating);
        
        newShell.newShellMIT(BuildingInputName);
        
        /*
        var exec = require('child_process').exec;
        var command = 
                    'ssh platform@128.118.67.227\"' +
                    'cd /home/platform/;' +
                    'java -jar DATest.jar mit/'+BuildingInputName+'/'+BuildingInputName+'_input.txt;' +
                    'cp '+BuildingInputName+'_output.txt /home/platform/mit/' + BuildingInputName + '/\"';
        
        exec(command);
        */
        //exec('ssh platform@128.118.67.227 \"cd /home/platform/; java -jar DATest.jar '+BuildingInputName+'_input.txt; cp '+BuildingInputName+'.txt /home/platform/mit/' + BuildingInputName + '/\"', function(err2, stdout2, stderr2));
        //});

        response.redirect('http://developer.eebhub.org/mit/'+BuildingInputName+'/');

    },
};