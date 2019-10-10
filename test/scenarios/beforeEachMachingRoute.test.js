const nock = require('nock');
const request = require('supertest');
const nodegate = require('../../services/nodegate');
const { aggregate, routeMatch } = require('../../workers');

describe('scenarios/beforeEachMachingRoute', () => {
  let gate;
  beforeEach(() => {
    gate = nodegate();
    gate.beforeEach(routeMatch(/\/captain\/*/, [
      (container) => { container.body.type = 'captain'; },
    ]));
    gate.route({
      method: 'get',
      path: '/captain/:name',
      workflow: [
        aggregate('get', 'https://federation.com/captains/{params.name}', 'data'),
      ],
    });
    gate.route({
      method: 'get',
      path: '/ships',
      workflow: [
        aggregate('get', 'https://federation.com/ships'),
      ],
    });
    nock('https://federation.com')
      .get('/captains/kirk')
      .reply(200, { completeName: 'James T. Kirk' });
    nock('https://federation.com')
      .get('/ships')
      .reply(200, { list: ['enterprise', 'voyager'] });
  });
  afterEach(() => {
    nock.cleanAll();
  });
  it('should set the "type" property if the path match /captain', async () => {
    await request(gate)
      .get('/captain/kirk')
      .expect(200)
      .then(({ body }) => {
        expect(body.type).toEqual('captain');
      });
  });
  it('should execute the route worker for path /captain', async () => {
    await request(gate)
      .get('/captain/kirk')
      .expect(200)
      .then(({ body }) => {
        expect(body.data.completeName).toEqual('James T. Kirk');
      });
  });
  it('should execute the route /ships', async () => {
    await request(gate)
      .get('/ships')
      .expect(200)
      .then(({ body }) => {
        expect(body.list).toEqual(['enterprise', 'voyager']);
      });
  });
  it('should not add the "type" property for path /ships', async () => {
    await request(gate)
      .get('/ships')
      .expect(200)
      .then(({ body }) => {
        expect(body.type).toBeFalsy();
      });
  });
});
