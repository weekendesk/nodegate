const executeIf = require('../../workers/executeIf');

describe('workers/executeIf', () => {
  it('should correctly return a function', () => {
    expect(executeIf()).toBeInstanceOf(Function);
  });
  it('should execute the condition', () => {
    expect.assertions(1);
    executeIf(() => { expect(true).toBeTruthy(); }, [])();
  });
  it('should call the executeChunk function if the condition is true', () => {
    expect.assertions(1);
    executeIf(() => true, [])({}, {}, () => { expect(true).toBeTruthy(); });
  });
  it('should NOT call the executeChunk function if the condition is true', () => {
    expect.assertions(0);
    executeIf(() => false, [])({}, {}, () => { expect(true).toBeTruthy(); });
  });
  it('should pass the container to the condition parameter', () => {
    expect.assertions(1);
    executeIf(({ body }) => body.captain === 'Jean-Luc', [])(
      { body: { captain: 'Jean-Luc' } },
      {},
      () => { expect(true).toBeTruthy(); },
    );
  });
  it('should pass the request to the condition parameter', () => {
    expect.assertions(1);
    executeIf((_, { headers }) => headers.authorization === 'Picard-Gamma-6-0-7-3', [])(
      {},
      { headers: { authorization: 'Picard-Gamma-6-0-7-3' } },
      () => { expect(true).toBeTruthy(); },
    );
  });
  it('should pass the needed parameters to the function executeChunk', () => {
    expect.assertions(3);
    const workflow = ['step1', 'step2'];
    const container = { body: {} };
    const request = { headers: {} };
    executeIf(() => true, workflow)(
      container,
      request,
      (workflowParameter, containerParameter, requestParameter) => {
        expect(workflowParameter).toBe(workflow);
        expect(containerParameter).toBe(container);
        expect(requestParameter).toBe(request);
      },
    );
  });
  it('should await for the execution of the executeChunk', async () => {
    let value = 0;
    const wait = () => new Promise((resolve) => setTimeout(() => {
      value = 1;
      resolve();
    }), 50);
    await executeIf(() => true, [])({}, {}, wait);
    expect(value).toEqual(1);
  });
});
