var mit = require("/lib/mit.js");

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
    getTest: function(request, response){
        response.render('test');    
    },
    //Submits
    liteanalysis: function(request, response){
        var buildingName = request.body.building.building_name;
        console.log(buildingName);
    },
    partialanalysis: function(request, response){
        var buildingName = request.body.building.building_name;
        var buildingYear = request.body.building.year_completed;
        console.log(buildingName);
        console.log(buildingYear);
        response.render('partial');
    },
    testpost: function(request, response){
        var name = request.body.name;
        var size = request.body.size;
        console.log(name);
        console.log(size);
        
    },
};
