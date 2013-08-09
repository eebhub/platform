var fs = require("fs");

module.exports = {
    IBMbuildingData: function(ibmBuildingDataFileName, building_name, building_lat, building_long, orientation, building_length, building_width, building_height, gross_floor_area){
        var tab = '     ';
        var content = building_name + tab + building_lat + tab + building_long + tab + building_length + tab + building_width + tab + building_height + tab + gross_floor_area;
        fs.writeFileSync(ibmBuildingDataFileName, content);
        
    },
    IBMutilityData: function(ibmUtilityDataFileName, utility_startdate, electricity, gas){
        var tab = '     ';
        var content = "";
        for (var i=0; i<utility_startdate.length; i++) {
            content += utility_startdate[i] + tab + electricity[i] + tab + gas[i] + '\r\n';
        }
        fs.writeFileSync(ibmUtilityDataFileName, content);
    },
};