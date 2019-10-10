const forwardedHost = require('../../workers/forwardedHost');

describe('workers/forwardedHost', () => {
  it('should correctly return a function', () => {
    expect(forwardedHost()).toBeInstanceOf(Function);
  });
  it('should set the X-Forwarded-Host header to the container', () => {
    const container = forwardedHost()(
      { headers: {} },
      { headers: { host: 'https://wiki.federation.com' } },
    );
    expect(container.headers['X-Forwarded-Host']).toEqual('https://wiki.federation.com');
  });
  it('should not set the host header', () => {
    const container = forwardedHost()(
      { headers: {} },
      { headers: { host: 'https://wiki.federation.com' } },
    );
    expect(container.headers.host).toBeFalsy();
  });
  it('should not reset container headers', () => {
    const container = forwardedHost()(
      { headers: { authentication: 'Picard, authorization Alpha-Alpha-3-0-5' } },
      { headers: { host: 'https://wiki.federation.com' } },
    );
    expect(container.headers['X-Forwarded-Host']).toEqual('https://wiki.federation.com');
    expect(container.headers.authentication).toEqual('Picard, authorization Alpha-Alpha-3-0-5');
  });
});
