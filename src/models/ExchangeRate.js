const mongoose = require('mongoose');

const ExchangeRateSchema = new mongoose.Schema({ 
    base: String,
    date: String,
    rates: Object
});

const ExchangeRate = mongoose.model('ExchangeRate', ExchangeRateSchema);

module.exports = ExchangeRate;
