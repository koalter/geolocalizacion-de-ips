const express = require('express');
const router = express.Router();
const geolib = require('geolib');
const apiService = require('../services/apiService');

router.get('/getData/:ip', async (req, res) => {
    const input = sanitizeIp(req.params.ip);

    if (!input) {
        res.sendStatus(400);
    } else {
        const ipData = await apiService.getIpData(input);
        if (ipData.status !== 200) {
            res.sendStatus(ipData.status);
        } else {
            const countryData = await apiService.getCountryData(ipData.countryCode);
            if (countryData.status !== 200) {
                res.sendStatus(countryData.status);
            } else {
                const exchangeRates = await apiService.getExchangeRateData(countryData.currency);
            
                const { result, status } = await apiService.saveData(input, ipData.countryName, ipData.countryCode, countryData.languages, countryData.currency, exchangeRates.usdRate, exchangeRates.foreignRate, countryData.currentDttm, countryData.distanceToBA);

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

function sanitizeIp(input) {
    const sections = input.split('.');
    let newString = '';

    for (let i = 0; i < sections.length; i++) {
        const intSection = parseInt(sections[i]);
        if (isNaN(intSection) || intSection > 255 || intSection < 0)
            return null;
        newString += intSection.toString();
        if (i < sections.length - 1) 
            newString += '.';
    }
    return newString;
}

module.exports = router;