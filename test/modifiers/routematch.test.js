const routematch = require('../../modifiers/routematch');

const step = jest.fn();
const execute = jest.fn();

describe('modifiers/routematch', () => {
  beforeEach(() => {
    step.mockClear();
    execute.mockClear();
  });
  it('should correctly return a function', () => {
    expect(routematch()).toBeInstanceOf(Function);
  });
  it('should execute the pipeline if the route match', () => {
    routematch(/\/captain*/, [step])(
      { body: { name: 'Kirk' } },
      { route: { path: '/captain/:name' } },
      execute,
    );
    expect(execute.mock.calls.length).toBe(1);
    expect(execute.mock.calls[0][0]).toEqual([step]);
  });
  it('should not execute the pipeline if the route does not match', () => {
    routematch(/\/captain*/, [step])(
      { body: { name: 'Kirk' } },
      { route: { path: '/ship/:name' } },
      execute,
    );
    expect(execute.mock.calls.length).toBe(0);
  });
});
