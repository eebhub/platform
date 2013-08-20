var fs = require('fs');
var async = require("async");
module.exports.writeIns = writeIns;
module.exports.writeData = writeData;
module.exports.moveFiles = moveFiles;

function writeIns(insFileName, dataFileName) {
    
    var instructions = 'Path and name of input data file =' + dataFileName + '\r\nValue of no-data flag = 0\r\nColumn number of group field = 0\r\nValue of valid group field = 1\r\nResidual file needed (1 yes, 0 no) = 1\r\nModel type (1:Mean,2:2p,3:3pc,4:3ph,5:4p,6:5p,7:MVR,8:HDD,9:CDD) = 6\r\nColumn number of dependent Y variable = 2\r\nNumber of independent X variables (0 to 6)  = 1\r\nColumn number of independent variable X1 = 1\r\nColumn number of independent variable X2 = 0\r\nColumn number of independent variable X3 = 0\r\nColumn number of independent variable X4 = 0\r\nColumn number of independent variable X5 = 0\r\nColumn number of independent variable X6 = 0';
    fs.writeFile(insFileName, instructions, function(err) {
        if (err) throw err;
        console.log('Ins File saved!');
    });
}
    

//Write Data File
function writeData(dataFileName, total_utility, weather, callback) {
    var data = "";
    for (var i = 0; i < weather.length; i++) {
        data = data + weather[i] + ' ' + total_utility[i] + '\r\n';
    }
    fs.writeFile(dataFileName, data, function(error) {
        if (error) throw error;
        console.log("Data File Saved");
        callback();
    });
    
}

//Move Ins and Out Files
function moveFiles(insFileName, dataFileName, outputFileName, resFileName, callback) {
    fs.renameSync('./' + insFileName, '/home/bitnami/imt/inputs' + insFileName);
    fs.renamerenameSync('./' + dataFileName, '/home/bitnami/imt/inputs' + dataFileName);
    fs.renamerenameSync('./' + resFileName, '/home/bitnami/imt/outputs' + resFileName);
    fs.renamerenameSync('./' + outputFileName, '/home/bitnami/imt/outputs' + outputFileName);
    callback();
}


