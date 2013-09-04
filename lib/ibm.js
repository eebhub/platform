var fs = require("fs");
var request = require("request");

module.exports = {
    IBMbuildingData: function(ibmBuildingDataFileName, building_name, building_lat, building_long, orientation, building_length, building_width, building_height, gross_floor_area) {
        var tab = '     ';
        var content = building_name + tab + building_lat + tab + building_long + tab + building_length + tab + building_width + tab + building_height + tab + gross_floor_area;
        fs.writeFileSync(ibmBuildingDataFileName, content);

    },
    IBMutilityData: function(ibmUtilityDataFileName, electric_start_date, electricity, gas) {
        var tab = '     ';
        var content = "";
        for (var i = 0; i < electric_start_date.length; i++) {
            content += electric_start_date[i] + tab + electricity[i] + tab + gas[i] + '\r\n';
        }
        fs.writeFileSync(ibmUtilityDataFileName, content);
    },
    geoCode: function(building_location_address, building_location_city, building_location_state) {
        //1600+Amphitheatre+Parkway
        //Mountain+View
        //CA
        var address = building_location_address.split(' ').join('+');
        var city = building_location_city.split(' ').join('+');
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + address + ',+' + city + ',+' + building_location_state + '&sensor=false';
        request(url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var geocode = JSON.parse(body);
                var lat = geocode.results[0].geometry.location.lat;
                var long = geocode.results[0].geometry.location.lng;
                return [lat, long];
            }
        });
    }
};