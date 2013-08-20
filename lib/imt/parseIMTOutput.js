var fs = require('fs');
var async = require("async");

module.exports.parseIMT = parseIMT;

function parseOutput(outFileName, callback) {

    var array = fs.readFileSync('~/imt/outputs/' + outFileName).toString().split('\n');
    var Ycp = parseFloat((array[39].split('= '))[1]),
        LS = parseFloat((array[41].split('= '))[1]),
        RS = parseFloat((array[43].split('= '))[1]),
        Xcp1 = parseFloat((array[35].split('= '))[1]),
        Xcp2 = parseFloat((array[37].split('= '))[1]);

    var outputs = [Ycp, LS, RS, Xcp1, Xcp2];
    callback(outputs);

}


function parseResFile(resFileName, callback) {

    //Get array of Data File Each row of file in an element in the array
    var array = fs.readFileSync('~/imt/outputs/' + resFileName).toString().split('\n');

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
    callback(results);
}



function parseIMT(resFileName, outFileName, fn) {
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
}