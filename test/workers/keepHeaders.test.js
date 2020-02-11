const keepHeaders = require('../../workers/keepHeaders');

describe('workers/keepHeaders', () => {
  it('should correctly return a function', () => {
    expect(keepHeaders([])).toBeInstanceOf(Function);
  });
  it('should correctly add the headers on the container', () => {
    const container = { headers: { } };
    const worker = keepHeaders(['Authorization']);
    worker(container, { headers: { Authorization: 'Bearer 1234567890' } });
    expect(container.headers.Authorization).toEqual('Bearer 1234567890');
  });
  it('should not throw an error if the header does not exists', () => {
    const container = { headers: { } };
    const worker = keepHeaders(['Not-Existing']);
    expect(() => worker(container, { headers: { 'Not-Used': 'Value' } })).not.toThrow();
  });
  it('should not set an undefined value', () => {
    const container = { headers: { } };
    keepHeaders(['Authorization'])(container, { headers: { } });
    expect(container.headers).toEqual({ });
  });
  it('should override existing headers', () => {
    const container = { headers: { Authorization: 'login:password' } };
    keepHeaders(['Authorization'])(container, { headers: { Authorization: 'Bearer 1234567890' } });
    expect(container.headers).toEqual({ Authorization: 'Bearer 1234567890' });
  });
  it('should throw an error if the "header" parameters is not an array', () => {
    expect(() => keepHeaders('Authorization')).toThrow();
  });
  it('should be case insensitive', () => {
    const container = { headers: { } };
    const request = {
      headers: {
        Authorization: 'Bearer 1234567890',
        user: 'Shudrum',
        'X-Something': 'Value',
      },
    };
    keepHeaders(['authorization', 'User', 'X-something'])(container, request);
    expect(container.headers).toEqual({
      authorization: 'Bearer 1234567890',
      User: 'Shudrum',
      'X-something': 'Value',
    });
  });
  it('should not remove existing values', () => {
    const container = { headers: { Existing: 'Value' } };
    const worker = keepHeaders(['Authorization']);
    worker(container, { headers: { Authorization: 'Bearer 1234567890' } });
    expect(container.headers.Authorization).toEqual('Bearer 1234567890');
    expect(container.headers.Existing).toEqual('Value');
  });
});
