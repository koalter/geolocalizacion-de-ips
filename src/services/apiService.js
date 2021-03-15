const fetch = require('node-fetch').default;
const { DateTime } = require('luxon');
const geolib = require('geolib');
const ApiOutput = require('../models/ApiOutput');
const GeolocalizationData = require('../models/GeolocalizationData');
const Cache = require('../models/Cache');
const exchangeRateService = require('../services/exchangeRateService');
const EXCHANGE_RATES = require('../resources/exchangeRate-mock.json'); // For testing purposes

class ApiService {

    cache;

    constructor() {
        this.cache = new Cache();
        GeolocalizationData.find()
            .then(dataList => {
                dataList.forEach(data => {
                    const output = new ApiOutput();
                    output.import(data);
                    this.cache.geolocalizationDataList.push(output);
                });
            });
        exchangeRateService.getExchangeRates(DateTime.now().toFormat('yyyy-MM-dd'))
            .then(r => this.cache.exchangeRates = r);
    }

    async getIpData(ip) {
        const ipFromCache = this.cache.geolocalizationDataList.find(g => g.ipAddress === ip);
        let countryCode = '';
        let countryName = '';
        let status = 200;

        if (!ipFromCache) {
            const ipData = await fetch(`https://api.ip2country.info/ip?${ip}`);
            status = ipData.status;
            if (status === 200) {
                const ipDataJson = await ipData.json();
                countryCode = ipDataJson.countryCode;
                countryName = ipDataJson.countryName;
            }
        } else {
            countryCode = ipFromCache.countryISO;
            countryName = ipFromCache.countryName;
        }

        return { countryCode, countryName, status };
    }

    async getCountryData(countryCode) {
        const countryDataFromCache = this.cache.geolocalizationDataList.find(g => g.countryISO === countryCode);
        let distanceToBA = 0;
        let languages = [];
        let currency = '';
        let currentDttm = [];
        let status = 200;
        
        if (!countryDataFromCache) {
            const countryData = await fetch(`https://restcountries.eu/rest/v2/alpha/${countryCode}`);
            status = countryData.status;
            if (status === 200) {
                const countryDataJson = await countryData.json();

                const requestCoordinates = {
                    latitude: countryDataJson.latlng[0],
                    longitude: countryDataJson.latlng[1]
                }
                const localCoordinates = {
                    latitude: -34.5474386,
                    longitude: -58.4867773
                }
                languages = countryDataJson.languages;
                currency = countryDataJson.currencies[0].code;
                distanceToBA = this.calculateDistance(requestCoordinates, localCoordinates);
                currentDttm = this.calculateDateTimes(countryDataJson.timezones);
            }
        } else {
            distanceToBA = countryDataFromCache.distanceToBA;
            languages = countryDataFromCache.languages;
            currency = countryDataFromCache.currency;
            currentDttm = countryDataFromCache.currentDttm;
        }
        
        return { languages, currency, currentDttm, distanceToBA, status };
    }

    calculateDistance(requestCoordinates, localCoordinates) {
        return Math.round(geolib.getDistance(requestCoordinates, localCoordinates)/1000);
    }

    calculateDateTimes(timezones) {
        let dateTimes = [];

        timezones.forEach(tz => {
            dateTimes.push(DateTime.now().setZone(tz).toLocaleString({ 
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

        return dateTimes;
    }

    async getExchangeRateData(currency) {
        const dataFromCache = this.cache.exchangeRates;
        let usdRate = 0;
        let foreignRate = 0;
        let status = 200;
        if (!dataFromCache) {

            const exchangeRateData = await fetch(`http://data.fixer.io/api/latest?access_key=7aa700d4c100e08a7224856c29f037ba`);
            status = exchangeRateData.status;
            if (status === 200) {
                const exchangeRateDataJson = await exchangeRateData.json();
                usdRate = exchangeRateDataJson.rates['USD'];
                foreignRate = exchangeRateDataJson.rates[currency];
                this.cache.exchangeRates = exchangeRateDataJson;
                exchangeRateService.saveExchangeRate(exchangeRateDataJson);
            }
        } else {
            usdRate = dataFromCache.rates['USD'];
            foreignRate = dataFromCache.rates[currency];
        }

        return { usdRate, foreignRate, status };
    }

    getExchangeRateDataMock(currency) {
        const usdRate = EXCHANGE_RATES.rates['USD'];
        const foreignRate = EXCHANGE_RATES.rates[currency];
        const status = 200;
        return { usdRate, foreignRate, status };
    }

    async saveData(ipAddress, countryName, countryCode, languages, currencyCd, usdRate, countryRate, currentDttm, distanceInKm) {
        const result = new ApiOutput();
        let status = 200;

        result.ipAddress = ipAddress;
        result.countryName = countryName;
        result.countryISO = countryCode;
        result.setLanguages(languages);
        result.currency = currencyCd;
        result.setExchangeRate(usdRate, countryRate);
        result.currentDttm = currentDttm;
        result.distanceToBA = distanceInKm;
    
        const geolocalizationData = result.export();
    
        await geolocalizationData.save()
            .then(data => {
                status = 200;
                this.cache.geolocalizationDataList.push(result);
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