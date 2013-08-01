var fs = require("fs");

module.exports = {
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
};