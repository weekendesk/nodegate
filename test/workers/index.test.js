const workers = require('../../workers');

describe('workers/index', () => {
  it('should correctly expose all the workers', () => {
    expect(workers.aggregate).toBeInstanceOf(Function);
    expect(workers.filter).toBeInstanceOf(Function);
    expect(workers.forwardedHost).toBeInstanceOf(Function);
    expect(workers.routeMatch).toBeInstanceOf(Function);
    expect(workers.statusCode).toBeInstanceOf(Function);
    expect(workers.waitFor).toBeInstanceOf(Function);
  });
});
