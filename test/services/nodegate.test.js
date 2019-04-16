const request = require('supertest');
const nodegate = require('../../services/nodegate');

describe('services/nodegate', () => {
  it('should throw a 404 error without route', async () => {
    const gate = nodegate();
    await request(gate).get('/').expect(404);
  });
  describe('#route()', () => {
    it('should work with an empty pipeline', async () => {
      const gate = nodegate();
      gate.route({
        method: 'get',
        path: '/',
        pipeline: [],
      });
      await request(gate).get('/').expect(200);
    });
  });
});
