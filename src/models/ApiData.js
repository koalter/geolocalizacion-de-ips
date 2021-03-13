const { DateTime } = require('luxon');

class ApiData {
    countryNm = '';
    countryISO = '';
    currentDttm = [];
    currency = '';
    exchangeRate = 0;
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

    setExchangeRate(usdRate, localRate) {
        if (usdRate && localRate) {
            const adjustedUsdRate = 1 / usdRate;
            this.exchangeRate = adjustedUsdRate * localRate;
        } else {
            this.exchangeRate = null;
        }
    }
}

module.exports = ApiData;