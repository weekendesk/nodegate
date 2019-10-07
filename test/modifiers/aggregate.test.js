const nock = require('nock');
const aggregate = require('../../modifiers/aggregate');
const { getEmpty, extractFromRequest } = require('../../entities/container');
const WorkflowError = require('../../entities/WorkflowError');

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
  it('should correclty use the path parameter', async () => {
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
  it('should throw a Workflow error in case of 500 error', async () => {
    expect.assertions(1);
    try {
      const container = getEmpty();
      nock('https://wiki.federation.com')
        .post('/section31')
        .reply(500);
      await aggregate(
        'post',
        'https://wiki.federation.com/section31',
      )(container);
    } catch (err) {
      expect(err).toBeInstanceOf(WorkflowError);
    }
  });
  it('should contain the request result on the error', async () => {
    expect.assertions(1);
    try {
      const container = getEmpty();
      nock('https://wiki.federation.com')
        .post('/section31')
        .reply(500);
      await aggregate(
        'post',
        'https://wiki.federation.com/section31',
      )(container);
    } catch (err) {
      expect(err.response.statusCode).toEqual(500);
    }
  });
  it('should set the container on the WorkflowError', async () => {
    expect.assertions(1);
    try {
      const container = getEmpty();
      nock('https://wiki.federation.com')
        .post('/section31')
        .reply(500);
      await aggregate(
        'post',
        'https://wiki.federation.com/section31',
      )(container);
    } catch (err) {
      expect(err.container).toBeTruthy();
    }
  });
  it('should set the container errorBody on error', async () => {
    expect.assertions(1);
    try {
      const container = getEmpty();
      nock('https://wiki.federation.com')
        .post('/section31')
        .reply(500, {
          reason: 'Section 31 does not exists',
        });
      await aggregate(
        'post',
        'https://wiki.federation.com/section31',
      )(container);
    } catch (err) {
      expect(err.container.errorBody).toEqual({
        reason: 'Section 31 does not exists',
      });
    }
  });
  it('should set the container errorBody on error', async () => {
    expect.assertions(1);
    try {
      const container = getEmpty();
      nock('https://wiki.federation.com')
        .post('/armaments')
        .reply(404);
      await aggregate(
        'post',
        'https://wiki.federation.com/armaments',
      )(container);
    } catch (err) {
      expect(err.container.statusCode).toEqual(404);
    }
  });
  it('should not throw an error "Cannot read property \'body\' of undefined" if not related to a request', async () => {
    expect.assertions(1);
    try {
      await aggregate(
        'post',
        'https://wiki.federation.com/armaments',
      )(null);
    } catch (err) {
      expect(err.message).not.toEqual('Cannot read property \'body\' of undefined');
    }
  });
  it('should, without path, ignore the response if it is a full text response', async () => {
    const container = {
      ...getEmpty(),
      body: {
        ship: 'NCC-1717',
      },
    };
    nock('https://wiki.federation.com')
      .post('/armaments')
      .reply(200, '\n');
    const result = await aggregate(
      'post',
      'https://wiki.federation.com/armaments',
    )(container);
    expect(result.body).toEqual({
      ship: 'NCC-1717',
    });
  });
  it('should, with path, set the full text response at the path value', async () => {
    const container = {
      ...getEmpty(),
      body: {
        ship: 'NCC-1717',
      },
    };
    nock('https://wiki.federation.com')
      .post('/armaments')
      .reply(200, 'OK');
    const result = await aggregate(
      'post',
      'https://wiki.federation.com/armaments',
      'text',
    )(container);
    expect(result.body).toEqual({
      ship: 'NCC-1717',
      text: 'OK',
    });
  });
});
