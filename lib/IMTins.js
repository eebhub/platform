var fs = require("fs");

module.exports.imtins = imtins;

function imtins(insFilename, datFileName, path) {
    var instructions =  'Path and name of input data file =' + datFileName + '\r\nValue of no-data flag = 0\r\nColumn number of group field = 0\r\nValue of valid group field = 1\r\nResidual file needed (1 yes, 0 no) = 1\r\nModel type (1:Mean,2:2p,3:3pc,4:3ph,5:4p,6:5p,7:MVR,8:HDD,9:CDD) = 4\r\nColumn number of dependent Y variable = 2\r\nNumber of independent X variables (0 to 6)  = 1\r\nColumn number of independent variable X1 = 1\r\nColumn number of independent variable X2 = 0\r\nColumn number of independent variable X3 = 0\r\nColumn number of independent variable X4 = 0\r\nColumn number of independent variable X5 = 0\r\nColumn number of independent variable X6 = 0';
    fs.writeFileSync(path + insFilename, instructions);
    console.log('saved Ins File')
};

/*IMTins('helt.txt', 'file.dat', './')*/