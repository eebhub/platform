var fs = require("fs");

module.exports = {
    
    partial: function(request, response){
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