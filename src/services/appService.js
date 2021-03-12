const Ip = require('../models/Ip');
const axios = require('axios');

class AppService {
    saveIp(ipAddress) {
        const ip = new Ip({ address: ipAddress });

        ip.save(err => {
            if (err) console.error(err);       
        });
        
        return ip;
    }

    getData(ipAddress) {
        axios.get(`https://api.ip2country.info/ip?${ipAddress}`, { responseType: 'json' })
            .then(res => {
                console.log(res.data);
                return res.data;
            });
    }
}

module.exports = new AppService();