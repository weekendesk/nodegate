const { execute } = require('../../entities/route');
const PipelineError = require('../../entities/PipelineError');

const step = jest.fn((container) => container);
const asyncStep = jest.fn((container) => new Promise((resolve) => resolve(container)));

const send = jest.fn((container) => container);
const sendStatus = jest.fn();
const status = jest.fn(() => ({ send }));
const response = { status, sendStatus };

const onError = jest.fn((error) => error.container);

const request = {
  headers: {
    origin: 'https://wiki.federation.com',
  },
  body: {
    name: 'NCC-1701-E',
  },
};

describe('entities/route', () => {
  beforeEach(() => {
    step.mockClear();
    asyncStep.mockClear();
    send.mockClear();
    sendStatus.mockClear();
    status.mockClear();
    onError.mockClear();
  });
  describe('#execute()', () => {
    it('should call a unique pipeline step', async () => {
      await execute({ pipeline: [step] })(request, response);
      expect(step.mock.calls.length).toBe(1);
      expect(step.mock.calls[0][0].body).toBe(request.body);
      expect(send.mock.calls.length).toBe(1);
    });
    it('should call all the pipeline steps', async () => {
      await execute({ pipeline: [step, step, step] })(request, response);
      expect(step.mock.calls.length).toBe(3);
      expect(step.mock.calls[2][0].body).toEqual(request.body);
      expect(send.mock.calls.length).toBe(1);
    });
    it('should work with asynchronous modifiers', async () => {
      await execute({ pipeline: [asyncStep, asyncStep] })(request, response);
      expect(asyncStep.mock.calls.length).toBe(2);
      expect(send.mock.calls.length).toBe(1);
      expect(send.mock.results[0].value).toEqual(request.body);
    });
    it('should send the original request to the modifiers', async () => {
      await execute({ pipeline: [step] })(request, response);
      expect(step.mock.calls.length).toBe(1);
      expect(step.mock.calls[0][1].headers.origin).toEqual('https://wiki.federation.com');
    });
    it('should execute the beforeEach attribute', async () => {
      await execute({ pipeline: [step] }, [step, step])(request, response);
      expect(step.mock.calls.length).toBe(3);
    });
    it('should execute the beforeEach modifiers before the pipeline', async () => {
      await execute({ pipeline: [step] }, [() => ({ body: { value: 'before' } })])(request, response);
      expect(step.mock.calls[0][0].body.value).toEqual('before');
    });
    it('should respond with the container status code', async () => {
      await execute({ pipeline: [() => ({ statusCode: 201 })] })(request, response);
    });
    it('should work with a recursive pipeline', async () => {
      const modifier = (letter) => (container) => ({
        body: {
          value: `${container.body.value}${letter}`,
        },
      });
      const pipeline = [modifier('a'), [modifier('b'), modifier('c')], modifier('d')];
      await execute({ pipeline })({ body: { value: '' } }, response);
      expect(send.mock.calls[0][0].value).toEqual('abcd');
    });
    it('should execute the onError property with a pipeline error', async () => {
      const throwingModifier = () => { throw new Error('error'); };
      await execute({ pipeline: [throwingModifier], onError })(request, response);
      expect(onError.mock.calls[0][0]).toBeInstanceOf(PipelineError);
    });
    it('should use an existing PipelineError instance', async () => {
      const error = new PipelineError('error', { statusCode: 404 });
      const throwingModifier = () => { throw error; };
      await execute({ pipeline: [throwingModifier], onError })(request, response);
      expect(onError.mock.calls[0][0]).toBe(error);
      expect(onError.mock.calls[0][0].response.statusCode).toEqual(404);
    });
    it('should set the container to the error', async () => {
      const throwingModifier = () => { throw new Error('error'); };
      await execute({ pipeline: [throwingModifier], onError })(request, response);
      expect(onError.mock.calls[0][0].container.body).toBe(request.body);
    });
    it('should set the container to a PipelineError withour Container', async () => {
      const throwingModifier = () => { throw new PipelineError('error'); };
      await execute({ pipeline: [throwingModifier], onError })(request, response);
      expect(onError.mock.calls[0][0].container.body).toBe(request.body);
    });
    it('respond 500 error in case of error', async () => {
      const throwingModifier = () => { throw new Error('error'); };
      await execute({ pipeline: [throwingModifier] })(request, response);
      expect(sendStatus.mock.calls.length).toBe(1);
      expect(sendStatus.mock.calls[0][0]).toEqual(500);
    });
    it('respond the error container statusCode if set', async () => {
      const error = new PipelineError('error');
      error.setContainer({ statusCode: 404 });
      const throwingModifier = () => { throw error; };
      await execute({ pipeline: [throwingModifier] })(request, response);
      expect(sendStatus.mock.calls.length).toBe(1);
      expect(sendStatus.mock.calls[0][0]).toEqual(404);
    });
    it('should use the response body for the error', async () => {
      const error = new PipelineError('error');
      const errorBody = { reason: 'The section 31 does not exists' };
      error.setContainer({
        statusCode: 404,
        errorBody,
      });
      const throwingModifier = () => { throw error; };
      await execute({ pipeline: [throwingModifier] })(request, response);
      expect(send.mock.calls.length).toBe(1);
      expect(status.mock.calls.length).toBe(1);
      expect(status.mock.calls[0][0]).toEqual(404);
      expect(send.mock.calls[0][0]).toEqual(errorBody);
    });
  });
});
