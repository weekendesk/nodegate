const statuscode = require('../../modifiers/statuscode');

describe('modifiers/statuscode', () => {
  it('should correctly return a function', () => {
    expect(statuscode()).toBeInstanceOf(Function);
  });
  it('should set the X-Forwarded-Host header to the container', () => {
    const container = statuscode(418)({});
    expect(container.statusCode).toEqual(418);
  });
  it('should modify the body', () => {
    const container = statuscode(418)({ body: { name: 'Jean-Luc Picard' } });
    expect(container.body.name).toEqual('Jean-Luc Picard');
  });
});
