const statusCode = require('../../workers/statusCode');

describe('workers/statusCode', () => {
  it('should correctly return a function', () => {
    expect(statusCode()).toBeInstanceOf(Function);
  });
  it('should set the status code to the container', () => {
    const container = {};
    statusCode(418)(container);
    expect(container.statusCode).toEqual(418);
  });
  it('should not modify the body', () => {
    const container = { body: { name: 'Jean-Luc Picard' } };
    statusCode(418)(container);
    expect(container.body.name).toEqual('Jean-Luc Picard');
  });
});
