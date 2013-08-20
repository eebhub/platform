module.exports = {
    
    determineAirportCode: function(building_location) {
        if (building_location === 'Albuquerque, NM') {
            return 'KABQ';
        }
        else if (building_location === 'Baltimore, MD') {
            return 'KBWI';
        }
        else if (building_location === 'Boise, ID (5B)') {
            return 'KBOI';
        }
        else if (building_location === 'Burlington, NH') {
            return 'KBTV';
        }
        else if (building_location === 'Chicago, IL') {
            return 'KORD';
        }
        else if (building_location === 'Duluth, MN') {
            return 'KDLH';
        }
        else if (building_location === 'El Paso, TX') {
            return 'KELP';
        }
        else if (building_location === 'Fairbanks, AK') {
            return 'KFAI';
        }
        else if (building_location === 'Helena, MT') {
            return 'KHLN';
        }
        else if (building_location === 'Houston, TX') {
            return 'KIAH';
        }
        else if (building_location === 'Memphis, TN') {
            return 'KMEM';
        }
        else if (building_location === 'Miami, FL') {
            return 'KMIA';
        }
        else if (building_location === 'Pheonix, AZ') {
            return 'KPHX';
        }
        else if (building_location === 'Philadelphia, PA') {
            return 'KPHL';
        }
        else if (building_location === 'Riyadh, SAU') {
            return 'KRUH';
        }
        else if (building_location === 'Salem, OR') {
            return 'KSLE';
        }
        else if (building_location === 'San Francisco, CA') {
            return 'KSFO';
        }
        else {
            return 'KYVR';
        }
    }
};