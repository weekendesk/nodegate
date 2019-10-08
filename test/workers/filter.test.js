const filter = require('../../workers/filter');

describe('workers/filter', () => {
  it('should correctly return a function', () => {
    expect(filter()).toBeInstanceOf(Function);
  });
  it('should filter the container', () => {
    const result = filter(['ships'])({
      body: {
        ships: ['enterprise'],
        captains: ['Jean-Luc Picard'],
      },
    });
    expect(result.body.ships).toBeTruthy();
    expect(result.body.captains).toBeFalsy();
  });
  it('should filter the container body only', () => {
    const result = filter(['ships'])({
      params: {
        organization: 'Federation',
      },
      body: {
        ships: ['enterprise'],
        captains: ['Jean-Luc Picard'],
      },
    });
    expect(result.params.organization).toBeTruthy();
    expect(result.body.captains).toBeFalsy();
  });
});
