module.exports = {

    convertUtilities: function(utility_electric, utility_gas) {
        var kBTU_elec = [];
        var kBTU_gas = [];
        var i = 0;
        for (i in utility_electric) {
            kBTU_elec.push(utility_electric[i] * 3.412);
        }
        for (i in utility_gas) {
            kBTU_gas.push(utility_gas[i] * 102.8);
        }
        return [kBTU_elec, kBTU_gas];
    },

    combineUtilities: function(kBTU_elec, kBTU_gas) {
        var i = 0;
        var energy = [];
        for (i in kBTU_elec) {
            energy[i] = kBTU_elec[i] + kBTU_gas[i];
        }
        return energy;
    },
    energyPerDay: function(total_energy, utility_startdate) {
        var one_day = 1000 * 60 * 60 * 24;
        var numDaysInBillingPeriod = [];
        for (var i = 0; i < utility_startdate.length - 1; i++) {
            var day_start = new Date(utility_startdate[i]);
            var day_end = new Date(utility_startdate[i + 1]);
            numDaysInBillingPeriod[i] = (day_end - day_start) / one_day;
        }
        var exportss = [];
        var l = 0;
        for (l in numDaysInBillingPeriod) {
            var energyPerDays = total_energy[l] / numDaysInBillingPeriod[l];
            exportss.push(energyPerDays);
        }

        return exportss;
    }
};
