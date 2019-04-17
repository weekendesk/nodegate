const { getEmpty, extractFromRequest } = require('../../entities/container');

describe('entities/container', () => {
  describe('#empty()', () => {
    it('should return an empty container', () => {
      const container = getEmpty();
      expect(container.headers).toBeTruthy();
      expect(container.body).toBeTruthy();
      expect(container.params).toBeTruthy();
    });
  });
  describe('#extractFromRequest()', () => {
    it('should correctly set the headers, body and params', () => {
      const container = extractFromRequest({
        body: { captain: 'Jean-Luc Picard' },
        params: { pips: 4 },
      });
      expect(container.body.captain).toBe('Jean-Luc Picard');
      expect(container.params.pips).toBe(4);
    });
    it('should not set the headers of the request', () => {
      const container = extractFromRequest({
        headers: { 'X-ship': 'NCC-1701-E' },
      });
      expect(container.headers['X-ship']).toBeUndefined();
    });
    it('should ignore not wanted properties', () => {
      const container = extractFromRequest({
        params: { pips: 4 },
        method: 'POST',
      });
      expect(container.method).toBeFalsy();
    });
    it('should set the headers property', () => {
      const container = extractFromRequest({});
      expect(container.headers).toEqual({});
    });
    it('should set the body property', () => {
      const container = extractFromRequest({});
      expect(container.body).toEqual({});
    });
    it('should set the params property', () => {
      const container = extractFromRequest({});
      expect(container.params).toEqual({});
    });
  });
});
