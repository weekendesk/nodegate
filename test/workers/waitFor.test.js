const fetchMock = require('fetch-mock').default;
const { configure } = require('../../services/configuration');
const waitFor = require('../../workers/waitFor');
const { getEmpty } = require('../../entities/container');

describe('workers/waitFor', () => {
  beforeEach(() => {
    configure({ workers: { waitFor: { delay: 50, tentatives: 1 } } });
  });
  afterEach(() => {
    fetchMock.removeRoutes();
  });
  it('should correctly return a function', () => {
    expect(waitFor()).toBeInstanceOf(Function);
  });
  it('should correclty return the container', async () => {
    const container = getEmpty();
    fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
      status: 200,
      body: { phasers: 16 },
    });

    const result = await waitFor('post', 'https://wiki.federation.com/armaments', () => true)(container);
    expect(result.body).toBeTruthy();
  });
  it('should not alter the container', async () => {
    const container = { body: { phasers: 2 } };
    fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
      status: 200,
      body: { phasers: 16 },
    });
    const result = await waitFor('post', 'https://wiki.federation.com/armaments', () => true)(container);
    expect(result.body.phasers).toEqual(2);
  });
  it('should correclty test the response for a success', async () => {
    const container = getEmpty();
    fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
      status: 200,
      body: { phasers: 16 },
    });
    await waitFor(
      'post',
      'https://wiki.federation.com/armaments',
      ({ body }) => body.phasers === 16,
    )(container);
  });
  it('should correclty retry if there is an error', async () => {
    const container = getEmpty();
    fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
      status: 200,
      body: { phasers: 16 },
    });
    fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
      status: 200,
      body: { phasers: 17 },
    });
    await waitFor(
      'post',
      'https://wiki.federation.com/armaments',
      ({ body }) => body.phasers === 17,
    )(container);
  });
  it('should correclty wait between tries', async () => {
    const startTime = new Date().getTime();
    fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
      status: 200,
      body: { phasers: 16 },
    });
    fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
      status: 200,
      body: { phasers: 17 },
    });
    await waitFor(
      'post',
      'https://wiki.federation.com/armaments',
      ({ body }) => body.phasers === 17,
    )({});
    const elapsedTime = new Date().getTime() - startTime;
    expect(elapsedTime).toBeGreaterThanOrEqual(50);
  });
  it('should throw an error after the second fail', async () => {
    expect.assertions(1);
    try {
      fetchMock.mockGlobal().post('https://wiki.federation.com/armaments', {
        status: 200,
        body: { phasers: 16 },
        repeat: 2,
      });
      await waitFor(
        'post',
        'https://wiki.federation.com/armaments',
        ({ body }) => body.phasers === 17,
      )({});
    } catch (err) {
      expect(err.message).toBe('Wait for https://wiki.federation.com/armaments failed');
    }
  });
  it('should correctly pass the status code to the test', async () => {
    fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
      status: 202,
      body: {},
    });
    await waitFor(
      'post',
      'https://wiki.federation.com/armaments',
      ({ status }) => status === 202,
    )({});
  });
  it('should correctly pass the container to the test', async () => {
    fetchMock.mockGlobal().postOnce('https://wiki.federation.com/armaments', {
      status: 200,
      body: { phasers: 16 },
    });
    const result = await waitFor(
      'post',
      'https://wiki.federation.com/armaments',
      ({ body }, container) => body.phasers > container.body.phasers,
    )({ body: { phasers: 8 } });
    expect(result.body.phasers).toEqual(8);
  });
});
