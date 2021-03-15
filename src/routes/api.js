const express = require('express');
const router = express.Router();
const geolib = require('geolib');
const apiService = require('../services/apiService');

router.get('/getData/:ip', async (req, res) => {
    const input = req.params.ip;

    if (!validateIp(input)) {
        res.sendStatus(400);
    } else {
        const { countryCode, countryName, status } = await apiService.getIpData(input);
        if (status !== 200) {
            res.sendStatus(status);
        } else {
            const countryData = await apiService.getCountryData(countryCode);
            if (countryData.status !== 200) {
                res.sendStatus(countryData.status);
            } else {
                const exchangeRates = await apiService.getExchangeRateData(countryData.currency);
            
                const requestCoordinates = { latitude: countryData.latitude, longitude: countryData.longitude };
                const localCoordinates = { latitude: process.env.LOCAL_LAT, longitude: process.env.LOCAL_LNG};
            
                const { result, status } = await apiService.saveData(input, countryName, countryCode, countryData.languages, countryData.currency, exchangeRates.usdRate, exchangeRates.foreignRate, countryData.timezones, Math.round(geolib.getDistance(requestCoordinates, localCoordinates)/1000));

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