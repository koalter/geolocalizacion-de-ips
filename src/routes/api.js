const express = require('express');
const router = express.Router();
const fetch = require('node-fetch').default;
const ApiData = require('../models/ApiData');
const EXCHANGE_RATES = require('../models/exchangeRate-mock.json');
const IP = '181.44.61.195';

router.get('/getDataTest', async (req, res) => {
    const input = '121.98.41.184';
    const ip2CountryOutput = await fetch(`https://api.ip2country.info/ip?${input}`);
    const { countryCode, countryCode3, countryName, countryEmoji } = await ip2CountryOutput.json();
    const restCountriesOutput = await fetch(`https://restcountries.eu/rest/v2/alpha/${countryCode}`); 
    const restCountriesData = await restCountriesOutput.json();
    // const fixerOutput = await fetch(`http://data.fixer.io/api/latest?access_key=${process.env.FIXIO_API_KEY}&symbols=USD,${restCountriesData[0].currencies[0].code}&format=1`);
    // const fixerData = await fixerOutput.json();
    // const fixerData = {
    //     success: true,
    //     timestamp: 1615594266,
    //     base: "EUR",
    //     date: "2021-03-13",
    //     rates: {
    //       USD: 1.195325,
    //       ARS: 108.524398
    //     }
    // };
    const fixerData = EXCHANGE_RATES;
    const result = new ApiData();
    result.ipAddress = input;
    result.countryName = countryName;
    result.countryISO = countryCode;
    result.setLanguages(restCountriesData.languages);
    result.currency = restCountriesData.currencies[0].code;
    result.setExchangeRate(fixerData.rates['USD'], fixerData.rates[result.currency]);
    result.setDateTimes(restCountriesData.timezones);

    res.send(result);
});

module.exports = router;