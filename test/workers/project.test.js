const project = require('../../workers/project');

describe('workers/project', () => {
  it('should correctly return a function', () => {
    expect(project()).toBeInstanceOf(Function);
  });
  it('should project simple values', () => {
    const result = project([
      ['ship', 'ship'],
      ['captain', 'captain'],
    ])({
      body: {
        ship: 'Enterprise',
        captain: 'Jean-Luc Picard',
      },
    });
    expect(result.body.ship).toEqual('Enterprise');
    expect(result.body.captain).toEqual('Jean-Luc Picard');
  });
  it('should project values into arrays', () => {
    const result = project([
      ['ship', 'ships[0]'],
      ['captain', 'captains[0]'],
    ])({
      body: {
        ship: 'Enterprise',
        captain: 'Jean-Luc Picard',
      },
    });
    expect(result.body.ships[0]).toEqual('Enterprise');
    expect(result.body.captains[0]).toEqual('Jean-Luc Picard');
  });
  it('should allow to rename values', () => {
    const result = project([
      ['ship', 'shipName'],
      ['captain', 'captainName'],
    ])({
      body: {
        ship: 'Enterprise',
        captain: 'Jean-Luc Picard',
      },
    });
    expect(result.body.shipName).toEqual('Enterprise');
    expect(result.body.captainName).toEqual('Jean-Luc Picard');
  });
  it('should ignore non wanted values', () => {
    const result = project([
      ['ship', 'shipName'],
      ['captain', 'captainName'],
    ])({
      body: {
        ship: 'Enterprise',
        captain: 'Jean-Luc Picard',
        quadran: 'Alpha',
      },
    });
    expect(result.body.quadran).toBeUndefined();
  });
});
