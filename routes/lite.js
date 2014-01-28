var fs = require("fs");
var ibm = require("../lib/ibm.js");
//Calling Module Pieces of IMT in /lib/imt/
var createTimestamp = require("../lib/timestamp.js").createTimestamp;
//Dependencies
var createTimestamp = require("../lib/timestamp.js").createTimestamp;
var imt = require("../lib/imt/imt.js");
var fs = require('fs');
var async = require('async');

module.exports = {
    getLite: function(request, response) {
        response.sendfile('./views/lite.html');
    },

    getLiteConversion: function(request, response) {
        response.sendfile('./views/lite-conversion.html');
    },
    
    runLiteConversion: function(request, response){
        console.log(request.body);    
    },

    runIMT: function(request, response) {
        //Check for SI Units and Convert
        console.log(request.body);
        console.log(request.files);
        var unit = request.body.unit;
        var building_size = request.body.gross_floor_area;
        if(unit=='ip') { var building_size_f = parseFloat(building_size);building_size_f = 0.09*building_size_f; building_size = building_size_f.toString();}
        //Get User Inputs
        var building_name = request.body.building_name.replace(/\s+/g, '') || "NoName";
        var building_location = request.body.weather_epw_location;
        var building_function = request.body.activity_type;
        //var building_size = request.body.gross_floor_area;
        
        var elec_unit = request.body.elec_unit;
        var gas_unit = request.body.gas_unit;
        
        //utility data input text area
        var utility_gas = [];
        var utility_electric = [];
        var electric_utility_startdate = [];
        var gas_utility_startdate = [];
        
        // if ((request.body.utility_electric[0]=='')||(request.body.utility_gas[0]=='')){
        // var utility_data_time_series = request.body.utility_data_time_series;
        // var utility_rows = utility_data_time_series.split("\r\n");
        // for (var i=1; i<utility_rows.length;i++){
        //     console.log(utility_rows[i]);
        //     var row_split = utility_rows[i].split("\t");
        //     electric_utility_startdate.push(row_split[0]);
        //     utility_electric.push(row_split[1]);
        //     gas_utility_startdate.push(row_split[2]);
        //     utility_gas.push(row_split[3]);
        // }
        // utility_electric.pop();
        // utility_gas.pop();
        // console.log(electric_utility_startdate);
        // console.log(utility_electric);
        // console.log(gas_utility_startdate);
        // console.log(utility_gas);
        
        // }else{

        // utility_gas = request.body.utility_gas;
        // utility_electric = request.body.utility_electric;
        // electric_utility_startdate = request.body.electric_utility_startdate;
        // gas_utility_startdate = request.body.gas_utility_startdate;
        
        // }
        
        
    electric_utility_startdate = ['2012-01-01', '2012-02-01', '2012-03-01', '2012-04-01', '2012-05-01', '2012-06-01', '2012-07-01', '2012-08-01', '2012-09-01', '2012-10-01', '2012-11-01', '2012-12-01', '2012-12-31'];
    //utility_electric = [65280, 50400, 54600, 68160, 72240, 89280, 100560, 131400, 111000, 89880, 89040, 66120],
    gas_utility_startdate = ['2012-01-26', '2012-02-24', '2012-03-27', '2012-04-27', '2012-05-27', '2012-06-27', '2012-07-27', '2012-08-27', '2012-09-27', '2012-10-27', '2012-11-27', '2012-12-27', '2013-01-27'];
    //utility_gas = [3641, 2166, 1019, 923, 30.5, 34.5, 85.7, 38.7, 989.7, 2824, 2385, 3500];

        var year_completed = request.body.year_completed;

        //Make Timespamp
        var timestamp = createTimestamp();

        //Create Instruction, Data, Output, and Results File Names
        var insFileNameElectric = building_name + '_e_ins_' + timestamp + '.txt';
        var insFileNameGas = building_name + '_g_ins_' + timestamp + '.txt';
        var dataFileNameElectric = building_name + '_e_dat_' + timestamp + '.txt';
        var dataFileNameGas = building_name + '_g_dat_' + timestamp + '.txt';
        var outFileNameElectric = building_name + '_e_out_' + timestamp + '.txt';
        var outFileNameGas = building_name + '_g_out_' + timestamp + '.txt';
        var resFileNameElectric = building_name + '_e_res_' + timestamp + '.txt';
        var resFileNameGas = building_name + '_g_res_' + timestamp + '.txt';
        //Folder path and new File Path
        var folderPath = '../imt/' + building_name + "_" + timestamp;
        var filePath = '../imt/' + building_name + "_" + timestamp + '/';
        //Create input and output folders
        fs.mkdir(folderPath);
        
        //process utility datafile
        fs.readFile(request.files.utilityDataFile.path, function (err, data) {

            var newPath = folderPath + "/"+request.files.utilityDataFile.name;
            fs.writeFile(newPath, data, function (err) {
            //if (err) throw err;
            if (err) {//utility_electric = [65280, 50400, 54600, 68160, 72240, 89280, 100560, 131400, 111000, 89880, 89040, 66120];
                      //utility_gas = [3641, 2166, 1019, 923, 30.5, 34.5, 85.7, 38.7, 989.7, 2824, 2385, 3500];
                      utility_electric = request.body.utility_electric;
                      utility_gas = request.body.utility_gas;
                      }
            else {console.log('file uploaded');
             var xlsx = require('node-xlsx');
            var utility_data = xlsx.parse(newPath); 
            var elec_data1 = utility_data.worksheets[0].data[1][2].value;
            var elec_data2 = utility_data.worksheets[0].data[2][2].value;
            var elec_data3 = utility_data.worksheets[0].data[3][2].value;
            var elec_data4 = utility_data.worksheets[0].data[4][2].value;
            var elec_data5 = utility_data.worksheets[0].data[5][2].value;
            var elec_data6 = utility_data.worksheets[0].data[6][2].value;
            var elec_data7 = utility_data.worksheets[0].data[7][2].value;
            var elec_data8 = utility_data.worksheets[0].data[8][2].value;
            var elec_data9 = utility_data.worksheets[0].data[9][2].value;
            var elec_data10 = utility_data.worksheets[0].data[10][2].value;
            var elec_data11 = utility_data.worksheets[0].data[11][2].value;
            var elec_data12 = utility_data.worksheets[0].data[12][2].value;
            utility_electric = [elec_data1, elec_data2, elec_data3, elec_data4, elec_data5, elec_data6, elec_data7, elec_data8, elec_data9, elec_data10, elec_data11, elec_data12];
            console.log(utility_electric);
            //console.log(utility_data);
            var gas_data1 = utility_data.worksheets[2].data[1][2].value;
            var gas_data2 = utility_data.worksheets[2].data[2][2].value;
            var gas_data3 = utility_data.worksheets[2].data[3][2].value;
            var gas_data4 = utility_data.worksheets[2].data[4][2].value;
            var gas_data5 = utility_data.worksheets[2].data[5][2].value;
            var gas_data6 = utility_data.worksheets[2].data[6][2].value;
            var gas_data7 = utility_data.worksheets[2].data[7][2].value;
            var gas_data8 = utility_data.worksheets[2].data[8][2].value;
            var gas_data9 = utility_data.worksheets[2].data[9][2].value;
            var gas_data10 = utility_data.worksheets[2].data[10][2].value;
            var gas_data11 = utility_data.worksheets[2].data[11][2].value;
            var gas_data12 = utility_data.worksheets[2].data[12][2].value;
            utility_gas = [gas_data1, gas_data2, gas_data3, gas_data4, gas_data5, gas_data6, gas_data7, gas_data8, gas_data9, gas_data10, gas_data11, gas_data12];
            console.log(utility_gas);
            }
        
           if (elec_unit=='kBTU'){
                for (var i=0; i< utility_electric.length; i++){
                    utility_electric[i] = utility_electric[i]/3.41;
                }
            }else if (elec_unit=='MJ'){
                for (var i=0; i< utility_electric.length; i++){
                    utility_electric[i] = utility_electric[i]/3.6;
                }
            }
            
            if (gas_unit=='Therm'){
                for (var i=0; i< utility_gas.length; i++){
                    utility_gas[i] = utility_gas[i]/1.023;
                }
            }
            
        //Get Building Type EUI
        var buildingTypeEUI = imt.buildingEUI(building_function);

        //Get Airport Code from building Location
        var airportCode = imt.determineAirportCode(building_location);

        //Start If statements for 3ph/c (electric and gas) and 5p (electric only)
        if (utility_gas[1] === '') {
            //Just electricity run 5p
            //Convert kWh to kBTU
            var utility_electric_kBTU = imt.convertElectricity(utility_electric);
            //Calculate Per Day use
            var utility_perDay_electric_kBTU = imt.energyPerDay(utility_electric, electric_utility_startdate);

            //Get Weather Data
            imt.getWeatherData(electric_utility_startdate, airportCode, function(weatherData) {
                imt.writeIns5p(insFileNameElectric, dataFileNameElectric);
                imt.writeData(dataFileNameElectric, utility_perDay_electric_kBTU, weatherData, function() {
                    imt.executeIMT(insFileNameElectric, outFileNameElectric, resFileNameElectric, function() {
                        imt.moveFiles(insFileNameElectric, dataFileNameElectric, outFileNameElectric, resFileNameElectric, filePath, function() {
                            imt.parseIMT5p(resFileNameElectric, outFileNameElectric, filePath, function(parsedResults) {
                                var resultsIMT = parsedResults[0];
                                var outputs = parsedResults[1];
                                var Ycp = outputs[0],
                                    LS = outputs[1],
                                    RS = outputs[2],
                                    Xcp1 = outputs[3],
                                    Xcp2 = outputs[4];
                                var temperatures = resultsIMT[0];
                                var X1 = Math.min.apply(null, temperatures);
                                var X2 = Math.max.apply(null, temperatures);
                                var Y1 = (LS * X1) + Ycp;
                                var Y2 = (RS * X2) + Ycp;
                                imt.calcSiteEUI(electric_utility_startdate, utility_electric_kBTU, building_size, function(EUI) {
                                    //Calc Source EUI
                                    var EUI_source = parseFloat(EUI) * 3.14;
                                    //Calc Utility Cost
                                    
                                    response.render('imtresults_5p', {
                                        //Building
                                        'building_name': building_name,
                                        'year_completed': year_completed,
                                        'building_function': building_function,
                                        'building_location': building_location,
                                        'EUI': EUI,
                                        'EUI_source': EUI_source,
                                        'buildingTypeEUI': buildingTypeEUI,
                                        'electric_utility_startdate': electric_utility_startdate,
                                        'temperatures': temperatures,
                                        'energy': utility_electric_kBTU,
                                        'Ycp': Ycp,
                                        'LS': LS,
                                        'RS': RS,
                                        'Xcp1': Xcp1,
                                        'Xcp2': Xcp2,
                                        'Y1': Y1,
                                        'Y2': Y2,
                                        'X1': X1,
                                        'X2': X2,
                                        'insFile': 'http://developer.eebhub.org/imt/intputs/' + insFileNameElectric,
                                        'datFile': 'http://developer.eebhub.org/imt/inputs/' + dataFileNameElectric,
                                        'outFile': 'http://developer.eebhub.org/imt/outputs/' + outFileNameElectric,
                                        'resFile': 'http://developer.eebhub.org/imt/outputs/' + resFileNameElectric,
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
        else {
            //Have seperate runs of 3p for cooling (elect) and heating (gas)
            //Convert utilities to kBTU
            var utility_electric_kBTU_dual = imt.convertElectricity(utility_electric);
            var utility_gas_kBTU_dual = imt.convertGas(utility_gas);
            //Calculate Per Day use
            var utility_perDay_electric_kBTU_dual = imt.energyPerDay(utility_electric_kBTU_dual, electric_utility_startdate);
            var utility_perDay_gas_kBTU_dual = imt.energyPerDay(utility_gas_kBTU_dual, gas_utility_startdate);
            //Parallel runs of IMT
            async.parallel([
            //Electic Run 3PC
            function(callback) {
                imt.getWeatherData(electric_utility_startdate, airportCode, function(weatherData_elect) {
                    imt.writeIns3pc(insFileNameElectric, dataFileNameElectric);
                    imt.writeData(dataFileNameElectric, utility_perDay_electric_kBTU_dual, weatherData_elect, function() {
                        imt.executeIMT(insFileNameElectric, outFileNameElectric, resFileNameElectric, function() {
                            imt.moveFiles(insFileNameElectric, dataFileNameElectric, outFileNameElectric, resFileNameElectric, filePath, function() {
                                imt.parseIMT3p(resFileNameElectric, outFileNameElectric, filePath, function(parsedResults) {
                                    var IMTresults_electric = parsedResults[0];
                                    var outputs_electric = parsedResults[1];
                                    imt.calcSiteEUI(electric_utility_startdate, utility_electric_kBTU_dual, building_size, function(EUI_electric) {
                                        var EUI_electric_source = parseFloat(EUI_electric) * 3.14;
                                        callback(null, [EUI_electric, IMTresults_electric, outputs_electric,EUI_electric_source]);
                                    });

                                });
                            });
                        });
                    });
                });
            },
            //Gas run 3PH
            function(callback) {
                imt.getWeatherData(gas_utility_startdate, airportCode, function(weatherData_gas) {
                    imt.writeIns3ph(insFileNameGas, dataFileNameGas);
                    imt.writeData(dataFileNameGas, utility_perDay_gas_kBTU_dual, weatherData_gas, function() {
                        imt.executeIMT(insFileNameGas, outFileNameGas, resFileNameGas, function() {
                            imt.moveFiles(insFileNameGas, dataFileNameGas, outFileNameGas, resFileNameGas, filePath, function() {
                                imt.parseIMT3p(resFileNameGas, outFileNameGas, filePath, function(parsedResults) {
                                    var IMTresults_gas = parsedResults[0];
                                    var outputs_gas = parsedResults[1];
                                    imt.calcSiteEUI(gas_utility_startdate, utility_gas_kBTU_dual, building_size, function(EUI_gas) {
                                        //Source EUI
                                        var EUI_gas_source = parseFloat(EUI_gas) * 1.05;
                                        callback(null, [EUI_gas, IMTresults_gas, outputs_gas,EUI_gas_source]);
                                    });
                                });
                            });
                        });
                    });
                });
            }],
            // oasync callback
            function(err, results) {
                //Seperate Results
                var electric = results[0];
                var gas = results[1];
                //EUI
                var EUI_gas = parseFloat(gas[0]);
                var EUI_electric = parseFloat(electric[0]);
                var totalEUI = EUI_gas + EUI_electric;
                //EUI Source
                var totalEUI_source = parseFloat(gas[3]) + parseFloat(electric[3]);
                console.log(totalEUI_source);
                //Temperature, Period, Utility Use Graph
                var temperatures_electric = electric[1][0];
                //Regression Plot
                //Gas
                var Ycp_gas = gas[2][0],
                    LS_gas = gas[2][1],
                    RS_gas = gas[2][2],
                    Xcp_gas = gas[2][3];
                var X_min_gas = Math.min.apply(null, gas[1][0]);
                var X_max_gas = Math.max.apply(null, gas[1][0]);
                var Y_intercept_gas = Ycp_gas - (LS_gas * Xcp_gas);
                var Y_gas = LS_gas * X_min_gas + Y_intercept_gas;
                //Electric
                var Ycp_electric = electric[2][0],
                    LS_electric = electric[2][1],
                    RS_electric = electric[2][2],
                    Xcp_electric = electric[2][3];
                var X_min_electric = Math.min.apply(null, electric[1][0]);
                var X_max_electric = Math.max.apply(null, electric[1][0]);
                var Y_intercept_electric = Ycp_electric - (LS_gas * Xcp_electric);
                var Y_electric = LS_electric * X_max_electric + Y_intercept_electric;
                
                var elec_res = electric[1][3];
                var elec_1 = electric[1][1];
                var gas_res = gas[1][3];
                var gas_1 = gas[1][1];
                var sum_1 = 0;
                var sum_2 = 0;
                var sum_3 = 0;
                for (var i=0; i< elec_res.length; i++){
                    sum_1 = sum_1 + elec_res[i]*elec_res[i];
                    sum_2 = sum_2 + elec_1[i];
                    sum_3 = sum_3 + elec_res[i];
                }
                var cv_elec = Math.round(Math.sqrt(sum_1/11)/(sum_2/12)*100);
                var nmbe_elec = Math.round(sum_3/11/(sum_2/12)*100);
                 sum_1 = 0;
                 sum_2 = 0;
                 sum_3 = 0;
                for (i=0; i< gas_res.length; i++){
                    sum_1 = sum_1 + gas_res[i]*gas_res[i];
                    sum_2 = sum_2 + gas_1[i];
                    sum_3 = sum_3 + gas_res[i];
                }
                var cv_gas = Math.round(Math.sqrt(sum_1/11)/(sum_2/12)*100);
                var nmbe_gas = Math.round(sum_3/11/(sum_2/12)*100);
                
                response.render('imtresults_3p', {
                    //Building
                    'username': request.session.username,
                    'building_name': building_name,
                    'year_completed': year_completed,
                    'building_function': building_function,
                    'building_location': building_location,
                    //EUI
                    'EUI': totalEUI,
                    'buildingTypeEUI': buildingTypeEUI,
                    'EUI_source': totalEUI_source,
                    
                    //Temp vs Utility
                    'electric_utility_startdate': electric_utility_startdate,
                    'temperatures': temperatures_electric,
                    'utility_electric': electric[1][1],
                    'utility_gas': gas[1][1],

                    //Regression Plots
                    //Gas
                    'X_min_gas': X_min_gas,
                    'X_max_gas': X_max_gas,
                    'Xcp_gas': Xcp_gas,
                    'Ycp_gas': Ycp_gas,
                    'Y_gas': Y_gas,
                    //Electric
                    'X_min_electric': X_min_electric,
                    'X_max_electric': X_max_electric,
                    'Xcp_electric': Xcp_electric,
                    'Ycp_electric': Ycp_electric,
                    'Y_electric': Y_electric,
                    //uncertainty index cv & nmbe
                    'cv_elec': cv_elec,
                    'nmbe_elec': nmbe_elec,
                    'cv_gas': cv_gas,
                    'nmbe_gas': nmbe_gas,
                    //File Links
                    'insFileElectric': 'http://developer.eebhub.org/imt/'+building_name + "_" + timestamp + '/'+insFileNameElectric,
                    'datFileElectric': 'http://developer.eebhub.org/imt/' +building_name + "_" + timestamp + '/'+ dataFileNameElectric,
                    'outFileElectric': 'http://developer.eebhub.org/imt/' +building_name + "_" + timestamp + '/'+ outFileNameElectric,
                    'resFileElectric': 'http://developer.eebhub.org/imt/' +building_name + "_" + timestamp + '/'+ resFileNameElectric,
                    'insFileGas': 'http://developer.eebhub.org/imt/' +building_name + "_" + timestamp + '/'+ insFileNameGas,
                    'datFileGas': 'http://developer.eebhub.org/imt/' +building_name + "_" + timestamp + '/'+ dataFileNameGas,
                    'outFileGas': 'http://developer.eebhub.org/imt/' +building_name + "_" + timestamp + '/'+ outFileNameGas,
                    'resFileGas': 'http://developer.eebhub.org/imt/' +building_name + "_" + timestamp + '/'+ resFileNameGas,
                });
            });

        }
            
            
            
            
            });
        });

        // //Get Building Type EUI
        // var buildingTypeEUI = imt.buildingEUI(building_function);

        // //Get Airport Code from building Location
        // var airportCode = imt.determineAirportCode(building_location);

        // //Start If statements for 3ph/c (electric and gas) and 5p (electric only)
        // if (utility_gas[1] === '') {
        //     //Just electricity run 5p
        //     //Convert kWh to kBTU
        //     var utility_electric_kBTU = imt.convertElectricity(utility_electric);
        //     //Calculate Per Day use
        //     var utility_perDay_electric_kBTU = imt.energyPerDay(utility_electric, electric_utility_startdate);

        //     //Get Weather Data
        //     imt.getWeatherData(electric_utility_startdate, airportCode, function(weatherData) {
        //         imt.writeIns5p(insFileNameElectric, dataFileNameElectric);
        //         imt.writeData(dataFileNameElectric, utility_perDay_electric_kBTU, weatherData, function() {
        //             imt.executeIMT(insFileNameElectric, outFileNameElectric, resFileNameElectric, function() {
        //                 imt.moveFiles(insFileNameElectric, dataFileNameElectric, outFileNameElectric, resFileNameElectric, filePath, function() {
        //                     imt.parseIMT5p(resFileNameElectric, outFileNameElectric, filePath, function(parsedResults) {
        //                         var resultsIMT = parsedResults[0];
        //                         var outputs = parsedResults[1];
        //                         var Ycp = outputs[0],
        //                             LS = outputs[1],
        //                             RS = outputs[2],
        //                             Xcp1 = outputs[3],
        //                             Xcp2 = outputs[4];
        //                         var temperatures = resultsIMT[0];
        //                         var X1 = Math.min.apply(null, temperatures);
        //                         var X2 = Math.max.apply(null, temperatures);
        //                         var Y1 = (LS * X1) + Ycp;
        //                         var Y2 = (RS * X2) + Ycp;
        //                         imt.calcSiteEUI(electric_utility_startdate, utility_electric_kBTU, building_size, function(EUI) {
        //                             //Calc Source EUI
        //                             var EUI_source = parseFloat(EUI) * 3.14;
        //                             //Calc Utility Cost
                                    
        //                             response.render('imtresults_5p', {
        //                                 //Building
        //                                 'building_name': building_name,
        //                                 'year_completed': year_completed,
        //                                 'building_function': building_function,
        //                                 'building_location': building_location,
        //                                 'EUI': EUI,
        //                                 'EUI_source': EUI_source,
        //                                 'buildingTypeEUI': buildingTypeEUI,
        //                                 'electric_utility_startdate': electric_utility_startdate,
        //                                 'temperatures': temperatures,
        //                                 'energy': utility_electric_kBTU,
        //                                 'Ycp': Ycp,
        //                                 'LS': LS,
        //                                 'RS': RS,
        //                                 'Xcp1': Xcp1,
        //                                 'Xcp2': Xcp2,
        //                                 'Y1': Y1,
        //                                 'Y2': Y2,
        //                                 'X1': X1,
        //                                 'X2': X2,
        //                                 'insFile': 'http://developer.eebhub.org/imt/intputs/' + insFileNameElectric,
        //                                 'datFile': 'http://developer.eebhub.org/imt/inputs/' + dataFileNameElectric,
        //                                 'outFile': 'http://developer.eebhub.org/imt/outputs/' + outFileNameElectric,
        //                                 'resFile': 'http://developer.eebhub.org/imt/outputs/' + resFileNameElectric,
        //                             });
        //                         });
        //                     });
        //                 });
        //             });
        //         });
        //     });
        // }
        // else {
        //     //Have seperate runs of 3p for cooling (elect) and heating (gas)
        //     //Convert utilities to kBTU
        //     var utility_electric_kBTU_dual = imt.convertElectricity(utility_electric);
        //     var utility_gas_kBTU_dual = imt.convertGas(utility_gas);
        //     //Calculate Per Day use
        //     var utility_perDay_electric_kBTU_dual = imt.energyPerDay(utility_electric_kBTU_dual, electric_utility_startdate);
        //     var utility_perDay_gas_kBTU_dual = imt.energyPerDay(utility_gas_kBTU_dual, gas_utility_startdate);
        //     //Parallel runs of IMT
        //     async.parallel([
        //     //Electic Run 3PC
        //     function(callback) {
        //         imt.getWeatherData(electric_utility_startdate, airportCode, function(weatherData_elect) {
        //             imt.writeIns3pc(insFileNameElectric, dataFileNameElectric);
        //             imt.writeData(dataFileNameElectric, utility_perDay_electric_kBTU_dual, weatherData_elect, function() {
        //                 imt.executeIMT(insFileNameElectric, outFileNameElectric, resFileNameElectric, function() {
        //                     imt.moveFiles(insFileNameElectric, dataFileNameElectric, outFileNameElectric, resFileNameElectric, filePath, function() {
        //                         imt.parseIMT3p(resFileNameElectric, outFileNameElectric, filePath, function(parsedResults) {
        //                             var IMTresults_electric = parsedResults[0];
        //                             var outputs_electric = parsedResults[1];
        //                             imt.calcSiteEUI(electric_utility_startdate, utility_electric_kBTU_dual, building_size, function(EUI_electric) {
        //                                 var EUI_electric_source = parseFloat(EUI_electric) * 3.14;
        //                                 callback(null, [EUI_electric, IMTresults_electric, outputs_electric,EUI_electric_source]);
        //                             });

        //                         });
        //                     });
        //                 });
        //             });
        //         });
        //     },
        //     //Gas run 3PH
        //     function(callback) {
        //         imt.getWeatherData(gas_utility_startdate, airportCode, function(weatherData_gas) {
        //             imt.writeIns3ph(insFileNameGas, dataFileNameGas);
        //             imt.writeData(dataFileNameGas, utility_perDay_gas_kBTU_dual, weatherData_gas, function() {
        //                 imt.executeIMT(insFileNameGas, outFileNameGas, resFileNameGas, function() {
        //                     imt.moveFiles(insFileNameGas, dataFileNameGas, outFileNameGas, resFileNameGas, filePath, function() {
        //                         imt.parseIMT3p(resFileNameGas, outFileNameGas, filePath, function(parsedResults) {
        //                             var IMTresults_gas = parsedResults[0];
        //                             var outputs_gas = parsedResults[1];
        //                             imt.calcSiteEUI(gas_utility_startdate, utility_gas_kBTU_dual, building_size, function(EUI_gas) {
        //                                 //Source EUI
        //                                 var EUI_gas_source = parseFloat(EUI_gas) * 1.05;
        //                                 callback(null, [EUI_gas, IMTresults_gas, outputs_gas,EUI_gas_source]);
        //                             });
        //                         });
        //                     });
        //                 });
        //             });
        //         });
        //     }],
        //     // oasync callback
        //     function(err, results) {
        //         //Seperate Results
        //         var electric = results[0];
        //         var gas = results[1];
        //         //EUI
        //         var EUI_gas = parseFloat(gas[0]);
        //         var EUI_electric = parseFloat(electric[0]);
        //         var totalEUI = EUI_gas + EUI_electric;
        //         //EUI Source
        //         var totalEUI_source = parseFloat(gas[3]) + parseFloat(electric[3]);
        //         console.log(totalEUI_source);
        //         //Temperature, Period, Utility Use Graph
        //         var temperatures_electric = electric[1][0];
        //         //Regression Plot
        //         //Gas
        //         var Ycp_gas = gas[2][0],
        //             LS_gas = gas[2][1],
        //             RS_gas = gas[2][2],
        //             Xcp_gas = gas[2][3];
        //         var X_min_gas = Math.min.apply(null, gas[1][0]);
        //         var X_max_gas = Math.max.apply(null, gas[1][0]);
        //         var Y_intercept_gas = Ycp_gas - (LS_gas * Xcp_gas);
        //         var Y_gas = LS_gas * X_min_gas + Y_intercept_gas;
        //         //Electric
        //         var Ycp_electric = electric[2][0],
        //             LS_electric = electric[2][1],
        //             RS_electric = electric[2][2],
        //             Xcp_electric = electric[2][3];
        //         var X_min_electric = Math.min.apply(null, electric[1][0]);
        //         var X_max_electric = Math.max.apply(null, electric[1][0]);
        //         var Y_intercept_electric = Ycp_electric - (LS_gas * Xcp_electric);
        //         var Y_electric = LS_electric * X_max_electric + Y_intercept_electric;
        //         response.render('imtresults_3p', {
        //             //Building
        //             'username': request.session.username,
        //             'building_name': building_name,
        //             'year_completed': year_completed,
        //             'building_function': building_function,
        //             'building_location': building_location,
        //             //EUI
        //             'EUI': totalEUI,
        //             'buildingTypeEUI': buildingTypeEUI,
        //             'EUI_source': totalEUI_source,
                    
        //             //Temp vs Utility
        //             'electric_utility_startdate': electric_utility_startdate,
        //             'temperatures': temperatures_electric,
        //             'utility_electric': electric[1][1],
        //             'utility_gas': gas[1][1],

        //             //Regression Plots
        //             //Gas
        //             'X_min_gas': X_min_gas,
        //             'X_max_gas': X_max_gas,
        //             'Xcp_gas': Xcp_gas,
        //             'Ycp_gas': Ycp_gas,
        //             'Y_gas': Y_gas,
        //             //Electric
        //             'X_min_electric': X_min_electric,
        //             'X_max_electric': X_max_electric,
        //             'Xcp_electric': Xcp_electric,
        //             'Ycp_electric': Ycp_electric,
        //             'Y_electric': Y_electric,
        //             //File Links
        //             'insFileElectric': 'http://developer.eebhub.org/imt/intputs/' + insFileNameElectric,
        //             'datFileElectric': 'http://developer.eebhub.org/imt/inputs/' + dataFileNameElectric,
        //             'outFileElectric': 'http://developer.eebhub.org/imt/outputs/' + outFileNameElectric,
        //             'resFileElectric': 'http://developer.eebhub.org/imt/outputs/' + resFileNameElectric,
        //             'insFileGas': 'http://developer.eebhub.org/imt/intputs/' + insFileNameGas,
        //             'datFileGas': 'http://developer.eebhub.org/imt/inputs/' + dataFileNameGas,
        //             'outFileGas': 'http://developer.eebhub.org/imt/outputs/' + outFileNameGas,
        //             'resFileGas': 'http://developer.eebhub.org/imt/outputs/' + resFileNameGas,
        //         });
        //     });

        // }

    },
    ibm: function(request, response) {
        //pre-process dual unit conversion
        var building_length = request.body.building_length;
        var building_width = request.body.building_width;
        var building_height = request.body.building_height;
        var gross_floor_area = request.body.gross_floor_area;
        
        var unit = request.body.unit;
        if(unit=='ip'){
            var gross_floor_area_f = parseFloat(gross_floor_area);gross_floor_area_f = 0.09*gross_floor_area_f; gross_floor_area = gross_floor_area_f.toString();
            var building_width_f = parseFloat(building_width);building_width_f = 0.3*building_width_f; building_width = building_width.toString();
            var building_height_f = parseFloat(building_height);building_height_f = 0.3*building_height_f; building_height = building_height_f.toString();
            var building_length_f = parseFloat(building_length);building_length_f = 0.3*building_length_f; building_length = building_length_f.toString();
        
            
        }
        
        
        //Get User Inputs
        var building_name = request.body.building_name.replace(/\s+/g, '') || "NoName";;
        var electric_utility_startdate = request.body.electric_utility_startdate;
        var utility_electric = request.body.utility_electric;
        var utility_gas = request.body.utility_gas;
        var orientation = request.body.building_orientation;
        // var building_length = request.body.building_length;
        // var building_width = request.body.building_width;
        // var building_height = request.body.building_height;
        // var gross_floor_area = request.body.gross_floor_area;
        var building_location_address = request.body.building_location_address;
        var building_location_city = request.body.building_location_city;
        var building_location_state = request.body.building_location_state;
        var window_to_wall_ratio = request.body.window_to_wall_ratio;

        //Location



        //Create Timestamp
        var timestamp = createTimestamp();
        //File paths 
        var folderPath = '../ibm/';
        var filePath = folderPath + building_name + timestamp + '/';
        //File Names
        var ibmBuildingDataFileName = filePath + building_name + timestamp + '_buildingData.csv';
        var ibmUtilityDataFileName = filePath + building_name + timestamp + '_utilityData.csv';

        //Make Simulation Run Folder
        ibm.geoCode(building_location_address, building_location_city, building_location_state, function(building_lat, building_long) {
            fs.mkdir(folderPath + building_name + timestamp, function() {
                ibm.IBMbuildingData(ibmBuildingDataFileName, building_name, building_lat, building_long, orientation, building_length, building_width, building_height, gross_floor_area, window_to_wall_ratio);
                ibm.IBMutilityData(ibmUtilityDataFileName, electric_utility_startdate, utility_electric, utility_gas);
                response.redirect('http://128.118.67.251:8080/EEBHubData/EEBHubDBServlet?Command=InsertData&FileName=' + building_name + timestamp);
            });
        });


    }
};