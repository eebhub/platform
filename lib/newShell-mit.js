var fs = require('fs');

module.exports.newShellMIT = newShellMIT;

function newShellMIT(BuildingInputName){

    //Create Instruction
    var SHELL =

'// RUN MIT DESIGN ADVISOR, one machine\r\n' +
'cd /home/platform/;\r\n' +
'java -jar DATest.jar mit/'+BuildingInputName+'/'+BuildingInputName+'_input.txt ' +
'2>&1 | tee mit/'+BuildingInputName+'/'+BuildingInputName+'_shellOutput.txt;\r\n\r\n' +

'// RUN MIT DESIGN ADVISOR, on platform\r\n' +
'ssh platform@128.118.67.227 \"' +
'java -jar DATest.jar mit/'+BuildingInputName+'/'+BuildingInputName+'_input.txt '+ 
'2>&1 | tee mit/'+BuildingInputName+'/'+BuildingInputName+'_shellOutput.txt;\"'+ 
'scp -r ./mit/' + BuildingInputName + '/ bitnami@128.118.67.234:/home/bitnami/mit/';

fs.writeFile('../mit/' + BuildingInputName +'/'+  BuildingInputName +'_shell.sh', SHELL, function(error){
    if (error) throw error;
});

}