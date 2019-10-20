const nock = require('nock');
const request = require('../../services/request');
const urlBuilder = require('../../services/urlBuilder');

describe('services/request', () => {
  it('should do a simple request', async () => {
    nock('https://wiki.federation.com').get('/ships/enterprise').reply(200, [
      'NCC-1701',
      'NCC-1717',
    ]);
    const result = await request({}, 'get', 'https://wiki.federation.com/ships/enterprise');
    expect(result.statusCode).toBe(200);
  });
  it('should inject container data to the url if it is a builded URL', async () => {
    const url = urlBuilder('https://wiki.federation.com/ships/{body.ship.name}');
    const container = { body: { ship: { name: 'enterprise' } } };
    nock('https://wiki.federation.com').get('/ships/enterprise').reply(200, [
      'NCC-1701',
      'NCC-1717',
    ]);
    const result = await request(container, 'get', url);
    expect(result.statusCode).toBe(200);
  });
  it('should throw an error when the response status code is 500', async () => {
    expect.assertions(1);
    nock('https://wiki.federation.com').get('/ships').reply(500);
    try {
      await request({}, 'get', 'https://wiki.federation.com/ships');
    } catch (err) {
      expect(err.statusCode).toEqual(500);
    }
  });
  it('should throw an error when the response status code is 404', async () => {
    expect.assertions(1);
    nock('https://wiki.federation.com').get('/ships').reply(404);
    try {
      await request({}, 'get', 'https://wiki.federation.com/ships');
    } catch (err) {
      expect(err.statusCode).toEqual(404);
    }
  });
  describe('arguments validation', () => {
    it('should throw an error if the "container" argument is a string', async () => {
      expect.assertions(1);
      try {
        await request('container', 'get', 'https://wiki.federation.com/ships');
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should throw an error if the "container" argument is a number', async () => {
      expect.assertions(1);
      try {
        await request(1701, 'get', 'https://wiki.federation.com/ships');
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should throw an error if the "container" argument is a array', async () => {
      expect.assertions(1);
      try {
        await request([], 'get', 'https://wiki.federation.com/ships');
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should throw an error if the "container" argument is a function', async () => {
      expect.assertions(1);
      try {
        await request(() => {}, 'get', 'https://wiki.federation.com/ships');
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should throw an error if the "method" argument is an object', async () => {
      expect.assertions(1);
      try {
        await request({}, {}, 'https://wiki.federation.com/ships');
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should throw an error if the "method" argument is a number', async () => {
      expect.assertions(1);
      try {
        await request({}, 1701, 'https://wiki.federation.com/ships');
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should throw an error if the "method" argument is an array', async () => {
      expect.assertions(1);
      try {
        await request({}, [], 'https://wiki.federation.com/ships');
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should throw an error if the "method" argument is a function', async () => {
      expect.assertions(1);
      try {
        await request({}, () => {}, 'https://wiki.federation.com/ships');
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should throw an error if the "url" argument is an object', async () => {
      expect.assertions(1);
      try {
        await request({}, 'get', {});
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should throw an error if the "url" argument is a number', async () => {
      expect.assertions(1);
      try {
        await request({}, 'get', 1701);
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should throw an error if the "url" argument is an array', async () => {
      expect.assertions(1);
      try {
        await request({}, 'get', []);
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should throw an error if the "options" argument is a string', async () => {
      expect.assertions(1);
      try {
        await request({}, 'get', 'https://wiki.federation.com/ships', 'options');
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should throw an error if the "options" argument is a number', async () => {
      expect.assertions(1);
      try {
        await request({}, 'get', 'https://wiki.federation.com/ships', 1701);
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should throw an error if the "options" argument is an array', async () => {
      expect.assertions(1);
      try {
        await request({}, 'get', 'https://wiki.federation.com/ships', []);
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should throw an error if the "options" argument is a function', async () => {
      expect.assertions(1);
      try {
        await request({}, 'get', 'https://wiki.federation.com/ships', () => {});
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
  });
  describe('option "headers"', () => {
    it('should do the request with the container headers if not set', async () => {
      nock('https://wiki.federation.com', {
        reqheaders: {
          authorization: 'Bearer 1234567890',
        },
      }).get('/ships').reply(200);
      const container = { headers: { authorization: 'Bearer 1234567890' } };
      const { statusCode } = await request(container, 'get', 'https://wiki.federation.com/ships');
      expect(statusCode).toEqual(200);
    });
    it('should be possible to project values from the container headers', async () => {
      nock('https://wiki.federation.com', {
        reqheaders: {
          authorization: 'Bearer 1234567890',
        },
      }).get('/ships').reply(200);
      const container = {
        headers: {
          user: 'Bearer 1234567890',
          'X-forwarded-from': 'http://klingon.com',
        },
      };
      const { statusCode } = await request(container, 'get', 'https://wiki.federation.com/ships', {
        headers: {
          authorization: 'headers.user',
        },
      });
      expect(statusCode).toEqual(200);
    });
    it('should be possible to project values from the container body', async () => {
      nock('https://wiki.federation.com', {
        reqheaders: {
          authorization: 'Bearer 1234567890',
        },
      }).get('/ships').reply(200);
      const container = {
        body: {
          user: 'Bearer 1234567890',
          'X-forwarded-from': 'http://klingon.com',
        },
      };
      const { statusCode } = await request(container, 'get', 'https://wiki.federation.com/ships', {
        headers: {
          authorization: 'body.user',
        },
      });
      expect(statusCode).toEqual(200);
    });
    it('should be possible to set the headers to null', async () => {
      nock('https://wiki.federation.com', {
        badheaders: ['authorization'],
      }).get('/ships').reply(200);
      const container = {
        headers: {
          authorization: 'Bearer 1234567890',
          'X-forwarded-from': 'http://klingon.com',
        },
      };
      const { statusCode } = await request(container, 'get', 'https://wiki.federation.com/ships', {
        headers: null,
      });
      expect(statusCode).toEqual(200);
    });
    it('should throw an error if the projection is an array', async () => {
      expect.assertions(1);
      try {
        await request({}, 'get', 'https://wiki.federation.com/ships', {
          headers: {
            ship: ['1701'],
          },
        });
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should throw an error if the projection is an number', async () => {
      expect.assertions(1);
      try {
        await request({}, 'get', 'https://wiki.federation.com/ships', {
          headers: {
            ship: 1701,
          },
        });
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
    it('should not throw error with unknow projection path', async () => {
      nock('https://wiki.federation.com').get('/ships').reply(200);
      const { statusCode } = await request({}, 'get', 'https://wiki.federation.com/ships', {
        headers: {
          authorization: 'headers.user',
        },
      });
      expect(statusCode).toEqual(200);
    });
  });
  describe('option "body"', () => {
    it('should do the request with the container body if not set', async () => {
      nock('https://wiki.federation.com').get('/ships', {
        name: 'Jean-Luc Picard',
      }).reply(200);
      const container = { body: { name: 'Jean-Luc Picard' } };
      const { statusCode } = await request(container, 'get', 'https://wiki.federation.com/ships');
      expect(statusCode).toEqual(200);
    });
    it('should be possible to project values from the container body', async () => {
      nock('https://wiki.federation.com').get('/ships', {
        captain: 'Jean-Luc Picard',
      }).reply(200);
      const container = { body: { name: 'Jean-Luc Picard' } };
      const { statusCode } = await request(container, 'get', 'https://wiki.federation.com/ships', {
        body: {
          captain: 'body.name',
        },
      });
      expect(statusCode).toEqual(200);
    });
    it('should be possible to project values from the container headers', async () => {
      nock('https://wiki.federation.com').get('/ships', {
        captain: 'Jean-Luc Picard',
      }).reply(200);
      const container = { headers: { name: 'Jean-Luc Picard' } };
      const { statusCode } = await request(container, 'get', 'https://wiki.federation.com/ships', {
        body: {
          captain: 'headers.name',
        },
      });
      expect(statusCode).toEqual(200);
    });
    it('should be possible to set the body to null', async () => {
      nock('https://wiki.federation.com').get('/ships', (body) => body === null).reply(200);
      const container = { headers: { name: 'Jean-Luc Picard' } };
      const { statusCode } = await request(container, 'get', 'https://wiki.federation.com/ships', {
        body: null,
      });
      expect(statusCode).toEqual(200);
    });
    it('should allow deep projections', async () => {
      nock('https://wiki.federation.com').get('/ships', {
        captain: 'Jean-Luc Picard',
        ships: {
          favorite: 'NCC-1701',
        },
      }).reply(200);
      const container = {
        body: {
          name: 'Jean-Luc Picard',
          ships: ['NCC-1701'],
        },
      };
      const { statusCode } = await request(container, 'get', 'https://wiki.federation.com/ships', {
        body: {
          captain: 'body.name',
          ships: {
            favorite: 'body.ships[0]',
          },
        },
      });
      expect(statusCode).toEqual(200);
    });
  });
});
