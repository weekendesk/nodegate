const nock = require('nock');
const request = require('../../services/request');
const urlBuilder = require('../../services/urlBuilder');
const { getEmpty, extractFromRequest } = require('../../entities/container');

describe('services/request', () => {
  describe('#get()', () => {
    it('should do a simple request', async () => {
      nock('https://wiki.federation.com')
        .get('/ships/enterprise')
        .reply(200, [
          'NCC-1701',
          'NCC-1717',
        ]);
      const result = await request.get('https://wiki.federation.com/ships/enterprise');
      expect(result.statusCode).toBe(200);
    });
    it('should be possible to specify headers', async () => {
      nock('https://wiki.federation.com', {
        reqheaders: {
          'x-ship-origin': 'enterprise',
        },
      })
        .get('/ships/enterprise')
        .reply(200, [
          'NCC-1701',
          'NCC-1717',
        ]);
      const result = await request.get(
        'https://wiki.federation.com/ships/enterprise',
        { headers: { 'x-ship-origin': 'enterprise' } },
      );
      expect(result.statusCode).toBe(200);
    });
  });
  describe('#post()', () => {
    it('should do a simple request', async () => {
      nock('https://wiki.federation.com')
        .post('/ships')
        .reply(201);
      const result = await request.post('https://wiki.federation.com/ships');
      expect(result.statusCode).toBe(201);
    });
  });
  describe('#put()', () => {
    it('should do a simple request', async () => {
      nock('https://wiki.federation.com')
        .put('/ships/1')
        .reply(200);
      const result = await request.put('https://wiki.federation.com/ships/1');
      expect(result.statusCode).toBe(200);
    });
  });
  describe('#patch()', () => {
    it('should do a simple request', async () => {
      nock('https://wiki.federation.com')
        .patch('/ships/1')
        .reply(200);
      const result = await request.patch('https://wiki.federation.com/ships/1');
      expect(result.statusCode).toBe(200);
    });
  });
  describe('#delete()', () => {
    it('should do a simple request', async () => {
      nock('https://wiki.federation.com')
        .delete('/ships/1')
        .reply(200);
      const result = await request.delete('https://wiki.federation.com/ships/1');
      expect(result.statusCode).toBe(200);
    });
  });
  describe('#(container).get()', () => {
    it('should do a simple request', async () => {
      const container = getEmpty();
      nock('https://wiki.federation.com')
        .get('/ships/enterprise')
        .reply(200, [
          'NCC-1701',
          'NCC-1717',
        ]);
      const result = await request(container).get('https://wiki.federation.com/ships/enterprise');
      expect(result.statusCode).toBe(200);
    });
    it('should use the headers of the container', async () => {
      const container = extractFromRequest({
        headers: {
          origin: 'https://enterprise.com',
        },
      });
      nock('https://wiki.federation.com', {
        reqheaders: {
          origin: 'https://enterprise.com',
        },
      })
        .get('/ships/enterprise')
        .reply(200, [
          'NCC-1701',
          'NCC-1717',
        ]);
      const result = await request(container).get('https://wiki.federation.com/ships/enterprise');
      expect(result.statusCode).toBe(200);
    });
    it('should use the body for the URL', async () => {
      const container = extractFromRequest({
        body: {
          ship: 'NCC-1701',
        },
      });
      nock('https://wiki.federation.com')
        .get('/ships/NCC-1701')
        .reply(200, 'Enterprise');
      const result = await request(container).get(urlBuilder('https://wiki.federation.com/ships/{body.ship}'));
      expect(result.statusCode).toBe(200);
    });
    it('should use the container body', async () => {
      const container = extractFromRequest({
        body: {
          ship: 'NCC-1701',
        },
      });
      nock('https://wiki.federation.com')
        .get('/ships', { ship: 'NCC-1701' })
        .reply(200);
      const result = await request(container).get('https://wiki.federation.com/ships');
      expect(result.statusCode).toBe(200);
    });
  });
  describe('#(container).post()', () => {
    it('should do a simple request', async () => {
      const container = getEmpty();
      nock('https://wiki.federation.com')
        .post('/ships')
        .reply(200);
      const result = await request(container).post('https://wiki.federation.com/ships');
      expect(result.statusCode).toBe(200);
    });
    it('should use the headers of the container', async () => {
      const container = extractFromRequest({
        headers: {
          origin: 'https://enterprise.com',
        },
      });
      nock('https://wiki.federation.com', {
        reqheaders: {
          origin: 'https://enterprise.com',
        },
      })
        .post('/ships')
        .reply(200);
      const result = await request(container).post('https://wiki.federation.com/ships');
      expect(result.statusCode).toBe(200);
    });
    it('should use the body for the URL', async () => {
      const container = extractFromRequest({
        body: {
          ship: 'NCC-1701',
        },
      });
      nock('https://wiki.federation.com')
        .post('/ships/NCC-1701')
        .reply(200, 'Enterprise');
      const result = await request(container).post(urlBuilder('https://wiki.federation.com/ships/{body.ship}'));
      expect(result.statusCode).toBe(200);
    });
    it('should use the container body', async () => {
      const container = extractFromRequest({
        body: {
          ship: 'NCC-1701',
        },
      });
      nock('https://wiki.federation.com')
        .post('/ships', { ship: 'NCC-1701' })
        .reply(200);
      const result = await request(container).post('https://wiki.federation.com/ships');
      expect(result.statusCode).toBe(200);
    });
  });
  describe('#(container).patch()', () => {
    it('should do a simple request', async () => {
      const container = getEmpty();
      nock('https://wiki.federation.com')
        .patch('/ships')
        .reply(200);
      const result = await request(container).patch('https://wiki.federation.com/ships');
      expect(result.statusCode).toBe(200);
    });
    it('should use the container body', async () => {
      const container = extractFromRequest({
        body: {
          ship: 'NCC-1701',
        },
      });
      nock('https://wiki.federation.com')
        .patch('/ships', { ship: 'NCC-1701' })
        .reply(200);
      const result = await request(container).patch('https://wiki.federation.com/ships');
      expect(result.statusCode).toBe(200);
    });
  });
  describe('#(container).put()', () => {
    it('should do a simple request', async () => {
      const container = getEmpty();
      nock('https://wiki.federation.com')
        .put('/ships')
        .reply(200);
      const result = await request(container).put('https://wiki.federation.com/ships');
      expect(result.statusCode).toBe(200);
    });
    it('should use the container body', async () => {
      const container = extractFromRequest({
        body: {
          ship: 'NCC-1701',
        },
      });
      nock('https://wiki.federation.com')
        .put('/ships', { ship: 'NCC-1701' })
        .reply(200);
      const result = await request(container).put('https://wiki.federation.com/ships');
      expect(result.statusCode).toBe(200);
    });
  });
  describe('#(container).delete()', () => {
    it('should do a simple request', async () => {
      const container = getEmpty();
      nock('https://wiki.federation.com')
        .delete('/ships')
        .reply(200);
      const result = await request(container).delete('https://wiki.federation.com/ships');
      expect(result.statusCode).toBe(200);
    });
    it('should use the container body', async () => {
      const container = extractFromRequest({
        body: {
          ship: 'NCC-1701',
        },
      });
      nock('https://wiki.federation.com')
        .delete('/ships', { ship: 'NCC-1701' })
        .reply(200);
      const result = await request(container).delete('https://wiki.federation.com/ships');
      expect(result.statusCode).toBe(200);
    });
  });
});
