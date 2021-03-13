const { DateTime } = require('luxon');

class ApiData {
    countryNm = '';
    countryISO = '';
    currentDttm = [];
    currency = '';
    // exchangeRate;
    // distanceToBA;

    setDateTimes(timezones) {
        timezones.forEach(tz => {
            this.currentDttm.push(DateTime.now().setZone(tz).toLocaleString({ 
                locale: 'es-AR', 
                day: 'numeric', 
                month: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit'
            }));
        });
    }
}

module.exports = ApiData;