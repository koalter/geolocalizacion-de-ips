const { json } = require('express');
const appService = require('../services/appService');

class AppController {
    
    getData(ip) {
        const validatedIp = appService.saveIp(ip);
        const data = appService.getData(validatedIp.address);
        return { 
            message: `Your requested ip is ${validatedIp.address}`,
            data: data
        };
    }

    getDataTest(ip) {
        const data = appService.getData(ip);
        return { 
            message: `Your requested ip is ${ip}`,
            data: data // no llega a leer esto
        }
    }
}

module.exports = new AppController();