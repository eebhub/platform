var fs = require('fs');

module.exports.MITinputFile = MITinputFile;

function MITinputFile(mitInputFileName){
    //Calculations
    var occupancy_load = number_of_occupants/gross_floor_area;
    var DEFAULT = "DEFAULT";
    
    //Create Instruction 
    var MIT = 

roof_type+ '  //  typeOfRoof\r\n' +
roof_insulation_type+ '  //  roofInsulationRValue\r\n' +
number_of_floors+ '  //  numFloors\r\n' +
roof_insulation_location+ '  //  roofInsulationLocation\r\n' +
DEFAULT+ '  //  scenario\r\n' +
state.city+ '  //  location\r\n' +
DEFAULT+ '  //  typeOfSim\r\n' +
orientation+ '  //  orientation\r\n' +
room_width+ '  //  roomWidth\r\n' +
room_depth+ '  //  roomDepth\r\n' +
room_height+ '  //  roomHeight\r\n' +
building_length+ '  //  buildingLengthA\r\n' +
building_width+ '  //  buildingLengthB\r\n' +
DEFAULT+ '  //  typology\r\n' +
DEFAULT+ '  //  coating\r\n' +
window_to_wall_ratio+ '  //  windowArea\r\n' +
DEFAULT+ '  //  cavityDepth\r\n' +
DEFAULT+ '  //  flowRate\r\n' +
DEFAULT+ '  //  freeFraction\r\n' +
DEFAULT+ '  //  ventSupply\r\n' +
DEFAULT+ '  //  ventExhaust\r\n' +
ventilation_system+ '  //  ventilationType\r\n' +
DEFAULT+ '  //  airChangesOccupied\r\n' +
DEFAULT+ '  //  airChangesUnoccupied\r\n' +
wall_r_value+ '  //  insulationRValue\r\n' +
occupant_load+ '  //  occupancyLoad\r\n' +
lighting_power_density+ '  //  lightingLoad\r\n' +
equipment_power_density+ '  //  equipmentLoad\r\n' +
DEFAULT+ '  //  lightingControl\r\n' +
weekday_occupancy_start+ '  //  startHour\r\n' +
weekday_occupancy_end+ '  //  endHour\r\n' +
DEFAULT+ '  //  blindDaytimeSchedule\r\n' +
DEFAULT+ '  //  blindNighttimeSchedule\r\n' +
DEFAULT+ '  //  blindClosedAngle\r\n' +
DEFAULT+ '  //  blindWidth\r\n' +
DEFAULT+ '  //  blindEmissivity\r\n' +
DEFAULT+ '  //  blindAbsorptivity\r\n' +
DEFAULT+ '  //  thermalMass\r\n' +
overhang_depth+ '  //  overhangDepth\r\n' +
DEFAULT+ '  //  relHumidityMax\r\n' +
DEFAULT+ '  //  maxTempOccupied\r\n' +
DEFAULT+ '  //  minTempOccupied\r\n' +
DEFAULT+ '  //  maxTempUnoccupied\r\n' +
DEFAULT+ '  //  minTempUnoccupied\r\n' +
DEFAULT+ '  //  debugData\r\n' +
DEFAULT+ '  //  debugLighting\r\n' +
DEFAULT+ '  //  debugComfortRange\r\n' ;

    
    //Write File
    fs.writeFile(mitInputFileName, MIT, Function(error){
                 if (error) throw error;
});
    
};
