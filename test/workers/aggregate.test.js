const fetchMock = require('fetch-mock').default;
const aggregate = require('../../workers/aggregate');
const { getEmpty } = require('../../entities/container');
const WorkflowError = require('../../entities/WorkflowError');

describe('workers/aggregate', () => {
  afterEach(() => {
    fetchMock.removeRoutes();
  });
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
  it('should override existing keys on the container\'s body', async () => {
    const container = getEmpty();
    container.body.phasers = 4;
    fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
      status: 200,
      body: { phasers: 16 },
    });
    await aggregate('post', 'https://wiki.federation.com/armaments')(container);
    expect(container.body.phasers).toEqual(16);
  });
  it('should override existing keys on the container\'s body', async () => {
    const container = getEmpty();
    container.body.captains = ['Jean-Luc Picard'];
    const captains = { list: ['Janeway', 'Cisco', 'Kirk', 'Jean-Luc Picard'] };
    fetchMock.mockGlobal().postOnce('https://wiki.federation.com/captains', {
      status: 200,
      body: { captains },
    });
    await aggregate('post', 'https://wiki.federation.com/captains')(container);
    expect(container.body.captains).toEqual(captains);
  });
  it('should be mutable', async () => {
    const container = getEmpty();
    const { body } = container;
    fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
      status: 200,
      body: { phasers: 16 },
    });
    await aggregate('post', 'https://wiki.federation.com/armaments')(container);
    expect(container.body.phasers).toEqual(16);
    expect(body.phasers).toEqual(16);
    expect(container.body).toBe(body);
  });
  describe('without option', () => {
    it('should aggregate to an empty content', async () => {
      const container = getEmpty();
      fetchMock.mockGlobal().getOnce('https://wiki.federation.com/armaments', {
        status: 200,
        body: {
          phasers: 16,
          torpedoes: 2,
        },
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
      fetchMock.mockGlobal().getOnce('https://wiki.federation.com/armaments/NCC-1717', {
        status: 200,
        body: {
          phasers: 16,
          torpedoes: 2,
        },
      });
      await aggregate('get', 'https://wiki.federation.com/armaments/{body.name}')(container);
      expect(container.body.disruptors).toEqual(5);
      expect(container.body.phasers).toEqual(16);
      expect(container.body.torpedoes).toEqual(2);
    });
    it('should correctly set the statusCode of the container from the request', async () => {
      const container = getEmpty();
      fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
        status: 201,
      });
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
      fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
        status: 200,
        body: 'Too much armaments to display',
      });
      await aggregate('post', 'https://wiki.federation.com/armaments')(container);
      expect(container.body).toEqual({
        ship: 'NCC-1717',
      });
    });
  });
  describe('with "path" option', () => {
    it('should correclty use aggregate the result on the defined path', async () => {
      const container = getEmpty();
      fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
        status: 200,
        body: {
          phasers: 16,
          torpedoes: 2,
        },
      });
      await aggregate('post', 'https://wiki.federation.com/armaments', {
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
      fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
        status: 200,
        body: {
          phasers: 16,
          torpedoes: 2,
        },
      });
      await aggregate('post', 'https://wiki.federation.com/armaments', {
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
      fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
        status: 200,
        body: 'OK',
      });
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
        fetchMock.mockGlobal().postOnce('https://wiki.federation.com/section31', {
          status: 500,
        });
        await aggregate('post', 'https://wiki.federation.com/section31')(container);
      } catch (err) {
        expect(err).toBeInstanceOf(WorkflowError);
      }
    });
    it('should set the request response on the error', async () => {
      expect.assertions(1);
      try {
        const container = getEmpty();
        fetchMock.mockGlobal().postOnce('https://wiki.federation.com/section31', {
          status: 500,
        });
        await aggregate('post', 'https://wiki.federation.com/section31')(container);
      } catch (err) {
        expect(err.response.statusCode).toEqual(500);
      }
    });
    it('should set the container on the WorkflowError', async () => {
      expect.assertions(1);
      try {
        const container = getEmpty();
        fetchMock.mockGlobal().postOnce('https://wiki.federation.com/section31', {
          status: 500,
        });
        await aggregate('post', 'https://wiki.federation.com/section31')(container);
      } catch (err) {
        expect(err.container).toBeTruthy();
      }
    });
    it('should set the container errorBody on 500 error', async () => {
      expect.assertions(1);
      try {
        const container = getEmpty();
        fetchMock.mockGlobal().postOnce('https://wiki.federation.com/section31', {
          status: 500,
          body: {
            reason: 'Section 31 does not exists',
          },
        });
        await aggregate('post', 'https://wiki.federation.com/section31')(container);
      } catch (err) {
        expect(err.container.errorBody).toEqual({
          metaInfo: {
            url: 'https://wiki.federation.com/section31',
          },
          reason: 'Section 31 does not exists',
        });
      }
    });
    it('should set the container errorBody on 404 error', async () => {
      expect.assertions(1);
      try {
        const container = getEmpty();
        fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
          status: 404,
        });
        await aggregate('post', 'https://wiki.federation.com/armaments')(container);
      } catch (err) {
        expect(err.container.statusCode).toEqual(404);
      }
    });
    it('should not throw if the statusCode is not on the "failStatusCodes" option', async () => {
      const container = getEmpty();
      fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
        status: 404,
        body: {
          content: 'This article does not exists',
        },
      });
      await aggregate(
        'post',
        'https://wiki.federation.com/armaments',
        { failStatusCodes: [500] },
      )(container);
      expect(container.body.content).toEqual('This article does not exists');
    });
    it('should set the container errorBody with metadata information', async () => {
      expect.assertions(2);
      const serviceUrl = 'https://wiki.federation.com/armaments';
      const expectedMetaInfo = {
        url: serviceUrl,
        id: 'armaments',
      };
      try {
        const container = getEmpty();
        fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
          status: 404,
        });
        await aggregate('post', serviceUrl, {
          id: 'armaments',
        })(container);
      } catch (err) {
        expect(err.container.statusCode).toEqual(404);
        expect(err.container.errorBody.metaInfo).toEqual(expect.objectContaining(expectedMetaInfo));
      }
    });
    it('should not set the metadata information', async () => {
      expect.assertions(2);
      const serviceUrl = 'https://wiki.federation.com/armaments';
      const expectedMetaInfo = {
        url: serviceUrl,
        id: 'armaments',
      };
      try {
        const container = getEmpty();
        fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
          status: 404,
        });
        await aggregate('post', serviceUrl, {
          id: 'armaments',
          errorOptions: {
            includeMetaInfo: false,
          },
        })(container);
      } catch (err) {
        expect(err.container.statusCode).toEqual(404);
        expect(err.container.errorBody.metaInfo).not
          .toEqual(expect.objectContaining(expectedMetaInfo));
      }
    });
    it('should set the container errorBody with custom message', async () => {
      expect.assertions(3);
      const serviceUrl = 'https://wiki.federation.com/armaments';
      const expectedErrorMessage = 'not available armaments';
      const expectedMetaInfo = {
        url: serviceUrl,
      };
      try {
        const container = getEmpty();
        fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
          status: 400,
        });
        await aggregate('post', serviceUrl, {
          id: 'armaments',
          errorOptions: {
            messages: {
              400: expectedErrorMessage,
            },
          },
        })(container);
      } catch (err) {
        expect(err.container.statusCode).toEqual(400);
        expect(err.container.errorBody.message).toEqual(expectedErrorMessage);
        expect(err.container.errorBody.metaInfo).toEqual(expect.objectContaining(expectedMetaInfo));
      }
    });
    it('should set the container errorBody with custom message when status code is not included in 4xx/5xx range and the service response contains a body', async () => {
      expect.assertions(3);
      const serviceUrl = 'https://wiki.federation.com/armaments';
      const expectedErrorMessage = 'not available armaments';
      const expectedMetaInfo = {
        url: serviceUrl,
      };
      try {
        const container = getEmpty();
        fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
          status: 302,
        });
        await aggregate('post', serviceUrl, {
          failStatusCodes: [302],
          id: 'armaments',
          errorOptions: {
            messages: {
              302: expectedErrorMessage,
            },
          },
        })(container);
      } catch (err) {
        expect(err.container.statusCode).toEqual(302);
        expect(err.container.errorBody.message).toEqual(expectedErrorMessage);
        expect(err.container.errorBody.metaInfo).toEqual(expect.objectContaining(expectedMetaInfo));
      }
    });
    it('should set the container errorBody with custom message when status code is included in the failStatusCode range and the service response does not contain a body', async () => {
      expect.assertions(3);
      const serviceUrl = 'https://wiki.federation.com/armaments';
      const expectedErrorMessage = 'not available armaments';
      const expectedMetaInfo = {
        url: serviceUrl,
      };
      try {
        const container = getEmpty();
        fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
          status: 302,
        });
        await aggregate('post', serviceUrl, {
          failStatusCodes: [300],
          id: 'armaments',
          errorOptions: {
            messages: {
              302: expectedErrorMessage,
            },
          },
        })(container);
      } catch (err) {
        expect(err.container.statusCode).toEqual(302);
        expect(err.container.errorBody.message).toEqual(expectedErrorMessage);
        expect(err.container.errorBody.metaInfo).toEqual(expect.objectContaining(expectedMetaInfo));
      }
    });
    it('should response a passthrough error from failed service', async () => {
      expect.assertions(2);
      const expectedErrorMessage = 'not available armaments';
      try {
        const container = getEmpty();
        fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
          status: 404,
        });
        await aggregate('post', 'https://wiki.federation.com/armaments', {
          id: 'armaments',
          errorOptions: {
            includeMetaInfo: true,
            messages: {
              404: expectedErrorMessage,
            },
          },
        })(container);
      } catch (err) {
        expect(err.container.statusCode).toEqual(404);
        expect(err.container.errorBody.message).toEqual(expectedErrorMessage);
      }
    });
  });
});
