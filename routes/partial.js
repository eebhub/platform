var fs = require("fs");
var dainput = require("../lib/mit.js")

module.exports = {

    partial: function(request, response) {
        //Common Body Variables, missing building orientation and Footprint
        var building_name = request.body.building_name;
        var year_completed = request.body.year_completed;
        var number_of_floors = request.body.number_of_floors ;
        var number_of_occupants = request.body.number_of_occupants;
        var activity_type = request.body.activity_type;
        var weather_epw_location = request.body.weather_epw_location;
        var gross_floor_area = request.body.gross_floor_area;
        var building_length = request.body.building_length;
        var building_width = request.body.building_width;
        var window_to_wall_ratio = request.body.window_to_wall_ratio;
        var weekday_occupancy_start = request.body.weekday_occupancy_start;
        var weekday_occupancy_end = request.body.weekday_occupancy_end;
        var weekend_occupancy_start = request.body.weekend_occupancy_start;
        var weekend_occupancy_end = request.body.weekend_occupancy_end;
        var exterior_wall_type = request.body.exterior_wall_type;
        var window_glass_type = request.body.window_glass_type;
        var thermal_mass = request.body.thermal_mass;
        var roof_type = request.body.roof_type;
        var roof_insulation_type = request.body.roof_insulation_type;
        var roof_insulation_location = request.body.roof_insulation_location;
        var wall_insulation_r_value = request.body.wall_insulation_r_value;
        var ventilation_system = request.body.ventilation_system;
        var equipment_power_density = request.body.equipment_power_density;

        //Typical Room Inputs
        var room_depth = request.body.room_depth;
        var room_width = request.body.room_width;
        var room_height = request.body.room_height;
        var exterior_shading_orientation = request.body.exterior_shading_orientation;
        var window_to_wall_ratio_room = request.body.window_to_wall_ratio_room;
        var window_glass_coating = request.body.window_glass_coating;
        var overhang_depth = request.body.overhang_depth;

        //Inputs
        var mitInputFileName = './MIT/' + building_name + '.txt'

        dainput.MITinputFile(mitInputFileName, roof_type, roof_insulation_type, number_of_floors, roof_insulation_location, weather_epw_location,
        exterior_shading_orientation, room_width, room_depth, room_height, building_length,
        building_width, window_to_wall_ratio, ventilation_system, wall_insulation_r_value, equipment_power_density,
        equipment_power_density, weekday_occupancy_start, weekday_occupancy_end, overhang_depth,
        number_of_occupants, gross_floor_area);

        fs.readFile(mitInputFileName, function(error, content) {
            if (error) {
                response.writeHead(500);
                response.end();
            }
            else {
                response.writeHead(200, {
                    'Content-Type': 'text/plain'});
                response.end(content, 'utf-8');
            }
        });
    },
};