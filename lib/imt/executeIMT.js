//Dependencies
var childProcess = require("child_process");

module.exports.executeIMT = executeIMT;

function executeIMT(insFileName, outputFileName, resFileName,  callback) {
    childProcess.execFile('./ASHRAE-IMT/imtExe.o', [insFileName, outputFileName, resFileName],
    function(error, stdout, stderr) {
        callback();
    });
}

