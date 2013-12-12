var fs = require("fs");
var request = require("request");

module.exports = {
    IBMbuildingData: function(ibmBuildingDataFileName, building_name, building_lat, building_long, orientation, building_length, building_width, building_height, gross_floor_area, window_to_walll_ratio) {
        //var tab = '     ';
        //var content = building_name + tab + building_lat + tab + building_long + tab + building_length + tab + building_width + tab + building_height + tab + gross_floor_area;
        var content = 'Building Name\tLatitude\tLongitude\tOrientation (degree)\tLength (ft)\tWidth (ft)\tHeight (ft)\tGross Floor Area (ft2)\tWall-Window Ratio\n'+building_name + '\t' + building_lat + '\t' + building_long + '\t' + orientation + '\t' + building_length + '\t' + building_width + '\t' + building_height + '\t' + gross_floor_area + '\t'+ window_to_walll_ratio +'\n';
        fs.writeFileSync(ibmBuildingDataFileName, content);

    },
    IBMutilityData: function(ibmUtilityDataFileName, electric_start_date, electricity, gas) {
        //var tab = '     ';
        var tab = '\t';
        var content = "TimeStart\tTimeEnd\telectricity Usage (kWh)\tGas Usage (BTU)\n";
        
        for (var i = 0; i < electric_start_date.length-1; i++) {
            var temp = electric_start_date[i].split('-');
            var tempYear = temp[0];var tempMonth = temp[1];var tempDay = temp[2];
            var d1=new Date(tempYear,tempMonth,tempDay);
            var startDate = (d1.getMonth()+1) + '/' + d1.getDate() + '/' + d1.getFullYear(); 
            d1.setDate(0);
            var endDate = (d1.getMonth()+1) + '/' + d1.getDate() + '/' + d1.getFullYear(); 
            content += startDate + tab + endDate+tab + electricity[i] + tab + gas[i] + '\n';
        }
        fs.writeFileSync(ibmUtilityDataFileName, content);
    },
    geoCode: function(building_location_address, building_location_city, building_location_state, callback) {
        var address = building_location_address.split(' ').join('+');
        var city = building_location_city.split(' ').join('+');
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + address + ',+' + city + ',+' + building_location_state + '&sensor=false';
        request(url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var geocode = JSON.parse(body);
                var lat = geocode.results[0].geometry.location.lat;
                var long = geocode.results[0].geometry.location.lng;
                callback(lat, long);
            }
        });
    }
};