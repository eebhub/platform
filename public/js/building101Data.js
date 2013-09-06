//FILLS IN FORMS WITH BUILDING 101 DATA

//HTML
//<script src="js/building101Data.js"></script>
//<form action="action" method="post" name="platformForm">
//<button type="button"  onclick="building101Data()"> + Building 101</button>

//UNITS
//https://docs.google.com/spreadsheet/ccc?key=0AmpmAq6B1uv_dGNka3Q1LWVzaW5ObnNtbW9ZRkUwQ2c#gid=6

function building101Data() {

var form = document.forms.platformForm;

//BUILDING
if (form.contains(form.building_name)) {form.building_name.value = "Building 101";}
if (form.contains(form.weather_epw_location)) {form.weather_epw_location.value = "Philadelphia, PA";}
if (form.contains(form.activity_type)) {form.activity_type.value = "Medium Office";}
if (form.contains(form.activity_type_specific)) {form.activity_type_specific.value = "Administrative/professional office";}
if (form.contains(form.year_completed)) {form.year_completed.value = "1911";}
if (form.contains(form.building_location_address)) {form.building_location_address.value = "4747 South Broad Street";}
if (form.contains(form.building_location_city)) {form.building_location_city.value = "Philadelphia";}
if (form.contains(form.building_location_state)) {form.building_location_state.value = "PA";}

//UTILITIES > excel
//form.utility_startdate_electric.value = "01/15/2012";
//form.utility_startdate_gas.value = "01/15/2012";
//form.utility_electric.value = "10";
//form.utility_gas.value = "10";
//Form.utltable.innerHTML =[date array]

//ARCHITECTURE
if (form.contains(form.gross_floor_area)) {form.gross_floor_area.value = 6967.72;} // attic & basement
if (form.contains(form.building_length)) {form.building_length.value = 90.53;} 
if (form.contains(form.building_width)) {form.building_width.value = 30.78;}
if (form.contains(form.building_height)) {form.building_height.value = 15.54;} //floor not attic
if (form.contains(form.building_orientation)) {form.building_orientation.value = 275;} //clockwise from North, degrees
if (form.contains(form.window_to_wall_ratio)) {form.window_to_wall_ratio.value = 15;}
if (form.contains(form.number_of_floors)) {form.number_of_floors.value = 4;} //conditioned space, includes basement

//ROOM
if (form.contains(form.exterior_shading_orientation)) {form.exterior_shading_orientation.value = "East";}
if (form.contains(form.room_width)) {form.room_width.value = 21.6;}
if (form.contains(form.room_depth)) {form.room_depth.value = 9.37;}
if (form.contains(form.room_height)) {form.room_height.value = 4.04;}
if (form.contains(form.overhang_depth)) {form.overhang_depth.value = 0;}

//SHAPE
if (form.contains(form.footprint_shape)) {form.footprint_shape.value = "T";}
if (form.contains(form.building_end1)) {form.building_end1.value = 18.29;}
if (form.contains(form.building_end2)) {form.building_end2.value = 15.54;}
if (form.contains(form.building_offset)) {form.building_offset.value = 38.1;}

//MATERIALS
if (form.contains(form.exterior_wall_type)) {form.exterior_wall_type.value = "Brick";}
if (form.contains(form.wall_insulation_r_value)) {form.wall_insulation_r_value.value = "2";} //IP=4.6
if (form.contains(form.thermal_mass)) {form.thermal_mass.value = "low";} //light wood
if (form.contains(form.window_glass_type)) {form.window_glass_type.value = "dgu_nb";} //Windows Double Glazed
if (form.contains(form.window_glass_coating)) {form.window_glass_coating.value = "clear";}
if (form.contains(form.roof_type)) {form.roof_type.value = "none";}

if (form.contains(form.roof_insulation_type)) {form.roof_insulation_type.value = "2";} //R=20
if (form.contains(form.roof_insulation_location)) {form.roof_insulation_location.value = "bottom";}

//PEOPLE
if (form.contains(form.people_density)) {form.people_density.value = 0.025;}
if (form.contains(form.number_of_occupants)) {form.number_of_occupants.value = 94;}

//LIGHTING
if (form.contains(form.illuminance)) {form.illuminance.value = 500;}
if (form.contains(form.lighting_power_density)) {form.lighting_power_density.value = 2;} //2W/sqft
if (form.contains(form.window_head_height)) {form.window_head_height.value = 10.25;}
if (form.contains(form.wall_thickness)) {form.wall_thickness.value = 1.5;}
if (form.contains(form.interior_shading_type)) {form.interior_shading_type.value = "Fabric Shades";}
if (form.contains(form.floor_reflectance)) {form.floor_reflectance.value = 0.2;}
if (form.contains(form.ceiling_reflectance)) {form.ceiling_reflectance.value = 0.4;}
if (form.contains(form.wall_reflectance)) {form.wall_reflectance.value = 0.6;}

//MECHANICAL
if (form.contains(form.equipment_power_density)) {form.equipment_power_density.value = "15.00";} //1W/sqft
if (form.contains(form.ventilation_system)) {form.ventilation_system.value = "natural";}
if (form.contains(form.primary_hvac_type)) {form.primary_hvac_type.value = 500;}
if (form.contains(form.demand_control_ventilation)) {form.demand_control_ventilation.value = "no";}
if (form.contains(form.airside_economizer)) {form.airside_economizer.value = "no";}
if (form.contains(form.airside_energy_recovery)) {form.airside_energy_recovery.value = "no";}

//SCHEDULES
if (form.contains(form.weekday_occupancy_start)) {form.weekday_occupancy_start.value = "7.0";}
if (form.contains(form.weekday_occupancy_end)) {form.weekday_occupancy_end.value = "18.0";}
if (form.contains(form.saturday_occupancy_start)) {form.saturday_occupancy_start.value = "closed";}
if (form.contains(form.saturday_occupancy_end)) {form.saturday_occupancy_end.value = "closed";}
if (form.contains(form.sunday_occupancy_start)) {form.sunday_occupancy_start.value = "closed";}
if (form.contains(form.sunday_occupancy_end)) {form.sunday_occupancy_end.value = "closed";}

//UTILITY DATA
var electric_utility_startdate_building101 = ['2012-01-01', '2012-02-01', '2012-03-01', '2012-04-01', '2012-05-01', '2012-06-01', '2012-07-01', '2012-08-01', '2012-09-01', '2012-10-01', '2012-11-01', '2012-12-01', '2012-12-31'],
    utility_electric_building101 = [65280, 50400, 54600, 68160, 72240, 89280, 100560, 131400, 111000, 89880, 89040, 66120, '--'],
    gas_utility_startdate_building101 = ['2012-01-26', '2012-02-24', '2012-03-27', '2012-04-27', '2012-05-27', '2012-06-27', '2012-07-27', '2012-08-27', '2012-09-27', '2012-10-27', '2012-11-27', '2012-12-27', '2013-01-27'],
    utility_gas_building101 = [3641, 2166, 1019, 923, 30.5, 34.5, 85.7, 38.7, 989.7, 2824, 2385, 3500, '--'];

//UTILITY INPUTS
var electric_utility_startdate = document.getElementsByName('electric_utility_startdate'),
    utility_electric = document.getElementsByName('utility_electric'),
    gas_utility_startdate = document.getElementsByName('gas_utility_startdate'),
    utility_gas = document.getElementsByName('utility_gas');

//Update the Utility Table
for (i in electric_utility_startdate) {
    electric_utility_startdate[i].value = electric_utility_startdate_building101[i];
    utility_electric[i].value = utility_electric_building101[i];
    gas_utility_startdate[i].value = gas_utility_startdate_building101[i];
    utility_gas[i].value = utility_gas_building101[i];}
        
        }

/*
ELECTRICITY
1/1/2012
2/1/2012
3/1/2012
4/1/2012
5/1/2012
6/1/2012
7/1/2012
8/1/2012
9/1/2012
10/1/2012
11/1/2012
12/1/2012

ELECTRICITY (kWh)
65280
50400
54600
68160
72240
89280
100560
131400
111000
89880
89040
66120

NATURAL GAS
1/26/2012
2/24/2012
3/27/2012
4/27/2012
5/27/2012
6/27/2012
7/27/2012
8/27/2012
9/27/2012
10/27/2012
11/27/2012
12/27/2012

NATURAL GAS (CCF)
3641
2166
1019
923
30.5
34.5
85.7
38.7
989.7
2824
2385
3500
*/