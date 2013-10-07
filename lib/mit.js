var fs = require('fs');

module.exports.MITinputFile = MITinputFile;

function MITinputFile(BuildingInputName, roof_type, roof_insulation_type, number_of_floors, roof_insulation_location, weather_epw_location,
                        exterior_shading_orientation, room_width, room_depth, room_height,
                        window_glass_type, window_to_wall_ratio, ventilation_system, wall_insulation_r_value, illuminance,
                        equipment_power_density, weekday_occupancy_start, weekday_occupancy_end, overhang_depth, thermal_mass, people_density, window_glass_coating){
    //Calculations
    var DEFAULT = "DEFAULT";
    //Create Instruction
    var MIT =

roof_type+ ' // typeOfRoof\r\n' +
roof_insulation_type+ ' // roofInsulationRValue\r\n' +
number_of_floors+ ' // numFloors\r\n' +
roof_insulation_location+ ' // roofInsulationLocation\r\n' +
"blue"+ ' // scenario\r\n' +
weather_epw_location+ ' // location\r\n' +
"one_sided"+ ' // typeOfSim\r\n' +
exterior_shading_orientation + ' // orientation\r\n' +
room_width+ ' // roomWidth\r\n' +
room_depth+ ' // roomDepth\r\n' +
room_height+ ' // roomHeight\r\n' +
room_width+ ' // buildingLengthA\r\n' +
room_depth+ ' // buildingLengthB\r\n' +
window_glass_type+ ' // typology\r\n' +
window_glass_coating+ ' // coating\r\n' +
window_to_wall_ratio+ ' // windowArea\r\n' +
"0"+ ' // cavityDepth\r\n' +
"0"+ ' // flowRate\r\n' +
"0"+ ' // freeFraction\r\n' +
""+ ' // ventSupply\r\n' +
""+ ' // ventExhaust\r\n' +
ventilation_system+ ' // ventilationType\r\n' +
"15"+ ' // airChangesOccupied\r\n' +
"1"+ ' // airChangesUnoccupied\r\n' +
wall_insulation_r_value+ ' // insulationRValue\r\n' +
people_density+ ' // occupancyLoad\r\n' +
illuminance+ ' // lightingLoad\r\n' +
equipment_power_density+ ' // equipmentLoad\r\n' +
"alwaysOn"+ ' // lightingControl\r\n' +
weekday_occupancy_start+ ' // startHour\r\n' +
weekday_occupancy_end+ ' // endHour\r\n' +
""+ ' // blindDaytimeSchedule\r\n' +
""+ ' // blindNighttimeSchedule\r\n' +
"90"+ ' // blindClosedAngle\r\n' +
"15"+ ' // blindWidth\r\n' +
"0.2"+ ' // blindEmissivity\r\n' +
"0.9"+ ' // blindAbsorptivity\r\n' +
thermal_mass+ ' // thermalMass\r\n' +
overhang_depth+ ' // overhangDepth\r\n' +
"0.6"+ ' // relHumidityMax\r\n' +
"26"+ ' // maxTempOccupied\r\n' +
"19"+ ' // minTempOccupied\r\n' +
"26"+ ' // maxTempUnoccupied\r\n' +
"19"+ ' // minTempUnoccupied\r\n' +
""+ ' // debugData\r\n' +
""+ ' // debugLighting\r\n' +
""+ ' // debugComfortRange\r\n' ;

fs.writeFile('../mit/' + BuildingInputName +'/'+  BuildingInputName +'_input.txt', MIT, function(error){
    if (error) throw error;
});

                        }