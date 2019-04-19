const modifiers = require('../../modifiers');

describe('modifiers/index', () => {
  it('should correctly expose all the modifiers', () => {
    expect(modifiers.aggregate).toBeInstanceOf(Function);
    expect(modifiers.waitfor).toBeInstanceOf(Function);
  });
});
