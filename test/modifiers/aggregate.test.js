const nock = require('nock');
const aggregate = require('../../modifiers/aggregate');
const { getEmpty, extractFromRequest } = require('../../entities/container');

describe('modifiers/aggregate', () => {
  it('should correctly return a function', () => {
    expect(aggregate()).toBeInstanceOf(Function);
  });
  it('should correclty aggregate an empty content', async () => {
    const container = getEmpty();
    nock('https://wiki.federation.com')
      .get('/armaments')
      .reply(200, {
        phasers: 16,
        torpedoes: 2,
      });
    const result = await aggregate('get', 'https://wiki.federation.com/armaments')(container);
    expect(result.body.phasers).toBe(16);
    expect(result.body.torpedoes).toBe(2);
  });
  it('should return another container', async () => {
    const container = getEmpty();
    nock('https://wiki.federation.com')
      .get('/armaments')
      .reply(200, {
        phasers: 16,
        torpedoes: 2,
      });
    const result = await aggregate('get', 'https://wiki.federation.com/armaments')(container);
    expect(container).not.toBe(result);
  });
  it('should correclty use the key parameter', async () => {
    const container = getEmpty();
    nock('https://wiki.federation.com')
      .get('/armaments')
      .reply(200, {
        phasers: 16,
        torpedoes: 2,
      });
    const result = await aggregate(
      'get',
      'https://wiki.federation.com/armaments',
      'armaments',
    )(container);
    expect(result.body.armaments.phasers).toBe(16);
    expect(result.body.armaments.torpedoes).toBe(2);
  });
  it('should do a correct deep merge', async () => {
    const container = extractFromRequest({
      body: {
        armaments: {
          disruptors: 5,
        },
      },
    });
    nock('https://wiki.federation.com')
      .get('/armaments')
      .reply(200, {
        phasers: 16,
        torpedoes: 2,
      });
    const result = await aggregate(
      'get',
      'https://wiki.federation.com/armaments',
      'armaments',
    )(container);
    expect(result.body.armaments.disruptors).toBe(5);
    expect(result.body.armaments.phasers).toBe(16);
    expect(result.body.armaments.torpedoes).toBe(2);
  });
  it('should use the urlBuilder', async () => {
    const container = extractFromRequest({
      body: {
        name: 'NCC-1717',
        armaments: {
          disruptors: 5,
        },
      },
    });
    nock('https://wiki.federation.com')
      .get('/armaments/NCC-1717')
      .reply(200, {
        phasers: 16,
        torpedoes: 2,
      });
    const result = await aggregate(
      'get',
      'https://wiki.federation.com/armaments/{body.name}',
      'armaments',
    )(container);
    expect(result.body.name).toBe('NCC-1717');
    expect(result.body.armaments.disruptors).toBe(5);
    expect(result.body.armaments.phasers).toBe(16);
    expect(result.body.armaments.torpedoes).toBe(2);
  });
  it('should correctly set the statusCode of the container from the request', async () => {
    const container = getEmpty();
    nock('https://wiki.federation.com')
      .post('/armaments')
      .reply(201);
    const result = await aggregate(
      'post',
      'https://wiki.federation.com/armaments',
    )(container);
    expect(result.statusCode).toBe(201);
  });
});
