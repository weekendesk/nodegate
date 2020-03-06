const nock = require('nock');
const aggregate = require('../../workers/aggregate');
const { getEmpty } = require('../../entities/container');
const WorkflowError = require('../../entities/WorkflowError');

describe('workers/aggregate', () => {
  it('should correctly return a function', () => {
    expect(aggregate()).toBeInstanceOf(Function);
  });
  it('should not throw an error "Cannot read property \'body|headers\' of undefined|null" if not related to a request', async () => {
    expect.assertions(4);
    try {
      await aggregate('post', 'https://wiki.federation.com/armaments')(null);
    } catch (err) {
      expect(err.message).not.toEqual('Cannot read property \'body\' of undefined');
      expect(err.message).not.toEqual('Cannot read property \'headers\' of undefined');
      expect(err.message).not.toEqual('TypeError: Cannot read property \'body\' of null');
      expect(err.message).not.toEqual('TypeError: Cannot read property \'headers\' of null');
    }
  });
  describe('without option', () => {
    it('should aggregate to an empty content', async () => {
      const container = getEmpty();
      nock('https://wiki.federation.com').get('/armaments').reply(200, {
        phasers: 16,
        torpedoes: 2,
      });
      await aggregate('get', 'https://wiki.federation.com/armaments')(container);
      expect(container.body.phasers).toBe(16);
      expect(container.body.torpedoes).toBe(2);
    });
    it('should use the urlBuilder on the URL', async () => {
      const container = {
        body: {
          name: 'NCC-1717',
          disruptors: 5,
        },
      };
      nock('https://wiki.federation.com').get('/armaments/NCC-1717').reply(200, {
        phasers: 16,
        torpedoes: 2,
      });
      await aggregate('get', 'https://wiki.federation.com/armaments/{body.name}')(container);
      expect(container.body.disruptors).toEqual(5);
      expect(container.body.phasers).toEqual(16);
      expect(container.body.torpedoes).toEqual(2);
    });
    it('should correctly set the statusCode of the container from the request', async () => {
      const container = getEmpty();
      nock('https://wiki.federation.com').post('/armaments').reply(201);
      await aggregate('post', 'https://wiki.federation.com/armaments')(container);
      expect(container.statusCode).toBe(201);
    });
    it('should ignore the response if it is a full text response', async () => {
      const container = {
        ...getEmpty(),
        body: {
          ship: 'NCC-1717',
        },
      };
      nock('https://wiki.federation.com').post('/armaments').reply(200, 'Too much armaments to display');
      await aggregate('post', 'https://wiki.federation.com/armaments')(container);
      expect(container.body).toEqual({
        ship: 'NCC-1717',
      });
    });
  });
  describe('with "path" option', () => {
    it('should correclty use aggregate the result on the defined path', async () => {
      const container = getEmpty();
      nock('https://wiki.federation.com').get('/armaments').reply(200, {
        phasers: 16,
        torpedoes: 2,
      });
      await aggregate('get', 'https://wiki.federation.com/armaments', {
        path: 'armaments',
      })(container);
      expect(container.body.armaments.phasers).toBe(16);
      expect(container.body.armaments.torpedoes).toBe(2);
    });
    it('should do a deep merge if values exists at the defined path', async () => {
      const container = {
        body: {
          armaments: {
            disruptors: 5,
          },
        },
      };
      nock('https://wiki.federation.com').get('/armaments').reply(200, {
        phasers: 16,
        torpedoes: 2,
      });
      await aggregate('get', 'https://wiki.federation.com/armaments', {
        path: 'armaments',
      })(container);
      expect(container.body.armaments.disruptors).toBe(5);
      expect(container.body.armaments.phasers).toBe(16);
      expect(container.body.armaments.torpedoes).toBe(2);
    });
    it('should set the full text response at the path value', async () => {
      const container = {
        ...getEmpty(),
        body: {
          ship: 'NCC-1717',
        },
      };
      nock('https://wiki.federation.com').post('/armaments').reply(200, 'OK');
      await aggregate('post', 'https://wiki.federation.com/armaments', {
        path: 'text',
      })(container);
      expect(container.body).toEqual({
        ship: 'NCC-1717',
        text: 'OK',
      });
    });
  });
  describe('error management', () => {
    it('should throw a Workflow error in case of 500 error', async () => {
      expect.assertions(1);
      try {
        const container = getEmpty();
        nock('https://wiki.federation.com').post('/section31').reply(500);
        await aggregate('post', 'https://wiki.federation.com/section31')(container);
      } catch (err) {
        expect(err).toBeInstanceOf(WorkflowError);
      }
    });
    it('should set the request response on the error', async () => {
      expect.assertions(1);
      try {
        const container = getEmpty();
        nock('https://wiki.federation.com').post('/section31').reply(500);
        await aggregate('post', 'https://wiki.federation.com/section31')(container);
      } catch (err) {
        expect(err.response.statusCode).toEqual(500);
      }
    });
    it('should set the container on the WorkflowError', async () => {
      expect.assertions(1);
      try {
        const container = getEmpty();
        nock('https://wiki.federation.com').post('/section31').reply(500);
        await aggregate('post', 'https://wiki.federation.com/section31')(container);
      } catch (err) {
        expect(err.container).toBeTruthy();
      }
    });
    it('should set the container errorBody on 500 error', async () => {
      expect.assertions(1);
      try {
        const container = getEmpty();
        nock('https://wiki.federation.com').post('/section31').reply(500, {
          reason: 'Section 31 does not exists',
        });
        await aggregate('post', 'https://wiki.federation.com/section31')(container);
      } catch (err) {
        expect(err.container.errorBody).toEqual({
          reason: 'Section 31 does not exists',
        });
      }
    });
    it('should set the container errorBody on 404 error', async () => {
      expect.assertions(1);
      try {
        const container = getEmpty();
        nock('https://wiki.federation.com').post('/armaments').reply(404);
        await aggregate('post', 'https://wiki.federation.com/armaments')(container);
      } catch (err) {
        expect(err.container.statusCode).toEqual(404);
      }
    });
    it('should not throw if the statusCode is not on the "failStatusCodes" option', async () => {
      const container = getEmpty();
      nock('https://wiki.federation.com')
        .post('/armaments')
        .reply(404, { content: 'This article does not exists' });
      await aggregate(
        'post',
        'https://wiki.federation.com/armaments',
        { failStatusCodes: [500] },
      )(container);
      expect(container.body.content).toEqual('This article does not exists');
    });
  });
});
