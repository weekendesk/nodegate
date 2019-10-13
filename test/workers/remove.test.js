const remove = require('../../workers/remove');

describe('workers/remove', () => {
  it('should correctly return a function', () => {
    expect(remove()).toBeInstanceOf(Function);
  });
  it('should remove from the container', () => {
    const container = {
      body: {
        ships: ['enterprise'],
        captains: ['Jean-Luc Picard'],
      },
    };
    remove(['ships'])(container);
    expect(container.body.ships).toBeFalsy();
    expect(container.body.captains).toBeTruthy();
  });
  it('should remove from the container with the path as a string', () => {
    const container = {
      body: {
        ships: ['enterprise'],
        captains: ['Jean-Luc Picard'],
      },
    };
    remove('ships')(container);
    expect(container.body.ships).toBeFalsy();
    expect(container.body.captains).toBeTruthy();
  });
  it('should remove from the container body only', () => {
    const container = {
      params: {
        organization: 'Federation',
      },
      body: {
        ships: ['enterprise'],
        captains: ['Jean-Luc Picard'],
      },
    };
    remove(['ships'])(container);
    expect(container.params.organization).toBeTruthy();
    expect(container.body.captains).toBeTruthy();
  });
  it('should remove nested values from the container', () => {
    const container = {
      body: {
        ships: ['enterprise', 'NC-1701'],
        captains: ['Jean-Luc Picard'],
      },
    };
    remove(['ships[1]'])(container);
    expect(container.body.ships).toBeTruthy();
    expect(container.body.ships[1]).toBeUndefined();
  });
});
