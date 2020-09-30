const nock = require('nock');
const request = require('supertest');
const WorkflowError = require('../../entities/WorkflowError');
const nodegate = require('../../services/nodegate');

describe('services/nodegate', () => {
  it('should throw a 404 error without route', async () => {
    const gate = nodegate();
    await request(gate).get('/').expect(404);
  });
  it('should expose the express app', () => {
    const gate = nodegate();
    expect(typeof gate.expressApp).toEqual('function');
  });
  describe('#route()', () => {
    it('should work with an empty workflow', async () => {
      const gate = nodegate();
      gate.route({
        method: 'get',
        path: '/',
        workflow: [],
      });
      await request(gate).get('/').expect(200);
    });
    it('should accept an array of route', async () => {
      const gate = nodegate();
      gate.route([{
        method: 'get',
        path: '/route1',
        workflow: [],
      }, {
        method: 'get',
        path: '/route2',
        workflow: [],
      }]);
      await request(gate).get('/route1').expect(200);
      await request(gate).get('/route2').expect(200);
    });
  });
  describe('#beforeEach()', () => {
    it('should execute before each request a worker', async () => {
      const gate = nodegate();
      gate.beforeEach((container) => { container.body.before = true; });
      gate.route({
        method: 'get',
        path: '/',
        workflow: [],
      });
      await request(gate)
        .get('/')
        .expect(200)
        .then(({ body }) => {
          expect(body.before).toBe(true);
        });
    });
    it('should execute before each request the worker even if declared after', async () => {
      const gate = nodegate();
      gate.route({
        method: 'get',
        path: '/',
        workflow: [],
      });
      gate.beforeEach((container) => { container.body.before = true; });
      await request(gate)
        .get('/')
        .expect(200)
        .then(({ body }) => {
          expect(body.before).toBe(true);
        });
    });
    it('should accept an array of workers', async () => {
      const gate = nodegate();
      gate.route({
        method: 'post',
        path: '/',
        workflow: [],
      });
      gate.beforeEach([
        (container) => { container.body.count += 1; },
        (container) => { container.body.count += 10; },
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
  describe('#passthrough', () => {
    it('should call the target URL with the right verb', async () => {
      nock('http://service.com').get('/').reply(200);
      const gate = nodegate();
      gate.passthrough({
        method: 'get',
        path: '/service',
        target: 'http://service.com',
      });
      await request(gate).get('/service').expect(200);
    });
    it('should call the target URL with the headers', async () => {
      nock('http://service.com', {
        reqheaders: {
          authorization: 'shu:drum',
        },
      }).get('/').reply(200);
      const gate = nodegate();
      gate.passthrough({
        method: 'get',
        path: '/service',
        target: 'http://service.com',
      });
      await request(gate)
        .get('/service')
        .set('authorization', 'shu:drum')
        .expect(200);
    });
    it('should call the target URL with the body', async () => {
      nock('http://service.com').get('/', { username: 'shudrum' }).reply(200);
      const gate = nodegate();
      gate.passthrough({
        method: 'get',
        path: '/service',
        target: 'http://service.com',
      });
      await request(gate)
        .get('/service')
        .send({ username: 'shudrum' })
        .expect(200);
    });
    it('should return the raw body', async () => {
      nock('http://service.com').get('/').reply(200, 'Multiline\nContent');
      const gate = nodegate();
      gate.passthrough({
        method: 'get',
        path: '/service',
        target: 'http://service.com',
      });
      const { text } = await request(gate)
        .get('/service')
        .expect(200);
      expect(text).toEqual('Multiline\nContent');
    });
    it('should build the target url', async () => {
      nock('http://service.com').get(/client\/[0-9]*/).reply(200);
      const gate = nodegate();
      gate.passthrough({
        method: 'get',
        path: '/client/:clientId',
        target: (req) => `http://service.com/client/${req.params.clientId}`,
      });
      await request(gate).get('/client/123').expect(200);
    });
  });
  describe('#use', () => {
    it('should work with express middlewares', async () => {
      expect.assertions(1);
      const gate = nodegate();
      gate.use((req, _, next) => {
        req.testValue = 'Hello';
        next();
      });
      gate.route({
        method: 'get',
        path: '/route1',
        workflow: [(_, req) => {
          expect(req.testValue).toEqual('Hello');
        }],
      });
      await request(gate).get('/route1').expect(200);
    });
    it('should work with multiple middlewares on the right order', async () => {
      expect.assertions(1);
      const gate = nodegate();
      gate.use([(req, _, next) => {
        req.testValue = 'Hello';
        next();
      }, (req, _, next) => {
        req.testValue += ' world';
        next();
      }]);
      gate.route({
        method: 'get',
        path: '/route1',
        workflow: [(_, req) => {
          expect(req.testValue).toEqual('Hello world');
        }],
      });
      await request(gate).get('/route1').expect(200);
    });
    it('should ignore routes added before the middleware', async () => {
      expect.assertions(1);
      const gate = nodegate();
      gate.route({
        method: 'get',
        path: '/route1',
        workflow: [(_, req) => {
          expect(req.testValue).toBeUndefined();
        }],
      });
      gate.use((req, _, next) => {
        req.testValue = 'Hello';
        next();
      });
      await request(gate).get('/route1').expect(200);
    });
  });
  describe('HTTP status codes', () => {
    it('should respond a 500 error in case of error', async () => {
      const gate = nodegate();
      gate.route({
        method: 'get',
        path: '/',
        workflow: [
          () => { throw new Error('Section 31 classified'); },
        ],
      });
      await request(gate)
        .get('/')
        .expect(500);
    });
    it('should respond the last request error code in case of error', async () => {
      const gate = nodegate();
      gate.route({
        method: 'get',
        path: '/',
        workflow: [
          () => {
            const error = new WorkflowError('Section 31 classified');
            error.setContainer({ statusCode: 404 });
            throw error;
          },
        ],
      });
      await request(gate)
        .get('/')
        .expect(404);
    });
    it('should execute the onError callback of the route in case of error', async () => {
      const gate = nodegate();
      gate.route({
        method: 'get',
        path: '/',
        workflow: [
          () => { throw new Error('Section 31 classified'); },
        ],
        onError: (error) => {
          error.container.statusCode = 503;
        },
      });
      await request(gate)
        .get('/')
        .expect(503);
    });
  });
});
