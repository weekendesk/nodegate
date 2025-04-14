const fetchMock = require('fetch-mock').default;
const request = require('../../services/request');
const { configure } = require('../../services/configuration');
const urlBuilder = require('../../services/urlBuilder');

describe('services/request', () => {
  afterEach(() => {
    fetchMock.removeRoutes();
  });
  it('should do a simple request', async () => {
    fetchMock.mockGlobal().getOnce('https://wiki.federation.com/ships/enterprise', {
      status: 200,
      body: [
        'NCC-1701',
        'NCC-1717',
      ],
    });
    const response = await request({}, 'get', 'https://wiki.federation.com/ships/enterprise');
    expect(response.status).toBe(200);
  });
  it('should inject container data to the url if it is a builded URL', async () => {
    const url = urlBuilder('https://wiki.federation.com/ships/{body.ship.name}');
    const container = { body: { ship: { name: 'enterprise' } } };
    fetchMock.mockGlobal().getOnce('https://wiki.federation.com/ships/enterprise', {
      status: 200,
      body: [
        'NCC-1701',
        'NCC-1717',
      ],
    });
    const response = await request(container, 'get', url);
    expect(response.status).toBe(200);
  });
  it('should throw an error when the response status code is 500', async () => {
    expect.assertions(2);
    fetchMock.mockGlobal().getOnce('https://wiki.federation.com/ships', {
      status: 500,
      throw: 'error',
    });
    try {
      const response = await request({}, 'get', 'https://wiki.federation.com/ships');
      expect(response.ok).toBeFalsy();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });
  it('should throw an error when the response status code is 404', async () => {
    expect.assertions(2);
    fetchMock.mockGlobal().getOnce('https://wiki.federation.com/ships', {
      status: 404,
      throw: 'error',
    });
    try {
      const response = await request({}, 'get', 'https://wiki.federation.com/ships');
      expect(response.status).toEqual(404);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });
  it('should merge the headers from configuration with the container headers', async () => {
    configure({
      headers: {
        'X-Powered-by': 'Cardassians',
      },
    });
    fetchMock.mockGlobal().getOnce('https://wiki.federation.com/ships', {
      status: 200,
    }, {
      headers: {
        authorization: 'Bearer 1234567890',
        'X-Powered-by': 'Cardassians',
      },
    });
    const container = { headers: { authorization: 'Bearer 1234567890' } };
    const response = await request(container, 'get', 'https://wiki.federation.com/ships');
    expect(response.status).toEqual(200);
    configure({});
  });
  it('should take the headers from configuration by default if container headers are null or undefined', async () => {
    configure({
      headers: {
        'X-Powered-by': 'Cardassians',
      },
    });
    fetchMock.mockGlobal().getOnce('https://wiki.federation.com/ships', {
      status: 200,
    }, {
      headers: {
        'X-Powered-by': 'Cardassians',
      },
    });
    const container = { headers: null };
    const response = await request(container, 'get', 'https://wiki.federation.com/ships');
    expect(response.status).toEqual(200);
    configure({});
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
      fetchMock.mockGlobal().getOnce('https://wiki.federation.com/ships', {
        status: 200,
      }, {
        headers: {
          authorization: 'Bearer 1234567890',
        },
      });
      const container = { headers: { authorization: 'Bearer 1234567890' } };
      const response = await request(container, 'get', 'https://wiki.federation.com/ships');
      expect(response.status).toEqual(200);
    });
    it('should be possible to project values from the container headers', async () => {
      fetchMock.mockGlobal().getOnce('https://wiki.federation.com/ships', {
        status: 200,
      }, {
        headers: {
          authorization: 'Bearer 1234567890',
        },
      });
      const container = {
        headers: {
          user: 'Bearer 1234567890',
          'X-forwarded-from': 'http://klingon.com',
        },
      };
      const response = await request(container, 'get', 'https://wiki.federation.com/ships', {
        headers: {
          authorization: 'headers.user',
        },
      });
      expect(response.status).toEqual(200);
    });
    it('should be possible to project values from the container body', async () => {
      fetchMock.mockGlobal().getOnce('https://wiki.federation.com/ships', {
        status: 200,
      }, {
        headers: {
          authorization: 'Bearer 1234567890',
        },
      });
      const container = {
        body: {
          user: 'Bearer 1234567890',
          'X-forwarded-from': 'http://klingon.com',
        },
      };
      const response = await request(container, 'get', 'https://wiki.federation.com/ships', {
        headers: {
          authorization: 'body.user',
        },
      });
      expect(response.status).toEqual(200);
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
      fetchMock.mockGlobal().getOnce('https://wiki.federation.com/ships', {
        status: 200,
      });
      const response = await request({}, 'get', 'https://wiki.federation.com/ships', {
        headers: {
          authorization: 'headers.user',
        },
      });
      expect(response.status).toEqual(200);
    });
    it('should be an immutable projection', async () => {
      fetchMock.mockGlobal().getOnce('https://wiki.federation.com/ships', {
        status: 200,
      });
      const headers = { authorization: 'headers.user' };
      await request(
        { headers: { user: 'Bearer 1234567890' } },
        'get',
        'https://wiki.federation.com/ships',
        { headers },
      );
      expect(headers.authorization).toEqual('headers.user');
    });
  });
  describe('option "body"', () => {
    it('should do the request with the container body if not set', async () => {
      fetchMock.mockGlobal().getOnce('https://wiki.federation.com/ships', {
        status: 200,
        body: { name: 'Jean-Luc Picard' },
      });
      const container = { body: { name: 'Jean-Luc Picard' } };
      const response = await request(container, 'get', 'https://wiki.federation.com/ships');
      expect(response.status).toEqual(200);
    });
    it('should be possible to project values from the container body', async () => {
      fetchMock.mockGlobal().postOnce('https://wiki.federation.com/ships', {
        status: 200,
        body: { name: 'Jean-Luc Picard' },
      });
      const container = { body: { name: 'Jean-Luc Picard' } };
      const response = await request(container, 'post', 'https://wiki.federation.com/ships', {
        body: {
          captain: 'body.name',
        },
      });
      expect(response.status).toEqual(200);
    });
    it('should be possible to project values from the container headers', async () => {
      fetchMock.mockGlobal().postOnce('https://wiki.federation.com/ships', {
        status: 200,
        body: { name: 'Jean-Luc Picard' },
      });
      const container = { headers: { name: 'Jean-Luc Picard' } };
      const { status } = await request(container, 'post', 'https://wiki.federation.com/ships', {
        body: {
          captain: 'headers.name',
        },
      });
      expect(status).toEqual(200);
    });
    it('should be possible to set the body to null', async () => {
      fetchMock.mockGlobal().postOnce('https://wiki.federation.com/ships', {
        status: 200,
        body: {},
      });
      const container = { headers: { name: 'Jean-Luc Picard' } };
      const { status } = await request(container, 'post', 'https://wiki.federation.com/ships', {
        body: null,
      });
      expect(status).toEqual(200);
    });
    it('should allow deep projections', async () => {
      fetchMock.mockGlobal().postOnce('https://wiki.federation.com/ships', {
        status: 200,
        body: {
          captain: 'Jean-Luc Picard',
          ships: {
            favorite: 'NCC-1701',
          },
        },
      });
      const container = {
        body: {
          name: 'Jean-Luc Picard',
          ships: ['NCC-1701'],
        },
      };
      const { status } = await request(container, 'post', 'https://wiki.federation.com/ships', {
        body: {
          captain: 'body.name',
          ships: {
            favorite: 'body.ships[0]',
          },
        },
      });
      expect(status).toEqual(200);
    });
    it('should be an immutable projection', async () => {
      fetchMock.mockGlobal().postOnce('https://wiki.federation.com/ships', {
        status: 200,
      });
      const body = { name: 'body.name' };
      await request(
        { body: { name: 'Jean-Luc Picard' } },
        'post',
        'https://wiki.federation.com/ships',
        { body },
      );
      expect(body.name).toEqual('body.name');
    });
  });
});
