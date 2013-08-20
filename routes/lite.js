var fs = require("fs");
var ibm = require("../lib/ibm.js");
//Calling Module Pieces of IMT in /lib/imt/
var createTimestamp = require("../lib/timestamp.js").createTimestamp;
var utilities = require("../lib/imt/utilities");
var determineAirportCode = require("../lib/imt/airportCodes").determineAirportCode;
var getWeatherData = require("../lib/imt/meanTemperature.js").getWeatherData;
var writeFiles = require("../lib/imt/writeFiles.js");
var executeIMT = require("../lib/imt/executeIMT.js").executeIMT;
var parseIMT = require("../lib/imt/parseIMTOutput.js").parseIMT;
var imtCalculations = require("../lib/imt/imtCalculations.js");

module.exports = {
    runIMT: function(request, response) {
        //Get User Inputs
        var building_name = request.body.building_name;
        var building_location = request.body.weather_epw_location;
        var building_function = request.body.activity_type;
        var building_size = request.body.gross_floor_area;
        var utility_gas = request.body.utility_gas;
        var utility_electric = request.body.utility_electric;
        var utility_startdate = request.body.utility_startdate;
        var building_year = request.body.year_completed;

        //Make Timespamp
        var timestamp = createTimestamp();

        //Create Instruction, Data, Output, and Results File Names
        var insFileName = building_name + '_ins_' + timestamp + '.txt';
        var dataFileName = building_name + '_dat_' + timestamp + '.txt';
        var outFileName = building_name + '_out_' + timestamp + '.txt';
        var resFileName = building_name + '_res_' + timestamp + '.txt';
        //Convert Utilities to kBTU and combine and figure EnergyPerDay
        var utilities_kBTU = utilities.convertUtilities(utility_electric, utility_gas);
        var total_utility_energykBTU = utilities.combineUtilities(utilities_kBTU[0], utilities_kBTU[1]);
        var energyPerDay = utilities.energyPerDay(total_utility_energykBTU, utility_startdate);
        //Get Airport Code
        var airportCode = determineAirportCode(building_location);
        //Get Weather Data
        getWeatherData(utility_startdate, airportCode, function(weatherData) {
            console.log(weatherData);
            writeFiles.writeIns(insFileName, dataFileName);
            writeFiles.writeData(dataFileName, energyPerDay, weatherData, function() {
                executeIMT(insFileName, outFileName, resFileName, function() {
                    writeFiles.moveFiles(insFileName, dataFileName, outFileName, resFileName, function() {
                        console.log('moved Files');
                        parseIMT(resFileName, outFileName, function(results) {
                            var resultsIMT = results[0];
                            var outputs = results[1];
                            console.log(outputs);
                            var Ycp = outputs[0],
                                LS = outputs[1],
                                RS = outputs[2],
                                Xcp1 = outputs[3],
                                Xcp2 = outputs[4];
                            imtCalculations.calcSiteEUI(utility_startdate, total_utility_energykBTU, building_size, function(EUI) {
                                console.log(EUI);
                                var temperatures = results[0][0];
                                total_utility_energykBTU.pop(),
                                response.render('imtresults', {
                                    'building_name': building_name,
                                    'EUI': EUI,
                                    'utility_startdate': utility_startdate,
                                    'temperatures': temperatures,
                                    'energy': total_utility_energykBTU,
                                    'Ycp': Ycp,
                                    'LS': LS,
                                    'RS': RS,
                                    'Xcp1': Xcp1,
                                    'Xcp2': Xcp2,
                                    'insFile': 'http://developer.eebhub.org/imt/inputs/' + insFileName,
                                    'datFile': 'http://developer.eebhub.org/imt/inputs/' + dataFileName,
                                    'outFile': 'http://developer.eebhub.org/imt/outputs/' + outFileName,
                                    'resFile': 'http://developer.eebhub.org/imt/outputs/' + resFileName,
                                    'building_year': building_year,
                                    'building_function': building_function,
                                    'building_location': building_location,
                                });

                            });
                        });
                    });


                });
            });
        });
    },
    ibm: function(request, response) {
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
        var ibmBuildingDataFileName = path + building_name + '_buildingData.txt';
        var ibmUtilityDataFileName = path + building_name + '_utililtyData.txt';

        ibm.IBMbuildingData(ibmBuildingDataFileName, building_name, building_lat, building_long, orientation, building_length, building_width, building_height, gross_floor_area);
        ibm.IBMutilityData(ibmUtilityDataFileName, utility_startdate, utility_electric, utility_gas);
    }
};