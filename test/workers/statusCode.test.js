const statusCode = require('../../workers/statusCode');

describe('workers/statusCode', () => {
  it('should correctly return a function', () => {
    expect(statusCode()).toBeInstanceOf(Function);
  });
  it('should set the X-Forwarded-Host header to the container', () => {
    const container = statusCode(418)({});
    expect(container.statusCode).toEqual(418);
  });
  it('should modify the body', () => {
    const container = statusCode(418)({ body: { name: 'Jean-Luc Picard' } });
    expect(container.body.name).toEqual('Jean-Luc Picard');
  });
});
