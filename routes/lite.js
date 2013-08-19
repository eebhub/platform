var fs = require("fs");
var liteins = require("../lib/IMTins.js");
var ibm = require("../lib/ibm.js");

module.exports = {
    imt: function(request, response) {
        var buildingName = request.body.building_name;
        var date = request.body.utility_startdate;
        var electricity = request.body.utility_electric;
        var ngas = request.body.utility_gas;
        
        var insFileName = buildingName + '.ins'
        var datFileName = buildingName + '.dat'
        var time = new Date().getTime();
        var path = './lite/imt/' + buildingName + time + '/';
        
        fs.mkdirSync(path);
        liteins.imtins(insFileName, datFileName, path);
         
        fs.readFile(path + insFileName, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(content, 'utf-8');
                }
            });
    },
    ibm: function(request, response){
        var building_name = request.body.building_name;
        var utility_startdate = request.body.utility_startdate;
        var utility_electric = request.body.utility_electric;
        var utility_gas = request.body.utility_gas;
        var orientation = request.body.orientation;
        var building_length = request.body.building_length;
        var building_width = request.body.building_width;
        var building_height = request.body.building_height;
        var gross_floor_area = request.body.gross_floor_area;
        //Location
        var building_lat = 42.00909;
        var building_long = 23.0909;
        
        //Path
        var time = new Date().getTime();
        var path = './lite/ibm/' + building_name + time + '/';
        fs.mkdirSync(path);
        
        //File Names
        var ibmBuildingDataFileName = path + building_name +  '_buildingData.txt';
        var ibmUtilityDataFileName = path + building_name +  '_utililtyData.txt';
        
        ibm.IBMbuildingData(ibmBuildingDataFileName, building_name, building_lat, building_long, orientation, building_length, building_width, building_height, gross_floor_area);
        ibm.IBMutilityData(ibmUtilityDataFileName, utility_startdate, utility_electric, utility_gas);
    }
};