const express = require('express');
const router = express.Router();
const geolib = require('geolib');
const apiService = require('../services/apiService');
const EXCHANGE_RATES = require('../models/exchangeRate-mock.json'); //TODO delete after doing cache

router.get('/getData/:ip', async (req, res) => {
    const input = req.params.ip;

    if (!validateIp(input)) {
        res.sendStatus(400);
    } else {
        const ip2CountryOutput = await apiService.getIpData(input);
        if (ip2CountryOutput.status !== 200) {
            res.sendStatus(ip2CountryOutput.status);
        } else {
            const { countryCode, countryCode3, countryName, countryEmoji } = await ip2CountryOutput.json();
            const restCountriesOutput = await apiService.getCountryData(countryCode);
            if (restCountriesOutput.status !== 200) {
                res.sendStatus(restCountriesOutput.status);
            } else {
                const restCountriesData = await restCountriesOutput.json();
                // const fixerOutput = await fetch(`http://data.fixer.io/api/latest?access_key=${process.env.FIXIO_API_KEY}&symbols=USD,${restCountriesData[0].currencies[0].code}&format=1`);
                // const fixerData = await fixerOutput.json();
                const fixerData = EXCHANGE_RATES;
            
                const requestCoordinates = { latitude: restCountriesData.latlng[0], longitude: restCountriesData.latlng[1] };
                const localCoordinates = { latitude: process.env.LOCAL_LAT, longitude: process.env.LOCAL_LNG};
            
                const { result, status } = await apiService.saveData(input, countryName, countryCode, restCountriesData.languages, restCountriesData.currencies[0].code, fixerData.rates['USD'], fixerData.rates[restCountriesData.currencies[0].code], restCountriesData.timezones, Math.round(geolib.getDistance(requestCoordinates, localCoordinates)/1000));

                res.status(status).send(result);
            }
        }
    }
});

router.get('/getLongest', async (req, res) => {
    const result = await apiService.getLongestDistance();
    res.send(result);
});

router.get('/getShortest', async (req, res) => {
    const result = await apiService.getShortestDistance();
    res.send(result);
});

router.get('/getAverage', async (req, res) => {
    const result = await apiService.getAverageDistance();
    res.send(result);
});

function validateIp(input) {
    const sections = input.split('.');

    for (let i = 0; i < sections.length; i++) {
        const intSection = parseInt(sections[i]);
        if (isNaN(intSection) || intSection > 255 || intSection < 0)
            return false;
    }
    return true;
}

module.exports = router;