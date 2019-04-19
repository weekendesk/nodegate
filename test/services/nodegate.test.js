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
    it('should accept an array of route', async () => {
      const gate = nodegate();
      gate.route([{
        method: 'get',
        path: '/route1',
        pipeline: [],
      }, {
        method: 'get',
        path: '/route2',
        pipeline: [],
      }]);
      await request(gate).get('/route1').expect(200);
      await request(gate).get('/route2').expect(200);
    });
  });
});
