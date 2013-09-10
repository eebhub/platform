var fs = require("fs");
var timestp = require("../lib/timestamp.js");
var shelljs = require('shelljs');

module.exports ={
    
    getSubstantialSampleRes:  function(request, response) {
        response.render('substantialsampleres');
    },
    
    getSubstantialSampleResEnergyUse:  function(request, response) {
        response.render('substantialsampleres-energyuse');
    },
    
    getSubstantialSampleResStage1:  function(request, response) {
        response.render('substantialsampleres-stage1');
    },
    
    getSubstantialSampleResStage2:  function(request, response) {
        response.render('substantialsampleres-stage2');
    },

    getSubstantialResults:  function(request, response) {
        console.log(request.body);
        console.log(request.body.electricity_used_for_cooling);
        var buildingname = request.body.building_name;
        var buildingclimate = request.body.weather_epw_location;
        var buildingstate = "";
        switch (buildingclimate)
        {
        case "ALBUQUERQUE INTL ARPT [ISIS]":
        buildingstate="Minnesota";
        break;
        case "BALTIMORE BLT-WASHNGTN INT'L":
        buildingstate="Maryland";
        break;
        case "BOISE AIR TERMINAL [UO]":
        buildingstate="Idaho";
        break;
        case "BURLINGTON INTERNATIONAL AP":
        buildingstate="New Hampshire";
        break;
        case "CHICAGO OHARE INTL AP":
        buildingstate="Illinois";
        break;
        case "DULUTH INTERNATIONAL ARPT":
        buildingstate="Minnesota";
        break;
        case "EL PASO INTERNATIONAL AP [UT]":
        buildingstate="Texas";
        break;
        case "FAIRBANKS INTL ARPT":
        buildingstate="Alaska";
        break;
        case "HELENA REGIONAL AIRPORT":
        buildingstate="Montana";
        break;
        case "HOUSTON BUSH INTERCONTINENTAL": 
        buildingstate="Texas";
        break;
        case "MEMPHIS INTERNATIONAL AP":
        buildingstate="Tennessee";
        break;
        case "MIAMI INTL AP":
        buildingstate="Florida";
        break;
        case "PHOENIX SKY HARBOR INTL AP":
        buildingstate="Arizona";
        break;
        case "PHILADELPHIA INTERNATIONAL AP":
        buildingstate="Pennsylvania";
        break;
        case "":
        buildingstate="";
        break;
        case "SALEM MCNARY FIELD":
        buildingstate="Massachusetts";
        break;
        case "SAN FRANCISCO INTL AP":
        buildingstate="California";
        break;        
        }

        var grossfloorarea = request.body.gross_floor_area;
        var numberoffloors = request.body.number_of_floors;
        var shape = request.body.footprint_shape;
        var shapenum;
        switch(shape){
            case "E shaped": 
                shapenum = 7;
                break;
            case "H shaped":
                shapenum = 5;
                break;
            case "L shaped":
                shapenum = 9;
                break;
            case "Narrow rectangle":
                shapenum = 3;
                break;
            case "Other shape":
                shapenum = 11;
                break;
            case "plus sign or cross shaped":
                shapenum = 10;
                break;
            case "Rectangle/square with courtyard":
                shapenum = 4;
                break;
            case "Square":
                shapenum = 1;
                break;
            case "T shaped":
                shapenum = 8;
                break;
            case "U shaped":
                shapenum = 6;
                break;
            case "Wide rectangle":
                shapenum = 2;
                break;
            default:
                shapenum = 12;
                break;
        }
        var totalbuildingheight = request.body.building_height;
        var buildingperimeter = request.body.perimeter;
        var buildingfunction = request.body.activity_type;
        var buildingfunctionnum;
        switch(buildingfunction){
            case "Education": 
                buildingfunctionnum = 14;
                break;
            case "Enclosed mall":
                buildingfunctionnum = 24;
                break;
            case "Food sales":
                buildingfunctionnum = 6;
                break;
            case "Food service":
                buildingfunctionnum = 15;
                break;
            case "Inpatient health care":
                buildingfunctionnum = 16;
                break;
            case "Laboratory":
                buildingfunctionnum = 4;
                break;
            case "Lodging":
                buildingfunctionnum = 18;
                break;
            case "Nonrefrigerated warehouse":
                buildingfunctionnum = 5;
                break;
            case "Nursing":
                buildingfunctionnum = 17;
                break;
            case "Office":
                buildingfunctionnum = 2; 
                break;
            case "Other":
                buildingfunctionnum = 91;
                break;
            case "Outpatient health care":
                buildingfunctionnum = 8;
                break;
            case "Public assembly":
                buildingfunctionnum = 13;
                break;
            case "Public order and safety":
                buildingfunctionnum = 7;
                break;
            case "Refrigerated warehouse":
                buildingfunctionnum = 11;
                break;
            case "Religious worship":
                buildingfunctionnum = 12;
                break;
            case "Retail other than mall":
                buildingfunctionnum = 25;
                break;
            case "Service":
                buildingfunctionnum = 26;
                break;
            case "Strip shopping mall":
                buildingfunctionnum = 23;
                break;
            case "Vacant":
                buildingfunctionnum = 1;
                break;
        }
        var buildingactivitytype = request.body.activity_type_specific;
        var buildingactivitytypenum;
        switch(buildingactivitytype){
            case "Administrative/professional office":
                buildingactivitytypenum = 2;
                break;
            case "Bank/other financial":
                buildingactivitytypenum = 3;
                break;
            case "Clinic/other outpatient health":
                buildingactivitytypenum = 19;
                break;
            case "College/university":
                buildingactivitytypenum = 27;
                break;
            case "Convenience store":
                buildingactivitytypenum = 12;
                break;
            case "Convenience store with gas station":
                buildingactivitytypenum = 13;
                break;
            case "Distribution/shipping center":
                buildingactivitytypenum = 9;
                break;
            case "Dormitory/fraternity/sorority":
                buildingactivitytypenum = 37;
                break;
            case "Elementary/middle school":
                buildingactivitytypenum = 28;
                break;
            case "Enclosed mall":
                buildingactivitytypenum = 51;
                break;
            case "Entertainment/culture":
                buildingactivitytypenum = 22;
                break;
            case "Fast food":
                buildingactivitytypenum = 32;
                break;
            case "Fire station/police station":
                buildingactivitytypenum = 16;
                break;
            case "Government office":
                buildingactivitytypenum = 4;
                break;
            case "Grocery store/food market":
                buildingactivitytypenum = 14;
                break;
            case "High school":
                buildingactivitytypenum = 29;
                break;
            case "Hospital/inpatient health":
                buildingactivitytypenum = 35;
                break;
            case "Hotel":
                buildingactivitytypenum = 38;
                break;
            case "Laboratory":
                buildingactivitytypenum = 8;
                break;
            case "Library":
                buildingactivitytypenum = 23;
                break;
            case "Medical office (diagnostic)":
                buildingactivitytypenum = 18;
                break;
            case "Medical office (non-diagnostic)":
                buildingactivitytypenum = 5;
                break;
            case "Mixed-use office":
                buildingactivitytypenum = 6;
                break;
            case "Motel or inn":
                buildingactivitytypenum = 39;
                break;
            case "Non-refrigerated warehouse": 
                buildingactivitytypenum = 10;
                break;
            case "Nursing home/assisted living":
                buildingactivitytypenum = 36;
                break;
            case "Other":
                buildingactivitytypenum = 49;
                break;
            case "Other classroom education":
                buildingactivitytypenum = 31;
                break;
            case  "Other food sales":
                buildingactivitytypenum = 15;
                break;
            case "Other food service":
                buildingactivitytypenum = 34;
                break;
            case "Other lodging":
                buildingactivitytypenum = 40;
                break;
            case "Other office":
                buildingactivitytypenum = 7;
                break;
            case "Other public assembly":
                buildingactivitytypenum = 26;
                break;
            case "Other public order and safety":
                buildingactivitytypenum = 17;
                break;
            case "Other retail":
                buildingactivitytypenum = 43;
                break;
            case "Other service": 
                buildingactivitytypenum = 48;
                break;
            case "Post office/postal center": 
                buildingactivitytypenum = 44;
                break; 
            case "Preschool/daycare":
                buildingactivitytypenum = 30;
                break;
            case "Recreation":
                buildingactivitytypenum = 24;
                break;
            case "Refrigerated warehouse":
                buildingactivitytypenum = 20;
                break;
            case "Religious worship":
                buildingactivitytypenum = 21;
                break;
            case "Repair shop":
                buildingactivitytypenum = 45;
                break;
            case "Restaurant/cafeteria":
                buildingactivitytypenum = 33;
                break;
            case "Retail store":
                buildingactivitytypenum = 42;
                break;
            case "Self-storage":
                buildingactivitytypenum = 11;
                break;
            case "Social/meeting":
                buildingactivitytypenum = 25;
                break;
            case "Strip shopping mall":
                buildingactivitytypenum = 50;
                break;
            case "Vacant":
                buildingactivitytypenum = 1;
                break;
            case "Vehicle dealership/showroom":
                buildingactivitytypenum = 41;
                break;
            case "Vehicle service/repair shop":
                buildingactivitytypenum = 46;
                break;
            case "Vehicle storage/maintenance":
                buildingactivitytypenum = 47;
                break;
        }
        
        var numberofemployeeduringmainshift = request.body.number_of_employees_during_main_shift;
        var open24hoursaday1 = request.body.open_24_hours_a_day;
        var open24hoursaday = "No";
        if(open24hoursaday1=="on") open24hoursaday = "Yes";
        var totalweeklyoperatinghours = request.body.average_weekly_operating_hours;
        var openduringweek1 = request.body.open_during_week;
        var openduringweek = "No";
        if(openduringweek1 == "on") {openduringweek = "Yes";}
        var openonweekend1 = request.body.open_on_weekend;
        var openonweekend = "No";
        if(openonweekend1=="on") {openonweekend = "Yes";}
        var weekdayopen = request.body.weekday_occupancy_hours_day_start;
        var weekdayclose = request.body.weekday_occupancy_hours_day_end;
        var satopen = request.body.saturday_occupancy_hours_day_start;
        var satclose = request.body.saturday_occupancy_hours_day_end;
        var sunopen = request.body.sunday_occupancy_hours_day_start;
        var sunclose = request.body.sunday_occupancy_hours_day_end;
        var primaryhvactype = request.body.primary_hvac_type; 
        // var airsideeconomizer1 = request.body.airside_economizer;
        // var airsideeconomizer = "No";
        // if(airsideeconomizer1 == "on") airsideeconomizer = "Yes";
        // var airsideenergyrecovery1 = request.body.airside_energy_recovery;
        // var airsideenergyrecovery = "No";
        // if(airsideenergyrecovery1 == "on") airsideenergyrecovery = "Yes"; 
        // var demandcontroltype1 = request.body.demand_control_ventilation;
        // var demandcontroltype = "No";
        // if(demandcontroltype1 == "on") demandcontroltype = "Yes";
        // var percentexteriorglass = request.body.window_to_wall_ratio;
        // var windowglasstype = request.body.window_glass_type;
        // var walltype = request.body.exterior_wall_type; 
        // var rooftype = request.body.roof_type;
        var elecmainheating1 = request.body.electricity_used_for_main_heating;
        var elecmainheating = "No";
        if(elecmainheating1 == "on") elecmainheating = "Yes";
        var gasmainheating1 = request.body.natural_gas_uesd_for_main_heating;
        var gasmainheating = "No";
        if(gasmainheating1=="on") gasmainheating = "Yes";
        var fuelmainheating1 = request.body.fuel_oil_used_for_main_heating;
        var fuelmainheating = "No";
        if(fuelmainheating1=="on") fuelmainheating = "Yes";
        var propanemainheating1 = request.body.propane_used_for_main_heating;
        var propanemainheating = "No";
        if(propanemainheating1=="on") propanecooling = "Yes";
        var dissteammainheating1 = request.body.district_steam_used_for_main_heating;
        var dissteammainheating = "No";
        if(dissteammainheating1=="on") dissteammainheating = "Yes";
        var dishotwatermainheating1 = request.body.district_hot_water_used_for_main_heating;
        var dishotwatermainheating = "No";
        if(dishotwatermainheating1=="on") dishotwatermainheating = "Yes";
        var eleccooling1 = request.body.electricity_used_for_cooling;
        var eleccooling = "No";
        if(eleccooling1 == "on") eleccooling = "Yes";
        var gascooling1 = request.body.natural_gas_used_for_cooling;
        var gascooling = "No";
        if(gascooling1=="on") gascooling = "Yes";
        var fuelcooling1 = request.body.fuel_oil_used_for_cooling;
        var fuelcooling = "No";
        if(fuelcooling1=="on") fuelcooling = "Yes";
        var propanecooling1 = request.body.propane_used_for_cooling;
        var propanecooling = "No";
        if(propanecooling1=="on") propanecooling = "Yes";
        var dissteamcooling1 = request.body.district_steam_used_for_cooling;
        var dissteamcooling = "No";
        if(dissteamcooling1=="on") dissteamcooling = "Yes"; 
        var dishotwatercooling1 = request.body.district_hot_water_used_for_cooling;
        var dishotwatercooling = "No";
        if(dishotwatercooling1=="on") dishotwatercooling = "Yes";
        var dischilledwatercooling1 = request.body.district_chilled_water_used_for_cooling;
        var dischilledwatercooling = "No";
        if(dischilledwatercooling1=="on") dischilledwatercooling = "Yes";
        var elecwaterheating1 = request.body.electricity_used_for_water_heating;
        var elecwaterheating = "No";
        if(elecwaterheating1=="on") elecwaterheating = "Yes";
        var gaswaterheating1 = request.body.natural_gas_used_for_water_heating;
        var gaswaterheating = "No";
        if(gaswaterheating1=="on") gaswaterheating="Yes";
        var fuelwaterheating1 = request.body.fuel_oil_used_for_water_heating;
        var fuelwaterheating = "No";
        if(fuelwaterheating1=="on") fuelwaterheating = "Yes";
        var propanewaterheating1 = request.body.propane_used_for_water_heating;
        var propanewaterheating = "No";
        if(propanewaterheating1=="on") propanewaterheating = "Yes";
        var dissteamwaterheating1 = request.body.district_steam_water_heating;
        var dissteamwaterheating = "No";
        if(dissteamwaterheating1=="on") dissteamwaterheating = "Yes";
        var dishotwaterwaterheating1 = request.body.district_hot_water_used_for_water_heating;
        var dishotwaterwaterheating = "No";
        if(dishotwaterwaterheating1=="on") dishotwaterwaterheating = "Yes";
        
        
        var xlsx = require('node-xlsx');
        var fs = require('fs');
        var buffer = xlsx.build({worksheets: [
        {"name":"Attributes", "data":[
        ["Input description", "Input", "Derived input", "", "", "Uncertainty specification"],
        ["Project name", buildingname, buildingname, "", "", ""],
        ["Settings","Show", "", "", "", ""],
        ["Conduction modeling","Radiant Time Series (Default)", 0, "", "", ""],
        ["Zoning","Single-zone (Default)", 0, "", "", ""],
        ["Economic Analysis","Run (Default)", 1, "", "", ""],
        ["Occupancy Schedule","Unspecified", 0, "", "", "UNSPECIFIED"],
        ["Lighting Schedule","Unspecified", 0, "", "", "UNSPECIFIED"],
        ["HVAC Schedule","Unspecified", 0, "", "", ""],
        ["Metered Data","Unspecified", 0, "", "", ""],
        ["Package Optimization settings","Do Not Run", 0, "", "", ""],
        ["Calibration settings","Do Not Run", 0, "", "", ""],
        ["ECM Selection and Configuration","", "", "", "", ""],
        ["Location","", "", "", "", ""],
        ["Country","", 0, "", "", ""],
        ["State",buildingstate, buildingstate, "", "", ""],
        ["City","", "UNSPECIFIED", "", "", ""],
        ["Climate",buildingclimate, 724080, "", "", ""],
        ["Climate file name","", "", "", "", ""],
        ["HDD","", "UNSPECIFIED", "", "", ""],
        ["CDD","", "UNSPECIFIED", "", "", ""],
        ["No of buildings of this type","", "UNSPECIFIED", "", "", ""],
        ["Census region","", "UNSPECIFIED", "", "", ""],
        ["Census division","", "UNSPECIFIED", "", "", ""],
        ["Climate zone (30-year average)","", "UNSPECIFIED", "", "", ""],
        ["Shape/Size","","", "", "", ""],
        ["Square Footage",grossfloorarea, grossfloorarea, "", "", ""],
        ["Number of floors",numberoffloors, numberoffloors, "", "", ""],
        ["Building shape",shape, shapenum, "", "", ""],
        ["Total Building Height (ft)",totalbuildingheight, totalbuildingheight, "", "", ""],
        ["Perimeter (ft)",buildingperimeter, buildingperimeter, "", "", ""],
        ["Usage", "", "", "", "", ""],
        ["Principal building activity",buildingfunction, buildingfunctionnum, "", "", ""],
        ["More specific building activity",buildingactivitytype, buildingactivitytypenum, "", "", ""],
        ["Number of employees during main shift",numberofemployeeduringmainshift, numberofemployeeduringmainshift, "", "", ""],
        ["Operating Schedule (Opening and closing times)","","", "", "", ""],
        ["Operating Schedule Data Source","User Defined (Simple)", "User Defined (Simple)", "", "", ""],
        ["Open 24 hours a day",open24hoursaday, open24hoursaday, "", "", ""],
        ["Total weekly operating hours",totalweeklyoperatinghours,totalweeklyoperatinghours, "", "", ""],
        ["Open during week",openduringweek,openduringweek, "", "", ""],
        ["Open on weekend",openonweekend, openonweekend, "", "", ""],
        ["Weekday, Open",{"value": weekdayopen, "formatCode": "General"}, {"value": weekdayopen, "formatCode": "General"}, "", "", ""],
        ["Weekday, Close",{"value": weekdayclose, "formatCode": "General"},{"value": weekdayclose, "formatCode": "General"}, "", "", ""],
        ["Sat, Open",{"value": satopen, "formatCode": "General"}, {"value": satopen, "formatCode": "General"}, "", "", ""],
        ["Sat, Close",{"value":satclose, "formatCode": "General"}, {"value":satclose, "formatCode": "General"}, "", "", ""],
        ["Sun, Open",{"value": sunopen, "formatCode": "General"},{"value": sunopen, "formatCode": "General"}, "", "", ""],
        ["Sun, Close",{"value": sunclose, "formatCode": "General"}, {"value": sunclose, "formatCode": "General"}, "", "", ""],
        ["End Use Type","","", "", "", ""],
        ["Electricity used for main heating",elecmainheating, elecmainheating=='Yes'?1:2, "", "", ""],
        ["Natural gas used for main heating",gasmainheating, gasmainheating=='Yes'?1:2, "", "", ""],
        ["Fuel oil used for main heating",fuelmainheating, fuelmainheating=='Yes'?1:2, "", "", ""],
        ["Propane used for main heating",propanemainheating, propanemainheating=='Yes'?1:2, "", "", ""],
        ["District steam used for main heating",dissteammainheating, dissteammainheating=='Yes'?1:2, "", "", ""],
        ["District hot water used for main heating",dishotwatermainheating, dishotwatermainheating=='Yes'?1:2, "", "", ""],
        ["Electricity used for cooling",eleccooling, eleccooling=='Yes'?1:2, "", "", ""],
        ["Natural gas used for cooling",gascooling, gascooling=='Yes'?1:2, "", "", ""],
        ["Fuel oil used for cooling",fuelcooling, fuelcooling=='Yes'?1:2, "", "", ""],
        ["Propane used for cooling",propanecooling, propanecooling=='Yes'?1:2, "", "", ""],
        ["District steam used for cooling",dissteamcooling, dissteamcooling=='Yes'?1:2, "", "", ""],
        ["District hot water used for cooling",dishotwatercooling, dishotwatercooling=='Yes'?1:2, "", "", ""],
        ["District chilled water used for cooling",dischilledwatercooling, dischilledwatercooling=='Yes'?1:2, "", "", ""],
        ["Electricity used for water heating",elecwaterheating, elecwaterheating=='Yes'?1:2, "", "", ""],
        ["Natural gas used for water heating",gaswaterheating, gaswaterheating=='Yes'?1:2, "", "", ""],
        ["Fuel oil used for water heating",fuelwaterheating, fuelwaterheating=='Yes'?1:2, "", "", ""],
        ["Propane used for water heating",propanewaterheating, propanewaterheating=='Yes'?1:2, "", "", ""],
        ["District steam used for water heating",dissteamwaterheating, dissteamwaterheating=='Yes'?1:2, "", "", ""],
        ["District hot water used for water heating",dishotwaterwaterheating, dishotwaterwaterheating=='Yes'?1:2, "", "", ""],
        ["Source energy conversion for electricity specification","Unspecified", "UNSPECIFIED", "", "", ""],
        ["Source energy conversion factor for electricity","","UNSPECIFIED", "", "", ""],
        ["Type of source energy used for electricity generation","","UNSPECIFIED", "", "", ""],
        ["Source energy conversion factor for district heat","","UNSPECIFIED", "", "", ""],
        ["Source energy conversion factor for district chilled water","","UNSPECIFIED", "", "", ""],
        ["HVAC Equipment","","", "", "", ""],
        ["Primary HVAC System Type",primaryhvactype, primaryhvactype, "", "", ""],
        ["Airside Economizer","", 2, "", "", ""],
        ["Airside Energy Recovery","",2, "", "", ""],
        ["Ventilation Scheduled with Occupancy (MaxCFM / MinCFM)","", 1, "", "", ""],
        ["Max OA CFM - CFM while occupied","",  "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["OA damper control outside of economizer operation for VAV system","", "UNSPECIFIED", "", "", ""],
        ["OA damper position (%)","", "UNSPECIFIED", "", "", ""],
        ["Demand Control Ventilation","", 2, "", "", ""],
        ["Natural Ventilation","", 2, "", "", ""],
        ["Natural Ventilation Precooling","", 2, "", "", ""],
        ["Maximum Supply Air Flow (CFM)","", "UNSPECIFIED", "", "", ""],
        ["Minimum VAV damper position (%)","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Fan power input description","Specified by size", 1, "", "", ""],
        ["Supply Fan Total Rated Power (kW)","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Return Fan Total Rated Power (kW)","", "UNSPECIFIED", "", "", "", "", "", ""],
        ["Total Zone Fan Rated Power (kW)","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Supply Fan Specific Power (kW/(m3/s))","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Return Fan Specific Power (kW/(m3/s))","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Zone Fan Specific Power (kW/(m3/s))","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["DOAS Fan Specific Power (kW/(m3/s))","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Fan coil cycling","", 2, "", "", ""],
        ["Static Pressure Reset","", 2, "", "", ""],
        ["Fan With VFD","", 2, "", "", ""],
        ["Dual Duct System Operation","", "UNSPECIFIED", "", "", ""],
        ["Humidity Control For Dual Duct Bypass Mode","", 1, "", "", ""],
        ["Hot Water Pump Power (kW)","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Hot Water Loop Pump - Variable Flow","", 2, "", "", ""],
        ["Hot Water Loop Pump - VFD","", 2, "", "", ""],
        ["Chilled Water Pump Power (kW)","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Chilled Water Loop Pump - Variable Flow","", 2, "", "", ""],
        ["Chilled Water Loop Pump - VFD","", 2, "", "", ""],
        ["Condenser Pump Power (kW)","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Condenser Water Loop Pump - Variable Flow","", 2, "", "", ""],
        ["Condenser Water Loop Pump - VFD","", 2, "", "", ""],
        ["Condenser cooling media","", "UNSPECIFIED", "", "", ""],
        ["Aircooled Condenser/ Cooling Tower Rated Capacity (kBTU/h)","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Aircooled Condenser/Cooling Tower Power Consumption (kW)","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Efficiency of Hot Water System","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["COP of Refrigeration System","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["COP of Primary Cooling","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Evaporative Indirect Cooling","", 2, "", "", ""],
        ["Direct Evaporative Cooling    ","", 2, "", "", ""],
        ["Dessicant Dehumidification With SWH","", 2, "", "", ""],
        ["Waterside Economizer","", 2, "", "", ""],
        ["Absorption Chiller With SWH","", 2, "", "", ""],
        ["Night Ventilation Precooling","", 2, "", "", ""],
        ["Efficiency/COP of Primary Heating","","UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Solar Heating","", 2, "", "", ""],
        ["HVAC Nominal Temperature Conditions","", "", "", "", ""],
        ["Design Heating Supply Temperature (Degree F)","", 120, "", "", "UNSPECIFIED"],
        ["Design Cooling Supply Temperature (Degree F)","", 55, "", "", "UNSPECIFIED"],
        ["For Dual Duct Systems: Temperature Of The Hot Deck (Degree F)","", 85, "", "", "UNSPECIFIED"],
        ["Design Preheat Temperature (Degree F)","", 45, "", "", "UNSPECIFIED"],
        ["Cooling Coil Design Leaving Temperature (Degree F)","", 55, "", "", "UNSPECIFIED"],
        ["Supply Air Temperature Reset - Function Of Outside Temp","", 2, "", "", ""],
        ["Supply Air Temperature Reset - Optimal Control","", 2, "", "", ""],
        ["Temperature Set Points    ","", "", "", "", ""],
        ["Cooling set up implementation","", 2, "", "", ""],
        ["Heating set back implementation","", 2, "", "", ""],
        ["Cooling Set Point (Degree F)","", 78, "", "", "UNSPECIFIED"],
        ["Cooling Set Back (Degree F)","", 95, "", "", "UNSPECIFIED"],
        ["Heating Set Point (Degree F)","", 68, "", "", "UNSPECIFIED"],
        ["Heating Set Back (Degree F)","", 60, "", "", "UNSPECIFIED"],
        ["Occupant Load","", "", "", "", ""],
        ["Occupant load description","Specified by seating / bed capacity", "Specified by seating / bed capacity", "", "", "UNSPECIFIED"],
        ["Number of total occupants (excluding employees)","", "UNSPECIFIED", "", "", ""],
        ["Religious worship seating capacity","", "UNSPECIFIED", "", "", ""],
        ["Assembly seating capacity","", "UNSPECIFIED", "", "", ""],
        ["Number of classroom seating capacity","", "UNSPECIFIED", "", "", ""],
        ["Food service seating capacity","", "UNSPECIFIED", "", "", ""],
        ["Licensed bed capacity","", "UNSPECIFIED", "", "", ""],
        ["Plug and Process Load","", "", "", "", ""],
        ["Plug and process load description","Specified per equipment type", "Specified per equipment type", "", "", "UNSPECIFIED"],
        ["Number of computers","", "UNSPECIFIED", "", "", ""],
        ["Flat screen monitors","", "UNSPECIFIED", "", "", ""],
        ["Number of servers","", "UNSPECIFIED", "", "", ""],
        ["Number of cash registers","", "UNSPECIFIED", "", "", ""],
        ["Number of printers","", "UNSPECIFIED", "", "", ""],
        ["Type of printers","","UNSPECIFIED", "", "", ""],
        ["Number of photocopiers","","UNSPECIFIED", "", "", ""],
        ["Number of residential refrigerators","", "UNSPECIFIED", "", "", ""],
        ["Number of elevators","", "UNSPECIFIED", "", "", ""],
        ["Number of vending machines","", "UNSPECIFIED", "", "", ""],
        ["Plug Load Power Density (Watts/ft^2)","", "UNSPECIFIED", "", "", ""],
        ["Lighting Load","", "", "", "", ""],
        ["Interior Lighting Power Density (Watts/ft^2)","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Occupancy Sensors","", 2, "", "", ""],
        ["Daylight-based Dimming","", 2, "", "", ""],
        ["Added Daylight","", 2, "", "", ""],
        ["Light Shelves","", 2, "", "", ""],
        ["Refrigeration Load","", "", "", "", ""],
        ["Refrigeration in conditioned space","Yes", 1, "", "", ""],
        ["Refrigeration Power Density (Watts/ft^2)","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Hot Water Usage","", "", "", "", ""],
        ["Hot water usage rate data source","", "UNSPECIFIED", "", "", ""],
        ["Hot water usage rate (l / (Person Day))","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Infiltration Load","", "", "", "", ""],
        ["Leakage Rate","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["User defined leakage rate (CFM/SqFt of outside wall)","","", "", "", ""],
        ["Fenestration and Conduction Load","", "", "", "", ""],
        ["Percent exterior glass (With respect to wall area)","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Angular Solar Dependency","No", "No", "", "", ""],
        ["Angular Solar Dependency Data Specification","", "UNSPECIFIED", "", "", ""],
        ["How much of the total window area is on the surface with azimuth 0 + Orientation shift (percentage of overall window area)","", "UNSPECIFIED", "", "", ""],
        ["How much of the total window area is on the surface with azimuth 90 + Orientation shift (percentage of overall window area)","", "UNSPECIFIED", "", "", ""],
        ["How much of the total window area is on the surface with azimuth 180 + Orientation shift (percentage of overall window area)","", "UNSPECIFIED", "", "", ""],
        ["How much of the total window area is on the surface with azimuth -90 + Orientation shift (percentage of overall window area)","", "UNSPECIFIED", "", "", ""],
        ["Length of the wall with surface azimuth 0 + Orientation shift (ft)","", "UNSPECIFIED", "", "", ""],
        ["Window percentage on the wall with with surface azimuth 0 + Orientation shift","", "UNSPECIFIED", "", "", ""],
        ["Length of the wall with surface azimuth 90 + Orientation shift (ft)","", "UNSPECIFIED", "", "", ""],
        ["Window percentage on the wall with with surface azimuth 90 + Orientation shift","", "UNSPECIFIED", "", "", ""],
        ["Length of the wall with surface azimuth 180 + Orientation shift (ft)","", "UNSPECIFIED", "", "", ""],
        ["Window percentage on the wall with with surface azimuth 180 + Orientation shift","", "UNSPECIFIED", "", "", ""],
        ["Length of the wall with surface azimuth -90 + Orientation shift (ft)","", "UNSPECIFIED", "", "", ""],
        ["Window percentage on the wall with with surface azimuth -90 + Orientation shift","", "UNSPECIFIED", "", "", ""],
        ["Orientation shift - If the building orientation is shifted (Positive clockwise)","", "UNSPECIFIED", "", "", ""],
        ["Window glass type","", "UNSPECIFIED", "", "", ""],
        ["Window Visual Transmitivity (fraction)","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Window U value (Btu/(hr ft^2 F))","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Window Solar Heat Gain Coeff","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["SHGC at 0 degree incident angle","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["SHGC at 40 degree incident angle","", "UNSPECIFIED", "", "", ""],
        ["SHGC at 50 degree incident angle","", "UNSPECIFIED", "", "", ""],
        ["SHGC at 60 degree incident angle","", "UNSPECIFIED", "", "", ""],
        ["SHGC at 70 degree incident angle","", "UNSPECIFIED", "", "", ""],
        ["SHGC at 80 degree incident angle","", "UNSPECIFIED", "", "", ""],
        ["SHGC at 90 degree incident angle","", "UNSPECIFIED", "", "", ""],
        ["Hemispherical SHGC","", "UNSPECIFIED", "", "", ""],
        ["Tinted window glass","", "UNSPECIFIED", "", "", ""],
        ["Reflective window glass","", "UNSPECIFIED", "", "", ""],
        ["Wall and Roof Conduction","", "", "", "", ""],
        ["Wall construction material","", "UNSPECIFIED", "", "", ""],
        ["Roof construction material","", "UNSPECIFIED", "", "", ""],
        ["Carpeting","", 0, "", "", ""],
        ["Uwall (Btu/h-ft^2-F)","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Uroof (Btu/h-ft^2-F)","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Cool Roof","", 2, "", "", ""],
        ["Active External Shading","", 2, "", "", ""],
        ["Trees","", 2, "", "", ""],
        ["Freestanding building","", "UNSPECIFIED", "", "", ""],
        ["Ground Conduction","", "", "", "", ""],
        ["Ground properties","Unspecified", "UNSPECIFIED", "", "", ""],
        ["Uground (Btu/h-ft^2-F)	","", "UNSPECIFIED", "", "", "UNSPECIFIED"],
        ["Internal Thermal Mass Load	","", "", "", "", ""],
        ["Ratio of internal wall perimeter/building perimeter","", "UNSPECIFIED", "", "", "UNSPECIED"]
        
        ]}
         ]});
        
        var timestamp = timestp.createTimestamp();
        var filename = (buildingname.replace(/\s+/g, '-') || "NoName")+ timestamp;
        fs.mkdirSync('../utrc/'+filename);
         fs.writeFileSync("../utrc/"+filename+"/"+filename+".xlsx", buffer);
         
        var config = "<configuration>\n"+
        "\t<ParallelComputation>false</ParallelComputation>\n"+
        "\t<WithCalib>false</WithCalib>\n"+
        "\t<Unspecified_label>'UNSPECIFIED'</Unspecified_label>\n"+
        "\t<WithInitialCalibrationOfSchedules>false</WithInitialCalibrationOfSchedules>\n"+
        "\t<plot>false</plot>\n"+
        "\t<Stage>'StageI_baseline_func'</Stage>\n"+
        "\t<inputFileName>'../../../../../../utrc/"+ filename+ "/" + filename +".xlsx'</inputFileName>\n"+
        "</configuration>\n";  
         
        fs.writeFileSync("../utrc/"+filename+"/"+"example.xml", config);
        shelljs.echo('hello world');
        
		
		var exec = require('child_process').exec;
		exec('scp -r ../utrc/'+filename +'/ platform@128.118.67.221:/home/platform/utrc/', function(err, stdout, stderr) {
		
	    var command = 'ssh platform@128.118.67.221 \"cd ~/ESTCP_exe_LINUX_3.0rc15_HUB/06_ToolVersions/trunk/development/templates/Individual_Bldg/; ./run_DeepRetro.sh /usr/local/MATLAB/MATLAB_Compiler_Runtime/v717/ ~/utrc/' + filename + '/example.xml; cp Outputs/OutputStageI/Output_StageI.csv ~/utrc/' + filename + '\"';
        
		exec(command, function(err2, stdout2, stderr2) {

		var str = '';
		var filename1 = '../utrc/Output_StageI.csv';
		fs.readFile(filename1, 'utf8', function(err, data) {   
			str = str + data.to_s;
		});
		console.log(str);
		var arr = str.split(/[,\n]+/);
		arr.splice(0,3);

		console.log(arr);
         
        var data1 = xlsx.parse('../utrc/Output_StageI.xlsx'); 
        var elec_heat01 = data1.worksheets[4].data[1][1].value;
        var elec_heat02 = data1.worksheets[4].data[1][2].value;
        var elec_heat03 = data1.worksheets[4].data[1][3].value;
        var elec_heat04 = data1.worksheets[4].data[1][4].value;
        var elec_heat05 = data1.worksheets[4].data[1][5].value;
        var elec_heat06 = data1.worksheets[4].data[1][6].value;
        var elec_heat07 = data1.worksheets[4].data[1][7].value;
        var elec_heat08 = data1.worksheets[4].data[1][8].value;
        var elec_heat09 = data1.worksheets[4].data[1][9].value;
        var elec_heat10 = data1.worksheets[4].data[1][10].value;
        var elec_heat11 = data1.worksheets[4].data[1][11].value;
        var elec_heat12 = data1.worksheets[4].data[1][12].value;

        var elec_heat = [elec_heat01,elec_heat02,elec_heat03,elec_heat04,elec_heat05,elec_heat06,elec_heat07,elec_heat08,elec_heat09,elec_heat10,elec_heat11,elec_heat12];
        
        var elec_pump01 = data1.worksheets[4].data[2][1].value;
        var elec_pump02 = data1.worksheets[4].data[2][2].value;
        var elec_pump03 = data1.worksheets[4].data[2][3].value;
        var elec_pump04 = data1.worksheets[4].data[2][4].value;
        var elec_pump05 = data1.worksheets[4].data[2][5].value;
        var elec_pump06 = data1.worksheets[4].data[2][6].value;
        var elec_pump07 = data1.worksheets[4].data[2][7].value;
        var elec_pump08 = data1.worksheets[4].data[2][8].value;
        var elec_pump09 = data1.worksheets[4].data[2][9].value;
        var elec_pump10 = data1.worksheets[4].data[2][10].value;
        var elec_pump11 = data1.worksheets[4].data[2][11].value;
        var elec_pump12 = data1.worksheets[4].data[2][12].value;

        var elec_pump = [elec_pump01,elec_pump02,elec_pump03,elec_pump04,elec_pump05,elec_pump06,elec_pump07,elec_pump08,elec_pump09,elec_pump10,elec_pump11,elec_pump12];
        
        var elec_cool01 = data1.worksheets[4].data[3][1].value;
        var elec_cool02 = data1.worksheets[4].data[3][2].value;
        var elec_cool03 = data1.worksheets[4].data[3][3].value;
        var elec_cool04 = data1.worksheets[4].data[3][4].value;
        var elec_cool05 = data1.worksheets[4].data[3][5].value;
        var elec_cool06 = data1.worksheets[4].data[3][6].value;
        var elec_cool07 = data1.worksheets[4].data[3][7].value;
        var elec_cool08 = data1.worksheets[4].data[3][8].value;
        var elec_cool09 = data1.worksheets[4].data[3][9].value;
        var elec_cool10 = data1.worksheets[4].data[3][10].value;
        var elec_cool11 = data1.worksheets[4].data[3][11].value;
        var elec_cool12 = data1.worksheets[4].data[3][12].value;

        var elec_cool = [elec_cool01,elec_cool02,elec_cool03,elec_cool04,elec_cool05,elec_cool06,elec_cool07,elec_cool08,elec_cool09,elec_cool10,elec_cool11,elec_cool12];
        
        var elec_light01 = data1.worksheets[4].data[4][1].value;
        var elec_light02 = data1.worksheets[4].data[4][2].value;
        var elec_light03 = data1.worksheets[4].data[4][3].value;
        var elec_light04 = data1.worksheets[4].data[4][4].value;
        var elec_light05 = data1.worksheets[4].data[4][5].value;
        var elec_light06 = data1.worksheets[4].data[4][6].value;
        var elec_light07 = data1.worksheets[4].data[4][7].value;
        var elec_light08 = data1.worksheets[4].data[4][8].value;
        var elec_light09 = data1.worksheets[4].data[4][9].value;
        var elec_light10 = data1.worksheets[4].data[4][10].value;
        var elec_light11 = data1.worksheets[4].data[4][11].value;
        var elec_light12 = data1.worksheets[4].data[4][12].value;

        var elec_light = [elec_light01,elec_light02,elec_light03,elec_light04,elec_light05,elec_light06,elec_light07,elec_light08,elec_light09,elec_light10,elec_light11,elec_light12];
        
        var elec_equip01 = data1.worksheets[4].data[5][1].value;
        var elec_equip02 = data1.worksheets[4].data[5][2].value;
        var elec_equip03 = data1.worksheets[4].data[5][3].value;
        var elec_equip04 = data1.worksheets[4].data[5][4].value;
        var elec_equip05 = data1.worksheets[4].data[5][5].value;
        var elec_equip06 = data1.worksheets[4].data[5][6].value;
        var elec_equip07 = data1.worksheets[4].data[5][7].value;
        var elec_equip08 = data1.worksheets[4].data[5][8].value;
        var elec_equip09 = data1.worksheets[4].data[5][9].value;
        var elec_equip10 = data1.worksheets[4].data[5][10].value;
        var elec_equip11 = data1.worksheets[4].data[5][11].value;
        var elec_equip12 = data1.worksheets[4].data[5][12].value;

        var elec_equip = [elec_equip01,elec_equip02,elec_equip03,elec_equip04,elec_equip05,elec_equip06,elec_equip07,elec_equip08,elec_equip09,elec_equip10,elec_equip11,elec_equip12];
        
        var elec_ref01 = data1.worksheets[4].data[6][1].value;
        var elec_ref02 = data1.worksheets[4].data[6][2].value;
        var elec_ref03 = data1.worksheets[4].data[6][3].value;
        var elec_ref04 = data1.worksheets[4].data[6][4].value;
        var elec_ref05 = data1.worksheets[4].data[6][5].value;
        var elec_ref06 = data1.worksheets[4].data[6][6].value;
        var elec_ref07 = data1.worksheets[4].data[6][7].value;
        var elec_ref08 = data1.worksheets[4].data[6][8].value;
        var elec_ref09 = data1.worksheets[4].data[6][9].value;
        var elec_ref10 = data1.worksheets[4].data[6][10].value;
        var elec_ref11 = data1.worksheets[4].data[6][11].value;
        var elec_ref12 = data1.worksheets[4].data[6][12].value;

        var elec_ref = [elec_ref01,elec_ref02,elec_ref03,elec_ref04,elec_ref05,elec_ref06,elec_ref07,elec_ref08,elec_ref09,elec_ref10,elec_ref11,elec_ref12];
        
        var elec_fan01 = data1.worksheets[4].data[7][1].value;
        var elec_fan02 = data1.worksheets[4].data[7][2].value;
        var elec_fan03 = data1.worksheets[4].data[7][3].value;
        var elec_fan04 = data1.worksheets[4].data[7][4].value;
        var elec_fan05 = data1.worksheets[4].data[7][5].value;
        var elec_fan06 = data1.worksheets[4].data[7][6].value;
        var elec_fan07 = data1.worksheets[4].data[7][7].value;
        var elec_fan08 = data1.worksheets[4].data[7][8].value;
        var elec_fan09 = data1.worksheets[4].data[7][9].value;
        var elec_fan10 = data1.worksheets[4].data[7][10].value;
        var elec_fan11 = data1.worksheets[4].data[7][11].value;
        var elec_fan12 = data1.worksheets[4].data[7][12].value;

        var elec_fan = [elec_fan01,elec_fan02,elec_fan03,elec_fan04,elec_fan05,elec_fan06,elec_fan07,elec_fan08,elec_fan09,elec_fan10,elec_fan11,elec_fan12];
        
        var elec_water01 = data1.worksheets[4].data[8][1].value;
        var elec_water02 = data1.worksheets[4].data[8][2].value;
        var elec_water03 = data1.worksheets[4].data[8][3].value;
        var elec_water04 = data1.worksheets[4].data[8][4].value;
        var elec_water05 = data1.worksheets[4].data[8][5].value;
        var elec_water06 = data1.worksheets[4].data[8][6].value;
        var elec_water07 = data1.worksheets[4].data[8][7].value;
        var elec_water08 = data1.worksheets[4].data[8][8].value;
        var elec_water09 = data1.worksheets[4].data[8][9].value;
        var elec_water10 = data1.worksheets[4].data[8][10].value;
        var elec_water11 = data1.worksheets[4].data[8][11].value;
        var elec_water12 = data1.worksheets[4].data[8][12].value;

        var elec_water = [elec_water01,elec_water02,elec_water03,elec_water04,elec_water05,elec_water06,elec_water07,elec_water08,elec_water09,elec_water10,elec_water11,elec_water12];
        
        var gas_water01 = data1.worksheets[5].data[1][1].value;
        var gas_water02 = data1.worksheets[5].data[1][2].value;
        var gas_water03 = data1.worksheets[5].data[1][3].value;
        var gas_water04 = data1.worksheets[5].data[1][4].value;
        var gas_water05 = data1.worksheets[5].data[1][5].value;
        var gas_water06 = data1.worksheets[5].data[1][6].value;
        var gas_water07 = data1.worksheets[5].data[1][7].value;
        var gas_water08 = data1.worksheets[5].data[1][8].value;
        var gas_water09 = data1.worksheets[5].data[1][9].value;
        var gas_water10 = data1.worksheets[5].data[1][10].value;
        var gas_water11 = data1.worksheets[5].data[1][11].value;
        var gas_water12 = data1.worksheets[5].data[1][12].value;

        var gas_water = [gas_water01,gas_water02,gas_water03,gas_water04,gas_water05,gas_water06,gas_water07,gas_water08,gas_water09,gas_water10,gas_water11,gas_water12];
        
        var gas_cool01 = data1.worksheets[5].data[2][1].value;
        var gas_cool02 = data1.worksheets[5].data[2][2].value;
        var gas_cool03 = data1.worksheets[5].data[2][3].value;
        var gas_cool04 = data1.worksheets[5].data[2][4].value;
        var gas_cool05 = data1.worksheets[5].data[2][5].value;
        var gas_cool06 = data1.worksheets[5].data[2][6].value;
        var gas_cool07 = data1.worksheets[5].data[2][7].value;
        var gas_cool08 = data1.worksheets[5].data[2][8].value;
        var gas_cool09 = data1.worksheets[5].data[2][9].value;
        var gas_cool10 = data1.worksheets[5].data[2][10].value;
        var gas_cool11 = data1.worksheets[5].data[2][11].value;
        var gas_cool12 = data1.worksheets[5].data[2][12].value;

        var gas_cool = [gas_cool01,gas_cool02,gas_cool03,gas_cool04,gas_cool05,gas_cool06,gas_cool07,gas_cool08,gas_cool09,gas_cool10,gas_cool11,gas_cool12];
        
        var gas_heat01 = data1.worksheets[5].data[3][1].value;
        var gas_heat02 = data1.worksheets[5].data[3][2].value;
        var gas_heat03 = data1.worksheets[5].data[3][3].value;
        var gas_heat04 = data1.worksheets[5].data[3][4].value;
        var gas_heat05 = data1.worksheets[5].data[3][5].value;
        var gas_heat06 = data1.worksheets[5].data[3][6].value;
        var gas_heat07 = data1.worksheets[5].data[3][7].value;
        var gas_heat08 = data1.worksheets[5].data[3][8].value;
        var gas_heat09 = data1.worksheets[5].data[3][9].value;
        var gas_heat10 = data1.worksheets[5].data[3][10].value;
        var gas_heat11 = data1.worksheets[5].data[3][11].value;
        var gas_heat12 = data1.worksheets[5].data[3][12].value;

        var gas_heat = [gas_heat01,gas_heat02,gas_heat03,gas_heat04,gas_heat05,gas_heat06,gas_heat07,gas_heat08,gas_heat09,gas_heat10,gas_heat11,gas_heat12];
        
        var bs_elec01 = data1.worksheets[3].data[2][1].value;
        var bs_elec02 = data1.worksheets[3].data[3][1].value;
        var bs_elec03 = data1.worksheets[3].data[4][1].value;
        var bs_elec04 = data1.worksheets[3].data[5][1].value;
        var bs_elec05 = data1.worksheets[3].data[6][1].value;
        var bs_elec06 = data1.worksheets[3].data[7][1].value;
        var bs_elec07 = data1.worksheets[3].data[8][1].value;
        var bs_elec08 = data1.worksheets[3].data[9][1].value;
        var bs_elec09 = data1.worksheets[3].data[10][1].value;

        var bs_elec0 = [bs_elec01,bs_elec02,bs_elec03,bs_elec04,bs_elec05,bs_elec06,bs_elec07,bs_elec08,bs_elec09];
        
        var bs_elec11 = data1.worksheets[3].data[2][2].value;
        var bs_elec12 = data1.worksheets[3].data[3][2].value;
        var bs_elec13 = data1.worksheets[3].data[4][2].value;
        var bs_elec14 = data1.worksheets[3].data[5][2].value;
        var bs_elec15 = data1.worksheets[3].data[6][2].value;
        var bs_elec16 = data1.worksheets[3].data[7][2].value;
        var bs_elec17 = data1.worksheets[3].data[8][2].value;
        var bs_elec18 = data1.worksheets[3].data[9][2].value;
        var bs_elec19 = data1.worksheets[3].data[10][2].value;

        var bs_elec1 = [bs_elec11,bs_elec12,bs_elec13,bs_elec14,bs_elec15,bs_elec16,bs_elec17,bs_elec18,bs_elec19];

        var bs_gas01 = data1.worksheets[3].data[12][1].value;
        var bs_gas02 = data1.worksheets[3].data[13][1].value;
        var bs_gas03 = data1.worksheets[3].data[14][1].value;
        var bs_gas04 = data1.worksheets[3].data[15][1].value;
        
        var bs_gas0 = [bs_gas01,bs_gas02,bs_gas03,bs_gas04];
        
        var bs_gas11 = data1.worksheets[3].data[12][2].value;
        var bs_gas12 = data1.worksheets[3].data[13][2].value;
        var bs_gas13 = data1.worksheets[3].data[14][2].value;
        var bs_gas14 = data1.worksheets[3].data[15][2].value;
        
        var bs_gas1 = [bs_gas11,bs_gas12,bs_gas13,bs_gas14];
        
        var bldname = filename;
        response.render('substantialresults', {
            'bldname': bldname,
            'elec_heat': elec_heat,
            'elec_pump': elec_pump,
            'elec_cool': elec_cool,
            'elec_light': elec_light,
            'elec_equip': elec_equip,
            'elec_ref': elec_ref,
            'elec_fan': elec_fan,
            'elec_water': elec_water,
            'gas_water': gas_water,
            'gas_cool': gas_cool,
            'gas_heat': gas_heat,
            'bs_elec0': bs_elec0,
            'bs_elec1': bs_elec1,
            'bs_gas0': bs_gas0,
            'bs_gas1': bs_gas1,
         
        });
        
        response.render('substantialresults', {
        'bldname': bldname,
        'elec_heat': elec_heat,
        'elec_pump': elec_pump,
        'elec_cool': elec_cool,
        'elec_light': elec_light,
        'elec_equip': elec_equip,
        'elec_ref': elec_ref,
        'elec_fan': elec_fan,
        'elec_water': elec_water,
        'gas_water': gas_water,
        'gas_cool': gas_cool,
        'gas_heat': gas_heat,
        'bs_elec0': bs_elec0,
        'bs_elec1': bs_elec1,
        'bs_gas0': bs_gas0,
        'bs_gas1': bs_gas1,
     
    });
    
    
    response.render('substantialresults', {
        'bldname': bldname,
        'elec_heat': elec_heat,
        'elec_pump': elec_pump,
        'elec_cool': elec_cool,
        'elec_light': elec_light,
        'elec_equip': elec_equip,
        'elec_ref': elec_ref,
        'elec_fan': elec_fan,
        'elec_water': elec_water,
        'gas_water': gas_water,
        'gas_cool': gas_cool,
        'gas_heat': gas_heat,
        'bs_elec0': bs_elec0,
        'bs_elec1': bs_elec1,
        'bs_gas0': bs_gas0,
        'bs_gas1': bs_gas1,
    });
     
        
 	});
 	});
	
    }
    
    
    
    
};

        
