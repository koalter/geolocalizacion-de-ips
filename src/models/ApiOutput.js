const { DateTime } = require('luxon');
const GeolocalizationData = require('./GeolocalizationData');

class ApiOutput {
    ipAddress = '';
    countryName = '';
    countryISO = '';
    languages = [];
    currentDttm = [];
    currency = '';
    distanceToBA = 0;
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

    /**
     * Exports the ApiOutput data into a new GeolocalizationData object.
     */
    export() {
        return new GeolocalizationData({ 
            ipAddress: this.ipAddress,
            countryName: this.countryName,
            countryISO: this.countryISO,
            languages: this.languages,
            currentDttm: this.currentDttm,
            currency: this.currency,
            distanceToBA: this.distanceToBA,
            exchangeRate: this.exchangeRate
        });
    }

    /**
     * Imports the dbo into the ApiOutput object.
     */
    import(geolocalizationData) {
        this.ipAddress = geolocalizationData.ipAddress;
        this.countryName = geolocalizationData.countryName;
        this.countryISO = geolocalizationData.countryISO;
        this.languages = geolocalizationData.languages;
        this.currentDttm = geolocalizationData.currentDttm;
        this.currency = geolocalizationData.currency;
        this.distanceToBA = geolocalizationData.distanceToBA;
        this.exchangeRate = geolocalizationData.exchangeRate;
    }
}

module.exports = ApiOutput;