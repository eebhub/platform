//Dependencies
var cheerio = require('cheerio');
var async = require('async');
var request = require("request");
var fs = require('fs');
var mv = require("mv");
var childProcess = require("child_process");
//Exporting Functions
module.exports = {


    //Choosing an Airport Code
    determineAirportCode: function(building_location) {
        if (building_location === 'Albuquerque, NM') {
            return 'KABQ';
        }
        else if (building_location === 'Baltimore, MD') {
            return 'KBWI';
        }
        else if (building_location === 'Boise, ID') {
            return 'KBOI';
        }
        else if (building_location === 'Burlington, NH') {
            return 'KBTV';
        }
        else if (building_location === 'Chicago, IL') {
            return 'KORD';
        }
        else if (building_location === 'Duluth, MN') {
            return 'KDLH';
        }
        else if (building_location === 'El Paso, TX') {
            return 'KELP';
        }
        else if (building_location === 'Fairbanks, AK') {
            return 'KFAI';
        }
        else if (building_location === 'Helena, MT') {
            return 'KHLN';
        }
        else if (building_location === 'Houston, TX') {
            return 'KIAH';
        }
        else if (building_location === 'Memphis, TN') {
            return 'KMEM';
        }
        else if (building_location === 'Miami, FL') {
            return 'KMIA';
        }
        else if (building_location === 'Pheonix, AZ') {
            return 'KPHX';
        }
        else if (building_location === 'Philadelphia, PA') {
            return 'KPHL';
        }
        else if (building_location === 'Riyadh, SAU') {
            return 'KRUH';
        }
        else if (building_location === 'Salem, OR') {
            return 'KSLE';
        }
        else if (building_location === 'San Francisco, CA') {
            return 'KSFO';
        }
        else {
            return 'KYVR';
        }
    },
    //Choosing an Average EUI Based upon building type
    buildingEUI: function(building_function) {
        var EUIs = [346.75,
        393.96,
        327.23,
        737.33,
        807.30,
        560.80,
        557.57,
        1248.61,
        1161.43,
        603.86,
        1383.16,
        255.11,
        3235.63,
        2758.79,
        349.83,
        384.60];
        switch (building_function) {
        case 'Small Office':
            return EUIs[0];
        case 'Medium Office':
            return EUIs[1];
        case 'Large Office':
            return EUIs[2];
        case 'Stand-alone Retail':
            return EUIs[3];
        case 'Strip Mall':
            return EUIs[4];
        case 'Primary School':
            return EUIs[5];
        case 'Secondary School':
            return EUIs[6];
        case 'Outpatient Healthcare':
            return EUIs[7];
        case 'Hospital':
            return EUIs[8];
        case 'Small Hotel':
            return EUIs[9];
        case 'Large Hotel':
            return EUIs[10];
        case 'Warehouse (non-refrigerated)':
            return EUIs[11];
        case 'Quick Service Restaurant':
            return EUIs[12];
        case 'Full service Restaurant':
            return EUIs[13];
        case 'Mid-Rise Apartment':
            return EUIs[14];
        case 'High-Rise Apartment':
            return EUIs[15];
        default:
            return 450;
        }
    },

    //Utility Calculations
    //Convert to kBTU
    convertUtilities: function(utility_electric, utility_gas) {
        var kBTU_elec = [];
        var kBTU_gas = [];
        var i = 0;
        for (i in utility_electric) {
            kBTU_elec.push(utility_electric[i] * 3.412);
        }
        for (i in utility_gas) {
            kBTU_gas.push(utility_gas[i] * 102.8);
        }
        return [kBTU_elec, kBTU_gas];
    },
    convertElectricity: function(utility_electric) {
        var kBTU_elec = [];
        var i = 0;
        for (i in utility_electric) {
            kBTU_elec.push(utility_electric[i] * 3.412);
        }
        return kBTU_elec;
    },
    convertGas: function(utility_gas) {
        var kBTU_gas = [];
        var i = 0;
        for (i in utility_gas) {
            kBTU_gas.push(utility_gas[i] * 102.8);
        }
        return kBTU_gas;
    },
    //Combine utilities
    combineUtilities: function(kBTU_elec, kBTU_gas) {
        var i = 0;
        var energy = [];
        for (i in kBTU_elec) {
            energy[i] = kBTU_elec[i] + kBTU_gas[i];
        }
        return energy;
    },
    //Calculate Utility Use Per Day
    energyPerDay: function(utility, utility_startdate) {
        var one_day = 1000 * 60 * 60 * 24;
        var numDaysInBillingPeriod = [];
        for (var i = 0; i < utility_startdate.length - 1; i++) {
            var day_start = new Date(utility_startdate[i]);
            var day_end = new Date(utility_startdate[i + 1]);
            numDaysInBillingPeriod[i] = (day_end - day_start) / one_day;
        }
        var dailyUtility = [];
        var l = 0;
        for (l in numDaysInBillingPeriod) {
            var energyPerDays = utility[l] / numDaysInBillingPeriod[l];
            dailyUtility.push(energyPerDays);
        }

        return dailyUtility;
    },

    //Retrieving Weather Data
    getWeatherData: function(utility_startdate, airportCode, fn) {
        //Getting Weather Function
        function getWeather(url, fn) {
            request(url, function(error, response, body) {
                var temp = cheerio.load(body)('div.contentData table tbody tr:nth-child(3) td:nth-child(3) span.nobr span.b').text();
                fn(temp);
            });
        }
        //Creating Urls
        function getUrls(utility_startdate, airportCode) {
            var urls = [];
            for (var i = 0; i < utility_startdate.length - 1; i++) {
                var startDate = utility_startdate[i];
                var endDate = utility_startdate[i + 1];
                var yearStart = startDate.substring(0, 4);
                var monthStart = startDate.substring(5, 7);
                var dayStart = startDate.substring(8, 10);
                var dayEnd = endDate.substring(8, 10);
                var monthEnd = endDate.substring(5, 7);
                var yearEnd = endDate.substring(0, 4);
                urls[i] = 'http://www.wunderground.com/history/airport/' + airportCode + '/' + yearStart + '/' + monthStart + '/' + dayStart + '/CustomHistory.html?dayend=' + dayEnd + '&monthend=' + monthEnd + '&yearend=' + yearEnd + '&req_city=NA&req_state=NA&req_statename=NA&MR=1';
            }
            return urls;
        }
        var urls = getUrls(utility_startdate, airportCode);
        async.parallel([

        function(callback) {
            getWeather(urls[0], function(results) {
                callback(null, results);
            });
        },

        function(callback) {
            getWeather(urls[1], function(results) {
                callback(null, results);
            });
        },

        function(callback) {
            getWeather(urls[2], function(results) {
                callback(null, results);
            });
        },

        function(callback) {
            getWeather(urls[3], function(results) {
                callback(null, results);
            });
        },

        function(callback) {
            getWeather(urls[4], function(results) {
                callback(null, results);
            });
        },

        function(callback) {
            getWeather(urls[5], function(results) {
                callback(null, results);
            });
        },

        function(callback) {
            getWeather(urls[6], function(results) {
                callback(null, results);
            });
        },

        function(callback) {
            getWeather(urls[7], function(results) {
                callback(null, results);
            });
        },

        function(callback) {
            getWeather(urls[8], function(results) {
                callback(null, results);
            });
        },

        function(callback) {
            getWeather(urls[9], function(results) {
                callback(null, results);
            });
        },

        function(callback) {
            getWeather(urls[10], function(results) {
                callback(null, results);
            });
        },

        function(callback) {
            getWeather(urls[11], function(results) {
                callback(null, results);
            });
        },

        ],

        function(err, results) {
            fn(results);
        });
    },

    //Write Files
    //Write Instruction Files
    writeIns5p: function(insFileName, dataFileName) {

        var instructions = 'Path and name of input data file =' + dataFileName + '\r\nValue of no-data flag = 0\r\nColumn number of group field = 0\r\nValue of valid group field = 1\r\nResidual file needed (1 yes, 0 no) = 1\r\nModel type (1:Mean,2:2p,3:3pc,4:3ph,5:4p,6:5p,7:MVR,8:HDD,9:CDD) = 6\r\nColumn number of dependent Y variable = 2\r\nNumber of independent X variables (0 to 6)  = 1\r\nColumn number of independent variable X1 = 1\r\nColumn number of independent variable X2 = 0\r\nColumn number of independent variable X3 = 0\r\nColumn number of independent variable X4 = 0\r\nColumn number of independent variable X5 = 0\r\nColumn number of independent variable X6 = 0';
        fs.writeFile(insFileName, instructions, function(err) {
            if (err) throw err;
            console.log('Ins File saved!');
        });
    },
    writeIns3pc: function(insFileName, dataFileName) {

        var instructions = 'Path and name of input data file =' + dataFileName + '\r\nValue of no-data flag = 0\r\nColumn number of group field = 0\r\nValue of valid group field = 1\r\nResidual file needed (1 yes, 0 no) = 1\r\nModel type (1:Mean,2:2p,3:3pc,4:3ph,5:4p,6:5p,7:MVR,8:HDD,9:CDD) = 3\r\nColumn number of dependent Y variable = 2\r\nNumber of independent X variables (0 to 6)  = 1\r\nColumn number of independent variable X1 = 1\r\nColumn number of independent variable X2 = 0\r\nColumn number of independent variable X3 = 0\r\nColumn number of independent variable X4 = 0\r\nColumn number of independent variable X5 = 0\r\nColumn number of independent variable X6 = 0';
        fs.writeFile(insFileName, instructions, function(err) {
            if (err) throw err;
            console.log('Ins File saved!');
        });
    },
    writeIns3ph: function(insFileName, dataFileName) {

        var instructions = 'Path and name of input data file =' + dataFileName + '\r\nValue of no-data flag = 0\r\nColumn number of group field = 0\r\nValue of valid group field = 1\r\nResidual file needed (1 yes, 0 no) = 1\r\nModel type (1:Mean,2:2p,3:3pc,4:3ph,5:4p,6:5p,7:MVR,8:HDD,9:CDD) = 4\r\nColumn number of dependent Y variable = 2\r\nNumber of independent X variables (0 to 6)  = 1\r\nColumn number of independent variable X1 = 1\r\nColumn number of independent variable X2 = 0\r\nColumn number of independent variable X3 = 0\r\nColumn number of independent variable X4 = 0\r\nColumn number of independent variable X5 = 0\r\nColumn number of independent variable X6 = 0';
        fs.writeFile(insFileName, instructions, function(err) {
            if (err) throw err;
            console.log('Ins File saved!');
        });
    },
    //Write Data File
    writeData: function(dataFileName, utility, weather, fn) {
        var data = "";
        for (var i = 0; i < weather.length; i++) {
            data = data + weather[i] + ' ' + utility[i] + '\r\n';
        }
        fs.writeFile(dataFileName, data, function(error) {
            if (error) throw error;
            console.log("Data File Saved");
            fn();
        });
    },
    executeIMT: function(insFileName, outputFileName, resFileName, fn) {
        childProcess.execFile('./ASHRAE-IMT/imtExe.o', [insFileName, outputFileName, resFileName],

        function(error, stdout, stderr) {
            fn();
        });
    },
    //Move Ins, Data, Out, and Res files
    moveFiles: function(insFileName, dataFileName, outputFileName, resFileName,filePath, fn) {
        mv('./' + insFileName, filePath + insFileName, function(err) {
            if (err) throw err;
            mv('./' + dataFileName, filePath + dataFileName, function(err) {
                if (err) throw err;
                mv('./' + outputFileName, filePath + outputFileName, function(err) {
                    if (err) throw err;
                    mv('./' + resFileName, filePath + resFileName, function(err) {
                        if (err) throw err;
                        fn();
                    });
                });
            });

        });
    },

    //Parse IMT outputs
    parseIMT5p: function(resFileName, outFileName,filePath, fn) {
        function parseOutput(outFileName, fn) {

            var array = fs.readFileSync(filePath + outFileName).toString().split('\n');
            var Ycp = parseFloat((array[39].split('= '))[1]),
                LS = parseFloat((array[41].split('= '))[1]),
                RS = parseFloat((array[43].split('= '))[1]),
                Xcp1 = parseFloat((array[35].split('= '))[1]),
                Xcp2 = parseFloat((array[37].split('= '))[1]);

            var outputs = [Ycp, LS, RS, Xcp1, Xcp2];
            fn(outputs);

        }


        function parseResFile(resFileName, fn) {

            //Get array of Data File Each row of file in an element in the array
            var array = fs.readFileSync(filePath + resFileName).toString().split('\n');

            //Create Arrays for wehre the desired values should go
            var temperature = [];
            var energy = [];
            var imtEnergy = [];
            var imtEnergyDifference = [];

            //Run For Loop that creates a array of each row of data, gets rid of spaces, and then assignes the data to the corresponding array
            for (var i = 0; i < array.length - 1; i++) {
                var row = array[i].toString().split(' ');
                var newrow = [];
                for (var l = 0; l < row.length; l++) {
                    if (row[l] !== '') {
                        newrow.push(row[l]);
                    }
                }
                temperature.push(parseFloat(newrow[0]));
                energy.push(parseFloat(newrow[1]));
                imtEnergy.push(parseFloat(newrow[2]));
                imtEnergyDifference.push(parseFloat(newrow[3]));

            }
            var results = [temperature, energy, imtEnergy, imtEnergyDifference];
            fn(results);
        }

        async.parallel([

        function(callback) {
            parseResFile(resFileName, function(results) {
                callback(null, results);
            });
        },

        function(callback) {
            parseOutput(outFileName, function(outputs) {
                callback(null, outputs);
            });
        }],
        // optional callback
        function(err, results) {
            fn(results);
        });
    },
    parseIMT3p: function(resFileName, outFileName,filePath, fn) {
        function parseOutput(outFileName, fn) {

            var array = fs.readFileSync(filePath + outFileName).toString().split('\n');
            var Ycp = parseFloat((array[39].split('= '))[1]),
                LS = parseFloat((array[41].split('= '))[1]),
                RS = parseFloat((array[43].split('= '))[1]),
                Xcp = parseFloat((array[45].split('= '))[1]);
                

            var outputs = [Ycp, LS, RS,Xcp];
            fn(outputs);

        }


        function parseResFile(resFileName, fn) {

            //Get array of Data File Each row of file in an element in the array
            var array = fs.readFileSync(filePath + resFileName).toString().split('\n');

            //Create Arrays for wehre the desired values should go
            var temperature = [];
            var energy = [];
            var imtEnergy = [];
            var imtEnergyDifference = [];

            //Run For Loop that creates a array of each row of data, gets rid of spaces, and then assignes the data to the corresponding array
            for (var i = 0; i < array.length - 1; i++) {
                var row = array[i].toString().split(' ');
                var newrow = [];
                for (var l = 0; l < row.length; l++) {
                    if (row[l] !== '') {
                        newrow.push(row[l]);
                    }
                }
                temperature.push(parseFloat(newrow[0]));
                energy.push(parseFloat(newrow[1]));
                imtEnergy.push(parseFloat(newrow[2]));
                imtEnergyDifference.push(parseFloat(newrow[3]));

            }
            var results = [temperature, energy, imtEnergy, imtEnergyDifference];
            fn(results);
        }

        async.parallel([

        function(callback) {
            parseResFile(resFileName, function(results) {
                callback(null, results);
            });
        },

        function(callback) {
            parseOutput(outFileName, function(outputs) {
                callback(null, outputs);
            });
        }],
        // optional callback
        function(err, results) {
            fn(results);
        });
    },

    //IMT Calculations
    calcSiteEUI: function(utility_startdate, total_energy, building_size, fn) {
        var dayOne = new Date(utility_startdate[0]);
        var dayLast = new Date(utility_startdate[utility_startdate.length - 1]);
        var one_day = 1000 * 60 * 60 * 24;
        var days = (dayLast - dayOne) / one_day;
        var yearRatio = 365 / days;
        var i = 0;
        var energy = 0;
        for (i in total_energy) {
            energy += total_energy[i];
        }
        var EUI = ((energy * yearRatio) / building_size).toFixed(1);
        fn(EUI);
    },
    imtResgression5p: function(outputs, weatherData, fn) {

        var Ycp = outputs[0],
            LS = outputs[1],
            RS = outputs[2],
            Xcp1 = outputs[3],
            Xcp2 = outputs[4];
        var plottingData = [];
        var temperature = [parseFloat(weatherData[0])];
        var t = 0;
        console.log(temperature);
        while (temperature[t] < parseFloat(weatherData[weatherData.length - 1])) {
            temperature.push(temperature[t] + 1);
            t = t + 1;
        }
        for (var i = 0; i < temperature.length; i++) {
            var point = (Ycp + (LS * (temperature[i] - Xcp1)) + (RS * (temperature[i] - Xcp2)));
            var yData = [parseFloat(temperature[i]), point];
            plottingData.push(yData);
        }
        fn(plottingData);
    },
    combineEnergyTemperature: function(Energy, Temperature) {
        var combined = [];
        var i = 0;
        for (i in Temperature) {
            combined.push([Temperature[i], Energy[i]]);
        }
    }
};