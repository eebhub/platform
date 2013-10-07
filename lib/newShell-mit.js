var fs = require('fs');

module.exports.newShellMIT = newShellMIT;

function newShellMIT(BuildingInputName){

    //Create Instruction
    var SHELL =

'// RUN MIT DESIGN ADVISOR\r\n' +
'cd /home/platform/\r\n' +
'java -jar DATest.jar mit/'+BuildingInputName+'/'+BuildingInputName+'_input.txt\r\n' +
'\r\n' ;

fs.writeFile('../mit/' + BuildingInputName +'/'+  BuildingInputName +'_shell.sh', SHELL, function(error){
    if (error) throw error;
});

                        }