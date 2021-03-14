const mongoose = require('mongoose');

const GeolocalizationDataSchema = new mongoose.Schema({ 
    ipAddress: String,
    countryName: String,
    countryISO: String,
    languages: Array,
    currentDttm: Array,
    currency: String,
    distanceToBA: Number,
    exchangeRate: Number
});

const GeolocalizationData = mongoose.model('GeolocalizationData', GeolocalizationDataSchema);

module.exports = GeolocalizationData;
