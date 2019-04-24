const modifiers = require('../../modifiers');

describe('modifiers/index', () => {
  it('should correctly expose all the modifiers', () => {
    expect(modifiers.aggregate).toBeInstanceOf(Function);
    expect(modifiers.filter).toBeInstanceOf(Function);
    expect(modifiers.forwardedhost).toBeInstanceOf(Function);
    expect(modifiers.routematch).toBeInstanceOf(Function);
    expect(modifiers.statuscode).toBeInstanceOf(Function);
    expect(modifiers.waitfor).toBeInstanceOf(Function);
  });
});
