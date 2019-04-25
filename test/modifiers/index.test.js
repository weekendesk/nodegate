const modifiers = require('../../modifiers');

describe('modifiers/index', () => {
  it('should correctly expose all the modifiers', () => {
    expect(modifiers.aggregate).toBeInstanceOf(Function);
    expect(modifiers.filter).toBeInstanceOf(Function);
    expect(modifiers.forwardedHost).toBeInstanceOf(Function);
    expect(modifiers.routeMatch).toBeInstanceOf(Function);
    expect(modifiers.statusCode).toBeInstanceOf(Function);
    expect(modifiers.waitFor).toBeInstanceOf(Function);
  });
});
