const express = require('express');
const router = express.Router();
const fetch = require('node-fetch').default;
const { DateTime } = require('luxon');
const ApiData = require('../models/ApiData');
const IP = '181.44.61.195';
const dateOptions = { locale: 'es-AR', day: 'numeric', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'};

router.get('/getDataTest', async (req, res) => {
    const input = IP;//'121.98.41.184';
    const ip2CountryOutput = await fetch(`https://api.ip2country.info/ip?${input}`);
    const { countryCode, countryCode3, countryName, countryEmoji } = await ip2CountryOutput.json();
    const restCountriesOutput = await fetch(`https://restcountries.eu/rest/v2/name/${countryName}`); 
    const restCountriesData = await restCountriesOutput.json();
    // const fixerOutput = await fetch(`http://data.fixer.io/api/latest?access_key=${process.env.FIXIO_API_KEY}&symbols=USD,${restCountriesData[0].currencies[0].code}&format=1`);
    // const fixerData = await fixerOutput.json();

    let result = new ApiData();
    result.countryNm = countryName;
    result.countryISO = countryCode;
    result.currency = restCountriesData[0].currencies[0].code;
    result.setDateTimes(restCountriesData[0].timezones);

    res.send(result);
});

module.exports = router;