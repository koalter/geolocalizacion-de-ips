const fetch = require('node-fetch').default;
const ApiOutput = require('../models/ApiOutput');
const GeolocalizationData = require('../models/GeolocalizationData');

class ApiService {

    async getIpData(ip) {
        return await fetch(`https://api.ip2country.info/ip?${ip}`);
    }

    async getCountryData(countryCode) {
        return await fetch(`https://restcountries.eu/rest/v2/alpha/${countryCode}`);
    }

    async getExchangeRateData(currency) {
        return await fetch(`http://data.fixer.io/api/latest?access_key=${process.env.FIXIO_API_KEY}&symbols=USD,${currency}&format=1`)
    }

    async saveData(ipAddress, countryName, countryCode, languages, currencyCd, usdRate, countryRate, timezones, distanceInKm) {
        const result = new ApiOutput();
        let status = 200;

        result.ipAddress = ipAddress;
        result.countryName = countryName;
        result.countryISO = countryCode;
        result.setLanguages(languages);
        result.currency = currencyCd;
        result.setExchangeRate(usdRate, countryRate);
        result.setDateTimes(timezones);
        result.distanceToBA = distanceInKm;
    
        const geolocalizationData = result.export();
    
        await geolocalizationData.save()
            .then(data => {
                status = 200;
            })
            .catch(err => status = 500);

        return { result, status };
    }

    async getLongestDistance() {
        const results = await GeolocalizationData.find({}).sort('-distanceToBA');
        let filteredResults = [];
        results.forEach(r => {
            if (r.countryName === results[0].countryName) {
                filteredResults.push(r);
            }
        });
        const resultOutput = this.getQueryResults(filteredResults[0], filteredResults.length);
        return resultOutput;
    }

    async getShortestDistance() {
        const results = await GeolocalizationData.find({}).sort('distanceToBA');
        let filteredResults = [];
        results.forEach(r => {
            if (r.countryName === results[0].countryName) {
                filteredResults.push(r);
            }
        });
        const resultOutput = this.getQueryResults(filteredResults[0], filteredResults.length);
        return resultOutput;
    }

    async getAverageDistance() {

    }

    getQueryResults(geolocalizationData, amount) {
        return {
            countryName: geolocalizationData.countryName,
            distanceToBA: geolocalizationData.distanceToBA,
            requests: amount
        }
    }
}

module.exports = new ApiService();