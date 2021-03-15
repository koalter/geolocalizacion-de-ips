const fetch = require('node-fetch').default;
const ExchangeRate = require('../models/ExchangeRate');

class ExchangeRateService {
    async getExchangeRates(date) {
        let result = await ExchangeRate.findOne({ date: date });
        if (!result) {
            result = await fetch(`http://data.fixer.io/api/latest?access_key=${process.env.FIXIO_API_KEY}`);
            const resultJson = await result.json();
            this.saveExchangeRate(resultJson);
        }
        return result;
    }

    async saveExchangeRate(exchangeRateInput) {
        const exchangeRate = new ExchangeRate({
            base: exchangeRateInput.base,
            date: exchangeRateInput.date,
            rates: exchangeRateInput.rates
        });
        await exchangeRate.save();
    }
}

module.exports = new ExchangeRateService();