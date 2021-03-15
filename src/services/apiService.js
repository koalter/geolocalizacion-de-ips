const fetch = require('node-fetch').default;
const { DateTime } = require('luxon');
const ApiOutput = require('../models/ApiOutput');
const GeolocalizationData = require('../models/GeolocalizationData');
const Cache = require('../models/Cache');
const exchangeRateService = require('../services/exchangeRateService');
const EXCHANGE_RATES = require('../models/exchangeRate-mock.json'); //TODO delete after doing cache

class ApiService {

    cache;

    constructor() {
        this.cache = new Cache();
        GeolocalizationData.find()
            .then(g => this.cache.geolocalizationDataList = g);
        exchangeRateService.getExchangeRates(DateTime.now().toFormat('yyyy-MM-dd'))
            .then(r => this.cache.exchangeRates = r);
    }

    async getIpData(ip) {
        const ipData = await fetch(`https://api.ip2country.info/ip?${ip}`);
        let countryCode = '';
        let countryName = '';
        let status = ipData.status;
        if (status === 200) {
            const ipDataJson = await ipData.json();
            countryCode = ipDataJson.countryCode;
            countryName = ipDataJson.countryName;
        }
        return { countryCode, countryName, status };
    }

    async getCountryData(countryCode) {
        const countryData = await fetch(`https://restcountries.eu/rest/v2/alpha/${countryCode}`);
        let latitude = 0;
        let longitude = 0;
        let languages = [];
        let currency = '';
        let timezones = [];
        let status = countryData.status;

        if (status === 200) {
            const countryDataJson = await countryData.json();
            latitude = countryDataJson.latlng[0];
            longitude = countryDataJson.latlng[1];
            languages = countryDataJson.languages;
            currency = countryDataJson.currencies[0].code;
            timezones = countryDataJson.timezones;
        }
        
        return { latitude, longitude, languages, currency, timezones, status };
    }

    async getExchangeRateData(currency) {
        const exchangeRateData = await fetch(`http://data.fixer.io/api/latest?access_key=${process.env.FIXIO_API_KEY}`);
        let usdRate = 0;
        let foreignRate = 0;
        let status = exchangeRateData.status;

        if (status === 200) {
            const exchangeRateDataJson = await exchangeRateData.json();
            usdRate = exchangeRateDataJson.rates['USD'];
            foreignRate = exchangeRateDataJson.rates[currency];
        }

        return { usdRate, foreignRate, status };
    }

    getExchangeRateDataMock(currency) {
        const usdRate = EXCHANGE_RATES.rates['USD'];
        const foreignRate = EXCHANGE_RATES.rates[currency];
        const status = 200;
        return { usdRate, foreignRate, status };
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
        const results = await GeolocalizationData.find().sort('-distanceToBA');
        let filteredResults = {};
        results.forEach(r => {
            if (r.countryName === results[0].countryName) {
                if (!filteredResults[r.countryName]) {
                    filteredResults[r.countryName] = { distanceToBA: r.distanceToBA, amount: 1 };
                } else {
                    filteredResults[r.countryName].amount++;
                }
            }
        });
        
        return { countries: filteredResults };
    }

    async getShortestDistance() {
        const results = await GeolocalizationData.find().sort('distanceToBA');
        let filteredResults = {};
        results.forEach(r => {
            if (r.countryName === results[0].countryName) {
                if (!filteredResults[r.countryName]) {
                    filteredResults[r.countryName] = { distanceToBA: r.distanceToBA, amount: 1 };
                } else {
                    filteredResults[r.countryName].amount++;
                }
            }
        });

        return { countries: filteredResults };
    }

    async getAverageDistance() {
        const results = await GeolocalizationData.find();
        if (!results) return null;

        let filteredResults = {};

        results.forEach(r => {
            if (!filteredResults[r.countryName]) {
                filteredResults[r.countryName] = { distanceToBA: r.distanceToBA, amount: 1 };
            } else {
                filteredResults[r.countryName].amount++;
            }
        });

        let resultOutput = 0;
        let totalRequests = 0;

        for (const country in filteredResults) {
            resultOutput += (filteredResults[country].distanceToBA * filteredResults[country].amount);
            totalRequests += filteredResults[country].amount;
        }

        if (resultOutput === 0 || totalRequests === 0) return null;

        return { 
            countries: filteredResults,
            averageDistance: resultOutput / totalRequests 
        }
    }
}

module.exports = new ApiService();