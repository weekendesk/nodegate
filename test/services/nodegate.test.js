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
  describe('#beforeEach()', () => {
    it('should execute before each request a the modifier', async () => {
      const gate = nodegate();
      gate.beforeEach(container => ({ ...container, body: { before: true } }));
      gate.route({
        method: 'get',
        path: '/',
        pipeline: [],
      });
      await request(gate)
        .get('/')
        .expect(200)
        .then(({ body }) => {
          expect(body.before).toBe(true);
        });
    });
    it('should execute before each request a the modifier even if declared after', async () => {
      const gate = nodegate();
      gate.route({
        method: 'get',
        path: '/',
        pipeline: [],
      });
      gate.beforeEach(container => ({ ...container, body: { before: true } }));
      await request(gate)
        .get('/')
        .expect(200)
        .then(({ body }) => {
          expect(body.before).toBe(true);
        });
    });
    it('should accept an array of modifiers', async () => {
      const gate = nodegate();
      gate.route({
        method: 'post',
        path: '/',
        pipeline: [],
      });
      gate.beforeEach([
        container => ({ ...container, body: { count: container.body.count + 1 } }),
        container => ({ ...container, body: { count: container.body.count + 10 } }),
      ]);
      await request(gate)
        .post('/')
        .send({ count: 0 })
        .expect(200)
        .then(({ body }) => {
          expect(body.count).toEqual(11);
        });
    });
  });
  describe('HTTP status codes', () => {
    it.todo('should respond a 500 error in case of error');
    it.todo('should respond the last request error code in case of error');
    it.todo('should execute the onError pipeline of the route in case of error');
  });
});
