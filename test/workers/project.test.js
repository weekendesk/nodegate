const project = require('../../workers/project');

describe('workers/project', () => {
  it('should correctly return a function', () => {
    expect(project()).toBeInstanceOf(Function);
  });
  it('should project simple values', () => {
    const container = {
      body: {
        ship: 'Enterprise',
        captain: 'Jean-Luc Picard',
      },
    };
    project([
      ['ship', 'nextship'],
      ['captain', 'nextcaptain'],
    ])(container);
    expect(container.body.nextship).toEqual('Enterprise');
    expect(container.body.nextcaptain).toEqual('Jean-Luc Picard');
  });
  it('should project values into arrays', () => {
    const container = {
      body: {
        ship: 'Enterprise',
        captain: 'Jean-Luc Picard',
      },
    };
    project([
      ['ship', 'ships[0]'],
      ['captain', 'captains[0]'],
    ])(container);
    expect(container.body.ships[0]).toEqual('Enterprise');
    expect(container.body.captains[0]).toEqual('Jean-Luc Picard');
  });
  it('should allow to rename values', () => {
    const container = {
      body: {
        ship: 'Enterprise',
        captain: 'Jean-Luc Picard',
      },
    };
    project([
      ['ship', 'shipName'],
      ['captain', 'captainName'],
    ])(container);
    expect(container.body.shipName).toEqual('Enterprise');
    expect(container.body.captainName).toEqual('Jean-Luc Picard');
  });
  it('should ignore non wanted values', () => {
    const container = {
      body: {
        ship: 'Enterprise',
        captain: 'Jean-Luc Picard',
        quadran: 'Alpha',
      },
    };
    project([
      ['ship', 'shipName'],
      ['captain', 'captainName'],
    ])(container);
    expect(container.body.quadran).toBeUndefined();
  });
});
