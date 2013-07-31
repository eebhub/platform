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
    //Submits
    liteanalysis: function(request, response){
        var buildingName = request.body.building.building_name;
        console.log(buildingName);
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
    testpost: function(request, response){
        var name = request.body.name;
        var size = request.body.size;
        console.log(name);
        console.log(size);
        
    },
};
