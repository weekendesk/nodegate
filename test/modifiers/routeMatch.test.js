const routeMatch = require('../../modifiers/routeMatch');

const step = jest.fn();
const execute = jest.fn();

describe('modifiers/routeMatch', () => {
  beforeEach(() => {
    step.mockClear();
    execute.mockClear();
  });
  it('should correctly return a function', () => {
    expect(routeMatch()).toBeInstanceOf(Function);
  });
  it('should execute the workflow if the route match', () => {
    routeMatch(/\/captain*/, [step])(
      { body: { name: 'Kirk' } },
      { route: { path: '/captain/:name' } },
      execute,
    );
    expect(execute.mock.calls.length).toBe(1);
    expect(execute.mock.calls[0][0]).toEqual([step]);
  });
  it('should not execute the workflow if the route does not match', () => {
    routeMatch(/\/captain*/, [step])(
      { body: { name: 'Kirk' } },
      { route: { path: '/ship/:name' } },
      execute,
    );
    expect(execute.mock.calls.length).toBe(0);
  });
});
