var cheerio = require('cheerio');
var async = require('async');
var request = require("request");

module.exports.getWeatherData = getWeatherData;

function getWeatherData(utility_startdate, airportCode, fn) {
    //Getting Weather Function
    function getWeather(url, fn) {
        request(url, function(error, response, body) {
            var temp = cheerio.load(body)('div.contentData table tbody tr:nth-child(3) td:nth-child(3) span.nobr span.b').text();
            fn(temp);
        });
    }
    //Creating Urls
    function getUrls(utility_startdate, airportCode) {
        var urls = [];
        for (var i = 0; i < utility_startdate.length - 1; i++) {
            var startDate = utility_startdate[i];
            var endDate = utility_startdate[i + 1];
            var yearStart = startDate.substring(0, 4);
            var monthStart = startDate.substring(5, 7);
            var dayStart = startDate.substring(8, 10);
            var dayEnd = endDate.substring(8, 10);
            var monthEnd = endDate.substring(5, 7);
            var yearEnd = endDate.substring(0, 4);
            urls[i] = 'http://www.wunderground.com/history/airport/' + airportCode + '/' + yearStart + '/' + monthStart + '/' + dayStart + '/CustomHistory.html?dayend=' + dayEnd + '&monthend=' + monthEnd + '&yearend=' + yearEnd + '&req_city=NA&req_state=NA&req_statename=NA&MR=1';
        }
        return urls;
    }
    var urls = getUrls(utility_startdate, airportCode);
    async.parallel([

    function(callback) {
        getWeather(urls[0], function(results) {
            callback(null, results);
        });
    },

    function(callback) {
        getWeather(urls[1], function(results) {
            callback(null, results);
        });
    },

    function(callback) {
        getWeather(urls[2], function(results) {
            callback(null, results);
        });
    },

    function(callback) {
        getWeather(urls[3], function(results) {
            callback(null, results);
        });
    },

    function(callback) {
        getWeather(urls[4], function(results) {
            callback(null, results);
        });
    },

    function(callback) {
        getWeather(urls[5], function(results) {
            callback(null, results);
        });
    },

    function(callback) {
        getWeather(urls[6], function(results) {
            callback(null, results);
        });
    },

    function(callback) {
        getWeather(urls[7], function(results) {
            callback(null, results);
        });
    },

    function(callback) {
        getWeather(urls[8], function(results) {
            callback(null, results);
        });
    },

    function(callback) {
        getWeather(urls[9], function(results) {
            callback(null, results);
        });
    },

    function(callback) {
        getWeather(urls[10], function(results) {
            callback(null, results);
        });
    },

    function(callback) {
        getWeather(urls[11], function(results) {
            callback(null, results);
        });
    },

    ],

    function(err, results) {
        fn(results);
    });
}