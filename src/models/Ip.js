const mongoose = require('mongoose');

const IpSchema = new mongoose.Schema({ address: String });

const Ip = mongoose.model('Ip', IpSchema);

module.exports = Ip;
