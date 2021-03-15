const fetch = require('node-fetch');
const ExchangeRate = require('../models/ExchangeRate');

class ExchangeRateService {
    async getExchangeRates(date) {
        let result = await ExchangeRate.findOne({ date: date });
        if (!result) {
            // result = await fetch(`http://data.fixer.io/api/latest?access_key=${process.env.FIXIO_API_KEY}`);
        }
        return result;
    }
}

module.exports = new ExchangeRateService();