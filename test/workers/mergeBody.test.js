const mergeBody = require('../../workers/mergeBody');

describe('workers/mergeBody', () => {
  it('should correctly return a function', () => {
    expect(mergeBody()).toBeInstanceOf(Function);
  });
  it('should return the container with the merged body', () => {
    const container = { body: { } };
    mergeBody({ user: 'Jean Luc' })(container);
    expect(container).toEqual({
      body: { user: 'Jean Luc' },
    });
  });
  it('should not remove existing attributes', () => {
    const container = { body: { ship: 'Enterprise' } };
    mergeBody({ user: 'Jean Luc' })(container);
    expect(container).toEqual({
      body: { ship: 'Enterprise', user: 'Jean Luc' },
    });
  });
});
