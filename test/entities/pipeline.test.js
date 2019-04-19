const { executor } = require('../../entities/pipeline');

const step1 = jest.fn(container => container);
const step2 = jest.fn(container => container);
const step3 = jest.fn(container => container);
const send = jest.fn(container => container);

const timedStep1 = jest.fn(container => new Promise(
  resolve => setTimeout(() => resolve({
    ...container,
    body: {
      ...container.body,
      name: 'NCC-1701-F',
    },
  }), 10),
));
const timedStep2 = jest.fn(container => new Promise(
  resolve => setTimeout(() => resolve(container), 10),
));

const request = {
  headers: {
    origin: 'https://wiki.federation.com',
  },
  body: {
    ships: [{
      name: 'NCC-1701-E',
      armaments: {
        phasers: 16,
        torpedo: 2,
      },
    }],
  },
};

describe('entities/pipeline', () => {
  beforeEach(() => {
    step1.mockClear();
    step2.mockClear();
    step3.mockClear();
    send.mockClear();
    timedStep1.mockClear();
    timedStep2.mockClear();
  });
  describe('#execute()', () => {
    it('should call a unique pipeline step', async () => {
      await executor([step1])(request, { send });
      expect(step1.mock.calls.length).toBe(1);
      expect(step1.mock.calls[0][0].body).toBe(request.body);
      expect(send.mock.calls.length).toBe(1);
    });
    it('should call all the pipeline steps', async () => {
      await executor([step1, step2, step3])(request, { send });
      expect(step1.mock.calls.length).toBe(1);
      expect(step2.mock.calls.length).toBe(1);
      expect(step3.mock.calls.length).toBe(1);
      expect(step3.mock.calls[0][0].body).toBe(request.body);
      expect(send.mock.calls.length).toBe(1);
    });
    it('should work with asynchronous modifiers', async () => {
      await executor([timedStep1, timedStep2])(request, { send });
      expect(timedStep1.mock.calls.length).toBe(1);
      expect(timedStep2.mock.calls.length).toBe(1);
      expect(send.mock.calls.length).toBe(1);
      expect(send.mock.results[0].value.name).toEqual('NCC-1701-F');
    });
    it('should send the original request to the modifiers', async () => {
      await executor([step1])(request, { send });
      expect(step1.mock.calls.length).toBe(1);
      expect(step1.mock.calls[0][1].headers.origin).toEqual('https://wiki.federation.com');
    });
  });
});
