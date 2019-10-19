const project = require('../../workers/project');

describe('workers/project', () => {
  it('should correctly return a function', () => {
    expect(project()).toBeInstanceOf(Function);
  });
  describe('argument validation', () => {
    it('should throw an error if the argument is a number', () => {
      const container = {};
      expect(() => project(1)(container)).toThrow();
    });
    it('should throw an error if the argument is a string', () => {
      const container = {};
      expect(() => project('value')(container)).toThrow();
    });
    it('should throw an error if the argument is an array', () => {
      const container = {};
      expect(() => project(1)(container)).toThrow();
    });
  });
  it('should project to simple values', () => {
    const container = {
      body: {
        ship: 'Enterprise',
        captain: 'Jean-Luc Picard',
      },
    };
    project({
      nextship: 'body.ship',
      nextcaptain: 'body.captain',
    })(container);
    expect(container.body.nextship).toEqual('Enterprise');
    expect(container.body.nextcaptain).toEqual('Jean-Luc Picard');
  });
  it('should project to deep values', () => {
    const container = {
      body: {
        ship: 'Enterprise',
        captain: 'Jean-Luc Picard',
      },
    };
    project({
      nextShip: {
        name: 'body.ship',
      },
      nextCaptain: 'body.captain',
    })(container);
    expect(container.body.nextShip.name).toEqual('Enterprise');
    expect(container.body.nextCaptain).toEqual('Jean-Luc Picard');
  });
  it('should remove other values', () => {
    const container = {
      body: {
        ship: 'Enterprise',
        captain: 'Jean-Luc Picard',
        quadran: 'Alpha',
      },
    };
    project({
      ship: 'body.ship',
      captain: 'body.captain',
    })(container);
    expect(container.body.quadran).toBeFalsy();
  });
});
