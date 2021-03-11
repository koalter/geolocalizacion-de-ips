const Ip = require('../models/Ip');

class AppService {
    getData(data) {
        const ip = new Ip({ address: data });

        ip.save(err => {
            if (err) console.error(err);       
        });
        return { message: `Your requested ip is ${ip.address}` };
    }
}

module.exports = new AppService();