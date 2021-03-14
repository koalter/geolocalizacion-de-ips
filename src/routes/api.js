const express = require('express');
const router = express.Router();
const fetch = require('node-fetch').default;
const geolib = require('geolib');
const ApiOutput = require('../models/ApiOutput');
const EXCHANGE_RATES = require('../models/exchangeRate-mock.json'); //TODO delete after doing cache
const IP = '181.44.61.195'; //TODO delete

router.get('/getDataTest/:ip', async (req, res) => {
    const input = req.params.ip;

    if (!validateIp(input)) {
        res.sendStatus(400);
    } else {
        const ip2CountryOutput = await fetch(`https://api.ip2country.info/ip?${input}`);
        const { countryCode, countryCode3, countryName, countryEmoji } = await ip2CountryOutput.json();
        const restCountriesOutput = await fetch(`https://restcountries.eu/rest/v2/alpha/${countryCode}`);

        if (restCountriesOutput.status !== 200) {
            res.sendStatus(restCountriesOutput.status);
        } else {
            const restCountriesData = await restCountriesOutput.json();
            // const fixerOutput = await fetch(`http://data.fixer.io/api/latest?access_key=${process.env.FIXIO_API_KEY}&symbols=USD,${restCountriesData[0].currencies[0].code}&format=1`);
            // const fixerData = await fixerOutput.json();
            const fixerData = EXCHANGE_RATES;
        
            const requestCoordinates = { latitude: restCountriesData.latlng[0], longitude: restCountriesData.latlng[1] };
            const localCoordinates = { latitude: process.env.LOCAL_LAT, longitude: process.env.LOCAL_LNG};
        
            const result = new ApiOutput();
            result.ipAddress = input;
            result.countryName = countryName;
            result.countryISO = countryCode;
            result.setLanguages(restCountriesData.languages);
            result.currency = restCountriesData.currencies[0].code;
            result.setExchangeRate(fixerData.rates['USD'], fixerData.rates[result.currency]);
            result.setDateTimes(restCountriesData.timezones);
            result.distanceToBA = geolib.getDistance(requestCoordinates, localCoordinates)/1000;
        
            const geolocalizationData = result.export();
        
            geolocalizationData.save((err, data) => {
                if (err) {
                    res.status(500);
                } else {
                    res.status(200);
                    console.log(data.id);
                }
            });
        
            res.send(result);
        }
    }
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