const filter = require('../../workers/filter');

describe('workers/filter', () => {
  it('should correctly return a function', () => {
    expect(filter()).toBeInstanceOf(Function);
  });
  it('should filter the container', () => {
    const container = {
      body: {
        ships: ['enterprise'],
        captains: ['Jean-Luc Picard'],
      },
    };
    filter(['ships'])(container);
    expect(container.body.ships).toBeTruthy();
    expect(container.body.captains).toBeFalsy();
  });
  it('should filter the container body only', () => {
    const container = {
      params: {
        organization: 'Federation',
      },
      body: {
        ships: ['enterprise'],
        captains: ['Jean-Luc Picard'],
      },
    };
    filter(['ships'])(container);
    expect(container.params.organization).toBeTruthy();
    expect(container.body.captains).toBeFalsy();
  });
});
