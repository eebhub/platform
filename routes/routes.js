var mit = require("../lib/mit.js");
var fs = require("fs");

module.exports = {
    getIndex: function(request, response){
        response.render('index');    
    },
    getLite: function(request, response){
        response.render('lite');    
    },
    getLiteResults: function(request, response){
        response.render('literesults');    
    },
    getPartial: function(request, response){
        response.render('partial');    
    },
    
    getSubstantial: function(request, response) {
        response.render('substantial');
    },
    
    getComprehensive: function(request, response) {
        response.render('comprehensive');
    },
    //Submits
    liteanalysis: function(request, response) {
        var buildingName = request.body.building.building_name;
        var date = request.body.utility.utility_startdate;
        var electricity = request.body.utility.utility_electric;
        var ngas = request.body.utility.utility_gas;
        
        var insFileName = buildingName + '.ins'
        var datFileName = buildingName + '.dat'
        var time = new Date().getTime();
        var path = './lite/' + buildingName + time + '/';
        
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
    partialanalysis: function(request, response){
        var buildingName = request.body.building.building_name;
        var stringBuilding = JSON.stringify(request.body.building);
        var stringOccupancy = JSON.stringify(request.body.occupancy);
        var stringMaterials = JSON.stringify(request.body.materials);
        var stringMechanical = JSON.stringify(request.body.mechanical);
        var stringRoom = JSON.stringify(request.body.room);
        var string = stringBuilding  + '<br/>' + stringOccupancy  + '<br/>' + stringMaterials + '<br />' + stringMechanical + '<br />' + stringRoom;
        var route = "./views/";
        var fileName = route + buildingName + '.ejs' ;
        fs.writeFileSync(fileName, string);
        response.render(buildingName);
        
    },
    
    
};
