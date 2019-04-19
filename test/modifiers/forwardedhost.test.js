const forwardedhost = require('../../modifiers/forwardedhost');

describe('modifiers/forwardedhost', () => {
  it('should correctly return a function', () => {
    expect(forwardedhost()).toBeInstanceOf(Function);
  });
  it('should set the X-Forwarded-Host header to the container', () => {
    const container = forwardedhost()(
      { headers: {} },
      { headers: { host: 'https://wiki.federation.com' } },
    );
    expect(container.headers['X-Forwarded-Host']).toEqual('https://wiki.federation.com');
  });
  it('should not set the host header', () => {
    const container = forwardedhost()(
      { headers: {} },
      { headers: { host: 'https://wiki.federation.com' } },
    );
    expect(container.headers.host).toBeFalsy();
  });
  it('should not reset container headers', () => {
    const container = forwardedhost()(
      { headers: { authentication: 'Picard, authorization Alpha-Alpha-3-0-5' } },
      { headers: { host: 'https://wiki.federation.com' } },
    );
    expect(container.headers['X-Forwarded-Host']).toEqual('https://wiki.federation.com');
    expect(container.headers.authentication).toEqual('Picard, authorization Alpha-Alpha-3-0-5');
  });
});
