const { DateTime } = require('luxon');

class ApiData {
    ipAddress = '';
    countryName = '';
    countryISO = '';
    languages = [];
    currentDttm = [];
    currency = '';
    // distanceToBA;
    exchangeRate = 0;

    setDateTimes(timezones) {
        timezones.forEach(tz => {
            this.currentDttm.push(DateTime.now().setZone(tz).toLocaleString({ 
                locale: 'en-US', 
                day: 'numeric', 
                month: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true
            }));
        });
    }

    setLanguages(languageList) {
        languageList.forEach(language => {
            this.languages.push(language.name);
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