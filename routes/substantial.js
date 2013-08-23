var fs = require("fs");
//var buf = require("buffer");
var timestp = require("../lib/timestamp.js");

module.exports ={

    getSubstantialInput: function(request, response) {
        var buildingname = request.body.info.building_name;
        var buildingclimate = request.body.info.building_climate;
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

        //var buildingstate = request.body.info.building_state;
        var grossfloorarea = request.body.architecture.gross_floor_area;
        var numberoffloors = request.body.architecture.number_of_floors;
        var shape = request.body.architecture.shape;
        var totalbuildingheight = request.body.architecture.total_building_height;
        var buildingfunction = request.body.info.building_function;
        var buildingactivitytype = request.body.info.building_activity_type;
        var numberofemployeeduringmainshift = request.body.occupancy.number_of_employee_during_main_shift;
        var totalweeklyoperatinghours = request.body.occupancy.total_weekly_operating_hours;
        var openduringweek = request.body.occupancy.open_during_week;
        var openonweekend = request.body.occupancy.open_on_weekend;
        var weekdayopen = request.body.occupancy.weekday_open;
        var weekdayclose = request.body.occupancy.weekday_close;
        var satopen = request.body.occupancy.sat_open;
        var satclose = request.body.occupancy.sat_close;
        var sunopen = request.body.occupancy.sun_open;
        var sunclose = request.body.occupancy.sun_close;
        var primaryhvactype = request.body.mechanical.primary_hvac_type;    
        var airsideeconomizer = request.body.mechanical.airside_economizer;
        var airsideenergyrecovery = request.body.mechanical.airside_energy_recovery;
        var demandcontroltype = request.body.mechanical.demand_control_ventilation;
        var percentexteriorglass = request.body.architecture.percent_exterior_glass;
        var windowglasstype = request.body.materials.window_glass_type;
        var walltype = request.body.materials.wall_type; 
        var rooftype = request.body.materials.roof_type;
        
        //var stringInfo = JSON.stringify(request.body.info);
        //var stringData = JSON.stringify(request.body.data);
        //var string = stringInfo + '<br/>' + stringData;
        //var route = "./views/";
        //var fileName = route + buildingName + '.ejs' ;

var timestamp = timestp.createTimestamp();
//var writeStream = fs.createWriteStream("../utrc/inputs/"+buildingname+timestamp+".xlsx");
var writeStream = fs.createWriteStream("utrc/inputs/"+buildingname+timestamp+".xlsx");


var row1    =	"Input description"+"\t"+"Input"+"\n";
var	row2	=	"Project name"+"\t"+buildingname+"\n";
var	row3	=	"Settings"+"\t"+"Show"+"\n";
var	row4	=	"Conduction modeling"+"\t"+"Radiant Time Series (Default)"+"\n";
var	row5	=	"Zoning"+"\t"+"Single-zone (Default)"+"\n";
var	row6	=	"Economic Analysis"+"\t"+"Run (Default)"+"\n";
var	row7	=	"Occupancy Schedule"+"\t"+"Unspecified"+"\n";
var	row8	=	"Lighting Schedule"+"\t"+"Unspecified"+"\n";
var	row9	=	"HVAC Schedule"+"\t"+"Unspecified"+"\n";
var	row10	=	"Metered Data"+"\t"+"User Defined"+"\n";
var	row11	=	"Package Optimization settings"+"\t"+"Do Not Run"+"\n";
var	row12	=	"Calibration settings"+"\t"+"Do Not Run"+"\n";
var	row13	=	"ECM Selection and Configuration"+"\t"+""+"\n";
var	row14	=	"Location"+"\t"+""+"\n";
var	row15	=	"Country"+"\t"+""+"\n";
var	row16	=	"State"+"\t"+buildingstate+"\n";
var	row17	=	"City"+"\t"+""+"\n";
var	row18	=	"Climate"+"\t"+buildingclimate+"\n";
var	row19	=	"Climate file name"+"\t"+""+"\n";
var	row20	=	"HDD"+"\t"+""+"\n";
var	row21	=	"CDD"+"\t"+""+"\n";
var	row22	=	"No of buildings of this type"+"\t"+""+"\n";
var	row23	=	"Census region"+"\t"+""+"\n";
var	row24	=	"Census division"+"\t"+""+"\n";
var	row25	=	"Climate zone (30-year average)"+"\t"+""+"\n";
var	row26	=	"Shape/Size"+"\t"+""+"\n";
var	row27	=	"Square Footage"+"\t"+grossfloorarea+"\n";
var	row28	=	"Number of floors"+"\t"+numberoffloors+"\n";
var	row29	=	"Building shape"+"\t"+shape+"\n";
var	row30	=	"Total Building Height (ft)"+"\t"+totalbuildingheight+"\n";
var	row31	=	"Perimeter (ft)"+"\t"+""+"\n";
var	row32	=	"Usage"+"\t"+""+"\n";
var	row33	=	"Principal building activity"+"\t"+buildingfunction+"\n";
var	row34	=	"More specific building activity"+"\t"+buildingactivitytype+"\n";
var	row35	=	"Number of employees during main shift"+"\t"+numberofemployeeduringmainshift+"\n";
var	row36	=	"Operating Schedule (Opening and closing times)"+"\t"+""+"\n";
var	row37	=	"Operating Schedule Data Source"+"\t"+"User Defined (Simple)"+"\n";
var	row38	=	"Open 24 hours a day"+"\t"+"No"+"\n";
var	row39	=	"Total weekly operating hours"+"\t"+totalweeklyoperatinghours+"\n";
var	row40	=	"Open during week"+"\t"+openduringweek+"\n";
var	row41	=	"Open on weekend"+"\t"+openonweekend+"\n";
var	row42	=	"Weekday, Open"+"\t"+weekdayopen+"\n";
var	row43	=	"Weekday, Close"+"\t"+weekdayclose+"\n";
var	row44	=	"Sat, Open"+"\t"+satopen+"\n";
var	row45	=	"Sat, Close"+"\t"+satclose+"\n";
var	row46	=	"Sun, Open"+"\t"+sunopen+"\n";
var	row47	=	"Sun, Close"+"\t"+sunclose+"\n";
var	row48	=	"End Use Type"+"\t"+""+"\n";
var	row49	=	"Electricity used for main heating"+"\t"+""+"\n";
var	row50	=	"Natural gas used for main heating"+"\t"+""+"\n";
var	row51	=	"Fuel oil used for main heating"+"\t"+""+"\n";
var	row52	=	"Propane used for main heating"+"\t"+""+"\n";
var	row53	=	"District steam used for main heating"+"\t"+""+"\n";
var	row54	=	"District hot water used for main heating"+"\t"+""+"\n";
var	row55	=	"Electricity used for cooling"+"\t"+""+"\n";
var	row56	=	"Natural gas used for cooling"+"\t"+""+"\n";
var	row57	=	"Fuel oil used for cooling"+"\t"+""+"\n";
var	row58	=	"Propane used for cooling"+"\t"+""+"\n";
var	row59	=	"District steam used for cooling"+"\t"+""+"\n";
var	row60	=	"District hot water used for cooling"+"\t"+""+"\n";
var	row61	=	"District chilled water used for cooling"+"\t"+""+"\n";
var	row62	=	"Electricity used for water heating"+"\t"+""+"\n";
var	row63	=	"Natural gas used for water heating"+"\t"+""+"\n";
var	row64	=	"Fuel oil used for water heating"+"\t"+""+"\n";
var	row65	=	"Propane used for water heating"+"\t"+""+"\n";
var	row66	=	"District steam used for water heating"+"\t"+""+"\n";
var	row67	=	"District hot water used for water heating"+"\t"+""+"\n";
var	row68	=	"Source energy conversion for electricity specification"+"\t"+"Unspecified"+"\n";
var	row69	=	"Source energy conversion factor for electricity"+"\t"+""+"\n";
var	row70	=	"Type of source energy used for electricity generation"+"\t"+"State representative"+"\n";
var	row71	=	"Source energy conversion factor for district heat"+"\t"+""+"\n";
var	row72	=	"Source energy conversion factor for district chilled water"+"\t"+""+"\n";
var	row73	=	"HVAC Equipment"+"\t"+""+"\n";
var	row74	=	"Primary HVAC System Type"+"\t"+primaryhvactype+"\n";
var	row75	=	"Airside Economizer"+"\t"+airsideeconomizer+"\n";
var	row76	=	"Airside Energy Recovery"+"\t"+airsideenergyrecovery+"\n";
var	row77	=	"Ventilation Scheduled with Occupancy (MaxCFM / MinCFM)"+"\t"+""+"\n";
var	row78	=	"Max OA CFM - CFM while occupied"+"\t"+""+"\n";
var	row79	=	"OA damper control outside of economizer operation for VAV system"+"\t"+""+"\n";
var	row80	=	"OA damper position (%)"+"\t"+""+"\n";
var	row81	=	"Demand Control Ventilation"+"\t"+demandcontroltype+"\n";
var	row82	=	"Natural Ventilation"+"\t"+""+"\n";
var	row83	=	"Natural Ventilation Precooling"+"\t"+""+"\n";
var	row84	=	"Maximum Supply Air Flow (CFM)"+"\t"+""+"\n";
var	row85	=	"Minimum VAV damper position (%)"+"\t"+""+"\n";
var	row86	=	"Fan power input description"+"\t"+"Specified by size"+"\n";
var	row87	=	"Supply Fan Total Rated Power (kW)"+"\t"+""+"\n";
var	row88	=	"Return Fan Total Rated Power (kW)"+"\t"+""+"\n";
var	row89	=	"Total Zone Fan Rated Power (kW)"+"\t"+""+"\n";
var	row90	=	"Supply Fan Specific Power (kW/(m3/s))"+"\t"+""+"\n";
var	row91	=	"Return Fan Specific Power (kW/(m3/s))"+"\t"+""+"\n";
var	row92	=	"Zone Fan Specific Power (kW/(m3/s))"+"\t"+""+"\n";
var	row93	=	"DOAS Fan Specific Power (kW/(m3/s))"+"\t"+""+"\n";
var	row94	=	"Fan coil cycling"+"\t"+""+"\n";
var	row95	=	"Static Pressure Reset"+"\t"+""+"\n";
var	row96	=	"Fan With VFD"+"\t"+""+"\n";
var	row97	=	"Dual Duct System Operation"+"\t"+""+"\n";
var	row98	=	"Humidity Control For Dual Duct Bypass Mode"+"\t"+""+"\n";
var	row99	=	"Hot Water Pump Power (kW)"+"\t"+""+"\n";
var	row100	=	"Hot Water Loop Pump - Variable Flow"+"\t"+""+"\n";
var	row101	=	"Hot Water Loop Pump - VFD"+"\t"+""+"\n";
var	row102	=	"Chilled Water Pump Power (kW)"+"\t"+""+"\n";
var	row103	=	"Chilled Water Loop Pump - Variable Flow"+"\t"+""+"\n";
var	row104	=	"Chilled Water Loop Pump - VFD"+"\t"+""+"\n";
var	row105	=	"Condenser Pump Power (kW)"+"\t"+""+"\n";
var	row106	=	"Condenser Water Loop Pump - Variable Flow"+"\t"+""+"\n";
var	row107	=	"Condenser Water Loop Pump - VFD"+"\t"+""+"\n";
var	row108	=	"Condenser cooling media"+"\t"+""+"\n";
var	row109	=	"Aircooled Condenser/ Cooling Tower Rated Capacity (kBTU/h)"+"\t"+""+"\n";
var	row110	=	"Aircooled Condenser/Cooling Tower Power Consumption (kW)"+"\t"+""+"\n";
var	row111	=	"Efficiency of Hot Water System"+"\t"+""+"\n";
var	row112	=	"COP of Refrigeration System"+"\t"+""+"\n";
var	row113	=	"COP of Primary Cooling"+"\t"+""+"\n";
var	row114	=	"Evaporative Indirect Cooling"+"\t"+""+"\n";
var	row115	=	"Direct Evaporative Cooling	"+"\t"+""+"\n";
var	row116	=	"Dessicant Dehumidification With SWH"+"\t"+""+"\n";
var	row117	=	"Waterside Economizer"+"\t"+""+"\n";
var	row118	=	"Absorption Chiller With SWH"+"\t"+""+"\n";
var	row119	=	"Night Ventilation Precooling"+"\t"+""+"\n";
var	row120	=	"Efficiency/COP of Primary Heating"+"\t"+""+"\n";
var	row121	=	"Solar Heating"+"\t"+""+"\n";
var	row122	=	"HVAC Nominal Temperature Conditions"+"\t"+""+"\n";
var	row123	=	"Design Heating Supply Temperature (Degree F)"+"\t"+""+"\n";
var	row124	=	"Design Cooling Supply Temperature (Degree F)"+"\t"+""+"\n";
var	row125	=	"For Dual Duct Systems: Temperature Of The Hot Deck (Degree F)"+"\t"+""+"\n";
var	row126	=	"Design Preheat Temperature (Degree F)"+"\t"+""+"\n";
var	row127	=	"Cooling Coil Design Leaving Temperature (Degree F)"+"\t"+""+"\n";
var	row128	=	"Supply Air Temperature Reset - Function Of Outside Temp"+"\t"+""+"\n";
var	row129	=	"Supply Air Temperature Reset - Optimal Control	"+"\t"+""+"\n";
var	row130	=	"Temperature Set Points	"+"\t"+""+"\n";
var	row131	=	"Cooling set up implementation"+"\t"+""+"\n";
var	row132	=	"Heating set back implementation"+"\t"+""+"\n";
var	row133	=	"Cooling Set Point (Degree F)"+"\t"+""+"\n";
var	row134	=	"Cooling Set Back (Degree F)"+"\t"+""+"\n";
var	row135	=	"Heating Set Point (Degree F)"+"\t"+""+"\n";
var	row136	=	"Heating Set Back (Degree F)"+"\t"+""+"\n";
var	row137	=	"Occupant Load"+"\t"+""+"\n";
var	row138	=	"Occupant load description"+"\t"+"Unspecified"+"\n";
var	row139	=	"Number of total occupants (excluding employees)"+"\t"+""+"\n";
var	row140	=	"Religious worship seating capacity"+"\t"+""+"\n";
var	row141	=	"Assembly seating capacity"+"\t"+""+"\n";
var	row142	=	"Number of classroom seating capacity"+"\t"+""+"\n";
var	row143	=	"Food service seating capacity"+"\t"+""+"\n";
var	row144	=	"Licensed bed capacity"+"\t"+""+"\n";
var	row145	=	"Plug and Process Load"+"\t"+""+"\n";
var	row146	=	"Plug and process load description"+"\t"+"Unspecified"+"\n";
var	row147	=	"Number of computers"+"\t"+""+"\n";
var	row148	=	"Flat screen monitors"+"\t"+""+"\n";
var	row149	=	"Number of servers"+"\t"+""+"\n";
var	row150	=	"Number of cash registers"+"\t"+""+"\n";
var	row151	=	"Number of printers"+"\t"+""+"\n";
var	row152	=	"Type of printers"+"\t"+"Unspecified"+"\n";
var	row153	=	"Number of photocopiers"+"\t"+""+"\n";
var	row154	=	"Number of residential refrigerators"+"\t"+""+"\n";
var	row155	=	"Number of elevators"+"\t"+""+"\n";
var	row156	=	"Number of vending machines"+"\t"+""+"\n";
var	row157	=	"Plug Load Power Density (Watts/ft^2)"+"\t"+""+"\n";
var	row158	=	"Lighting Load"+"\t"+""+"\n";
var	row159	=	"Interior Lighting Power Density (Watts/ft^2)"+"\t"+""+"\n";
var	row160	=	"Occupancy Sensors"+"\t"+""+"\n";
var	row161	=	"Daylight-based Dimming"+"\t"+""+"\n";
var	row162	=	"Added Daylight"+"\t"+""+"\n";
var	row163	=	"Light Shelves"+"\t"+""+"\n";
var	row164	=	"Refrigeration Load"+"\t"+""+"\n";
var	row165	=	"Refrigeration in conditioned space"+"\t"+""+"\n";
var	row166	=	"Refrigeration Power Density (Watts/ft^2)"+"\t"+""+"\n";
var	row167	=	"Hot Water Usage"+"\t"+""+"\n";
var	row168	=	"Hot water usage rate data source"+"\t"+"Unspecified"+"\n";
var	row169	=	"Hot water usage rate (l / (Person Day))"+"\t"+""+"\n";
var	row170	=	"Infiltration Load"+"\t"+""+"\n";
var	row171	=	"Leakage Rate"+"\t"+"Unspecified"+"\n";
var	row172	=	"User defined leakage rate (CFM/SqFt of outside wall)"+"\t"+""+"\n";
var	row173	=	"Fenestration and Conduction Load"+"\t"+""+"\n";
var	row174	=	"Percent exterior glass (With respect to wall area)"+"\t"+percentexteriorglass+"\n";
var	row175	=	"Angular Solar Dependency"+"\t"+"No"+"\n";
var	row176	=	"Angular Solar Dependency Data Specification"+"\t"+""+"\n";
var	row177	=	"How much of the total window area is on the surface with azimuth 0 + Orientation shift (percentage of overall window area)"+"\t"+""+"\n";
var	row178	=	"How much of the total window area is on the surface with azimuth 90 + Orientation shift (percentage of overall window area)"+"\t"+""+"\n";
var	row179	=	"How much of the total window area is on the surface with azimuth 180 + Orientation shift (percentage of overall window area)"+"\t"+""+"\n";
var	row180	=	"How much of the total window area is on the surface with azimuth -90 + Orientation shift (percentage of overall window area)"+"\t"+""+"\n";
var	row181	=	"Length of the wall with surface azimuth 0 + Orientation shift (ft)"+"\t"+""+"\n";
var	row182	=	"Window percentage on the wall with with surface azimuth 0 + Orientation shift"+"\t"+""+"\n";
var	row183	=	"Length of the wall with surface azimuth 90 + Orientation shift (ft)"+"\t"+""+"\n";
var	row184	=	"Window percentage on the wall with with surface azimuth 90 + Orientation shift"+"\t"+""+"\n";
var	row185	=	"Length of the wall with surface azimuth 180 + Orientation shift (ft)"+"\t"+""+"\n";
var	row186	=	"Window percentage on the wall with with surface azimuth 180 + Orientation shift"+"\t"+""+"\n";
var	row187	=	"Length of the wall with surface azimuth -90 + Orientation shift (ft)"+"\t"+""+"\n";
var	row188	=	"Window percentage on the wall with with surface azimuth -90 + Orientation shift"+"\t"+""+"\n";
var	row189	=	"Orientation shift - If the building orientation is shifted (Positive clockwise)"+"\t"+""+"\n";
var	row190	=	"Window glass type"+"\t"+windowglasstype+"\n";
var	row191	=	"Window Visual Transmitivity (fraction)"+"\t"+""+"\n";
var	row192	=	"Window U value (Btu/(hr ft^2 F))"+"\t"+""+"\n";
var	row193	=	"Window Solar Heat Gain Coeff"+"\t"+""+"\n";
var	row194	=	"SHGC at 0 degree incident angle"+"\t"+""+"\n";
var	row195	=	"SHGC at 40 degree incident angle"+"\t"+""+"\n";
var	row196	=	"SHGC at 50 degree incident angle"+"\t"+""+"\n";
var	row197	=	"SHGC at 60 degree incident angle"+"\t"+""+"\n";
var	row198	=	"SHGC at 70 degree incident angle"+"\t"+""+"\n";
var	row199	=	"SHGC at 80 degree incident angle"+"\t"+""+"\n";
var	row200	=	"SHGC at 90 degree incident angle"+"\t"+""+"\n";
var	row201	=	"Hemispherical SHGC"+"\t"+""+"\n";
var	row202	=	"Tinted window glass"+"\t"+""+"\n";
var	row203	=	"Reflective window glass"+"\t"+""+"\n";
var	row204	=	"Wall and Roof Conduction"+"\t"+""+"\n";
var	row205	=	"Wall construction material"+"\t"+walltype+"\n";
var	row206	=	"Roof construction material"+"\t"+rooftype+"\n";
var	row207	=	"Carpeting"+"\t"+""+"\n";
var	row208	=	"Uwall (Btu/h-ft^2-F)"+"\t"+""+"\n";
var	row209	=	"Uroof (Btu/h-ft^2-F)"+"\t"+""+"\n";
var	row210	=	"Cool Roof"+"\t"+""+"\n";
var	row211	=	"Active External Shading"+"\t"+""+"\n";
var	row212	=	"Trees"+"\t"+""+"\n";
var	row213	=	"Freestanding building"+"\t"+""+"\n";
var	row214	=	"Ground Conduction"+"\t"+""+"\n";
var	row215	=	"Ground properties"+"\t"+"Unspecified"+"\n";
var	row216	=	"Uground (Btu/h-ft^2-F)	"+"\t"+""+"\n";
var	row217	=	"Internal Thermal Mass Load	"+"\t"+""+"\n";
var	row218	=	"Ratio of internal wall perimeter/building perimeter"+"\t"+""+"\n";


writeStream.write(row1);
writeStream.write(row2);
writeStream.write(row3);
writeStream.write(row4);
writeStream.write(row5);
writeStream.write(row6);
writeStream.write(row7);
writeStream.write(row8);
writeStream.write(row9);
writeStream.write(row10);
writeStream.write(row11);
writeStream.write(row12);
writeStream.write(row13);
writeStream.write(row14);
writeStream.write(row15);
writeStream.write(row16);
writeStream.write(row17);
writeStream.write(row18);
writeStream.write(row19);
writeStream.write(row20);
writeStream.write(row21);
writeStream.write(row22);
writeStream.write(row23);
writeStream.write(row24);
writeStream.write(row25);
writeStream.write(row26);
writeStream.write(row27);
writeStream.write(row28);
writeStream.write(row29);
writeStream.write(row30);
writeStream.write(row31);
writeStream.write(row32);
writeStream.write(row33);
writeStream.write(row34);
writeStream.write(row35);
writeStream.write(row36);
writeStream.write(row37);
writeStream.write(row38);
writeStream.write(row39);
writeStream.write(row40);
writeStream.write(row41);
writeStream.write(row42);
writeStream.write(row43);
writeStream.write(row44);
writeStream.write(row45);
writeStream.write(row46);
writeStream.write(row47);
writeStream.write(row48);
writeStream.write(row49);
writeStream.write(row50);
writeStream.write(row51);
writeStream.write(row52);
writeStream.write(row53);
writeStream.write(row54);
writeStream.write(row55);
writeStream.write(row56);
writeStream.write(row57);
writeStream.write(row58);
writeStream.write(row59);
writeStream.write(row60);
writeStream.write(row61);
writeStream.write(row62);
writeStream.write(row63);
writeStream.write(row64);
writeStream.write(row65);
writeStream.write(row66);
writeStream.write(row67);
writeStream.write(row68);
writeStream.write(row69);
writeStream.write(row70);
writeStream.write(row71);
writeStream.write(row72);
writeStream.write(row73);
writeStream.write(row74);
writeStream.write(row75);
writeStream.write(row76);
writeStream.write(row77);
writeStream.write(row78);
writeStream.write(row79);
writeStream.write(row80);
writeStream.write(row81);
writeStream.write(row82);
writeStream.write(row83);
writeStream.write(row84);
writeStream.write(row85);
writeStream.write(row86);
writeStream.write(row87);
writeStream.write(row88);
writeStream.write(row89);
writeStream.write(row90);
writeStream.write(row91);
writeStream.write(row92);
writeStream.write(row93);
writeStream.write(row94);
writeStream.write(row95);
writeStream.write(row96);
writeStream.write(row97);
writeStream.write(row98);
writeStream.write(row99);
writeStream.write(row100);
writeStream.write(row101);
writeStream.write(row102);
writeStream.write(row103);
writeStream.write(row104);
writeStream.write(row105);
writeStream.write(row106);
writeStream.write(row107);
writeStream.write(row108);
writeStream.write(row109);
writeStream.write(row110);
writeStream.write(row111);
writeStream.write(row112);
writeStream.write(row113);
writeStream.write(row114);
writeStream.write(row115);
writeStream.write(row116);
writeStream.write(row117);
writeStream.write(row118);
writeStream.write(row119);
writeStream.write(row120);
writeStream.write(row121);
writeStream.write(row122);
writeStream.write(row123);
writeStream.write(row124);
writeStream.write(row125);
writeStream.write(row126);
writeStream.write(row127);
writeStream.write(row128);
writeStream.write(row129);
writeStream.write(row130);
writeStream.write(row131);
writeStream.write(row132);
writeStream.write(row133);
writeStream.write(row134);
writeStream.write(row135);
writeStream.write(row136);
writeStream.write(row137);
writeStream.write(row138);
writeStream.write(row139);
writeStream.write(row140);
writeStream.write(row141);
writeStream.write(row142);
writeStream.write(row143);
writeStream.write(row144);
writeStream.write(row145);
writeStream.write(row146);
writeStream.write(row147);
writeStream.write(row148);
writeStream.write(row149);
writeStream.write(row150);
writeStream.write(row151);
writeStream.write(row152);
writeStream.write(row153);
writeStream.write(row154);
writeStream.write(row155);
writeStream.write(row156);
writeStream.write(row157);
writeStream.write(row158);
writeStream.write(row159);
writeStream.write(row160);
writeStream.write(row161);
writeStream.write(row162);
writeStream.write(row163);
writeStream.write(row164);
writeStream.write(row165);
writeStream.write(row166);
writeStream.write(row167);
writeStream.write(row168);
writeStream.write(row169);
writeStream.write(row170);
writeStream.write(row171);
writeStream.write(row172);
writeStream.write(row173);
writeStream.write(row174);
writeStream.write(row175);
writeStream.write(row176);
writeStream.write(row177);
writeStream.write(row178);
writeStream.write(row179);
writeStream.write(row180);
writeStream.write(row181);
writeStream.write(row182);
writeStream.write(row183);
writeStream.write(row184);
writeStream.write(row185);
writeStream.write(row186);
writeStream.write(row187);
writeStream.write(row188);
writeStream.write(row189);
writeStream.write(row190);
writeStream.write(row191);
writeStream.write(row192);
writeStream.write(row193);
writeStream.write(row194);
writeStream.write(row195);
writeStream.write(row196);
writeStream.write(row197);
writeStream.write(row198);
writeStream.write(row199);
writeStream.write(row200);
writeStream.write(row201);
writeStream.write(row202);
writeStream.write(row203);
writeStream.write(row204);
writeStream.write(row205);
writeStream.write(row206);
writeStream.write(row207);
writeStream.write(row208);
writeStream.write(row209);
writeStream.write(row210);
writeStream.write(row211);
writeStream.write(row212);
writeStream.write(row213);
writeStream.write(row214);
writeStream.write(row215);
writeStream.write(row216);
writeStream.write(row217);
writeStream.write(row218);

//writeStream.close();
        //fs.writeFileSync(fileName, string);
        //response.render('download');           
    response.redirect('http://developer.eebhub.org/utrc/inputs/'+buildingname+timestamp+'.xlsx');
    },
    
    
    getSubstantialResults:  function(request, response) {
        var xlsx = require('node-xlsx');

        //var data1 = xlsx.parse('/var/lib/stickshift/51fe45ea500446605900003e/app-root/data/577413/utrc/Output_StageI.xlsx'); 
        var data1 = xlsx.parse('utrc/Output_StageI.xlsx'); 
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
        
        
        
        // var fs = require('fs');
        // var buffer = xlsx.build({worksheets: [
        // {"name":"mySheetName", "data":[
        // ["A1", "B1"],
        // [
        //     {"value":"A2","formatCode":"General"},
        //     {"value":"B2","formatCode":"General"}
        // ]
        // ]}
        // ]});
        
        // fs.writeFile("test.xlsx", buffer, function(err) {
        // if(err) {
        //     console.log(err);
        // } else {
        // console.log("The file was saved!");
        // }
        // });
        
        response.render('substantialresults', {
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
        
    }
    
    
    
    
};

/*var fileName = buildingName + '.ejs' ;
var route = "./views/";
        var inputs = buildingName + '\r\n' + buildingFunction;
        var form = request.body;
        fs.writeFileSync(route + fileName , inputs);
        fs.writeFileSync(buildingName + '.txt', form );
        response.render(fileName);*/
        