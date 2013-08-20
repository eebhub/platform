
module.exports.calcSiteEUI = calcSiteEUI;
module.exports.imtResgression5p = imtResgression5p;
module.exports.combineEnergyTemperature = combineEnergyTemperature;

function calcSiteEUI(utility_startdate, total_energy, building_size, callback){
    var dayOne = new Date(utility_startdate[0]);
    var dayLast = new Date(utility_startdate[utility_startdate.length-1]);
    var one_day = 1000 * 60 * 60 * 24;
    var days = (dayLast - dayOne)/one_day;
    var yearRatio = 365/days;
    var i =0;
    var energy = 0;
    for(i in total_energy){ 
        energy += total_energy[i];
    }
    var EUI = ((energy * yearRatio)/building_size).toFixed(1);
    callback(EUI);
}


function imtResgression5p(outputs, weatherData, callback){
    
    var Ycp = outputs[0],
        LS = outputs[1],
        RS = outputs[2],
        Xcp1 = outputs[3],
        Xcp2 = outputs[4];
    var plottingData = [];
    var temperature = [parseFloat(weatherData[0])];
    var t = 0;
    console.log(temperature);
    while (temperature[t] < parseFloat(weatherData[weatherData.length-1])) {
        temperature.push(temperature[t]+1);
        t = t + 1;
    }
    for (var i=0; i<temperature.length; i++) {
        var point = (Ycp  + (LS * (temperature[i]  - Xcp1)) + (RS * (temperature[i]  - Xcp2)));
        var yData = [parseFloat(temperature[i]), point];
        plottingData.push(yData);
    }
    callback(plottingData);
}

function combineEnergyTemperature(Energy, Temperature){
    var combined = [];
    var i =0;
    for (i in Temperature) {
        combined.push([Temperature[i], Energy[i]]);
    }
}
