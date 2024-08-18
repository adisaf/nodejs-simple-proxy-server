const axios = require('axios');

describe('Proxy Server', () => {
  it('test post json', async () => {
    try {
      const response = await axios.post('http://localhost:3033/webhook-site', {title: 'foo', body: 'bar', userId: 1});
      expect(response.status).toBe(200); // Use response.status, not response.statusCode
    } catch (error) {
      expect(error.response.status).toBe(200); // Handle the error response properly
    }
  });
});
