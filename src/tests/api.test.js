const apiService = require('../services/apiService');

test('test sanitizeIp(\'00001.034.0101.0110\') - Should return \'1.34.101.110\'', () => {
    const result = apiService.sanitizeIp('00001.034.0101.0110');
    expect(result).toBe('1.34.101.110');
})

test('test getIpData(\'1.1.1.1\') - Should return status 200', async () => {
    const result = await apiService.getIpData('1.1.1.1');
    expect(result.status).toBe(200);
});

test('test getIpData(\'maladata\') - Should return status 400', async () => {
    const result = await apiService.getIpData('maladata');
    expect(result.status).toBe(400);
});

test('test getCountryData(\'AU\') - Should return status 200', async () => {
    const result = await apiService.getCountryData('AU');
    expect(result.status).toBe(200);
});