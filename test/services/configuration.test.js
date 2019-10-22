const { configure, getConfiguration } = require('../../services/configuration');

describe('services/configuration', () => {
  it('should set the default configuration', () => {
    const configuration = getConfiguration();
    expect(configuration.useCors).toBe(true);
  });
  it('should modify the default configuration', () => {
    configure({ useCors: false });
    const configuration = getConfiguration();
    expect(configuration.useCors).toBe(false);
  });
  it('should be possible to reset the configuration', () => {
    configure({ useCors: false });
    configure({});
    const configuration = getConfiguration();
    expect(configuration.useCors).toBe(true);
  });
  it('should be a deep merge', () => {
    configure({ otherOption: false });
    const configuration = getConfiguration();
    expect(configuration.useCors).toBe(true);
  });
});
