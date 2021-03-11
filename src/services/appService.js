class AppService {
    getData(ip) {
        return { message: `Your requested ip is ${ip}` }
    }
}

module.exports = new AppService()