const { configure, getConfiguration } = require('../../services/configuration');

describe('services/configuration', () => {
  it('should set the default configuration', () => {
    const configuration = getConfiguration();
    expect(configuration.express.useCors).toBe(true);
  });
  it('should modify the default configuration', () => {
    configure({ express: { useCors: false } });
    const configuration = getConfiguration();
    expect(configuration.express.useCors).toBe(false);
  });
  it('should be possible to reset the configuration', () => {
    configure({ express: { useCors: false } });
    configure({});
    const configuration = getConfiguration();
    expect(configuration.express.useCors).toBe(true);
  });
  it('should be a deep merge', () => {
    configure({ express: { otherOption: false } });
    const configuration = getConfiguration();
    expect(configuration.express.useCors).toBe(true);
  });
});
