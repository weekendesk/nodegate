/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const nock = require('nock');
const request = require('supertest');
const nodegate = require('../');

describe('index', () => {
  it('should export the workers', () => {
    expect(nodegate.workers).toBeTruthy();
    expect(nodegate.configure).toBeInstanceOf(Object);
  });
  it('should export the configure function', () => {
    expect(nodegate.configure).toBeTruthy();
    expect(nodegate.configure).toBeInstanceOf(Function);
  });
  it('should work with a basic use case', async () => {
    const gate = nodegate();
    gate.route({
      method: 'get',
      path: '/captain/:id',
      workflow: [
        nodegate.workers.aggregate('get', 'https://wiki.enterprise.com/captain/{params.id}'),
      ],
    });
    nock('https://wiki.enterprise.com')
      .get('/captain/1')
      .reply(200, {
        name: 'Jean-Luc Picard',
      });
    await request(gate)
      .get('/captain/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.name).toEqual('Jean-Luc Picard');
      });
  });
  it('should work with CORS', async () => {
    const gate = nodegate();
    gate.route({
      method: 'get',
      path: '/',
      workflow: [
      ],
    });
    await request(gate)
      .options('/')
      .expect(204)
      .expect('access-control-allow-origin', '*');
  });
  it('should be possible to deactivate the CORS', async () => {
    nodegate.configure({
      express: {
        useCors: false,
      },
    });
    const gate = nodegate();
    gate.route({
      method: 'get',
      path: '/',
      workflow: [
      ],
    });
    await request(gate)
      .options('/')
      .expect(200)
      .then(({ headers }) => {
        expect(headers['access-control-allow-origin']).toBeFalsy();
      });
    nodegate.configure({});
  });
  it('should be possible to add a default header for each request', async () => {
    nodegate.configure({
      request: {
        headers: {
          'x-ship-origin': 'enterprise',
        },
      },
    });
    const gate = nodegate();
    gate.route({
      method: 'get',
      path: '/captain/:id',
      workflow: [
        nodegate.workers.aggregate('get', 'https://wiki.enterprise.com/captain/{params.id}'),
      ],
    });
    nock('https://wiki.enterprise.com', {
      reqheaders: {
        'x-ship-origin': 'enterprise',
      },
    })
      .get('/captain/1')
      .reply(200, {
        name: 'Jean-Luc Picard',
      });
    await request(gate)
      .get('/captain/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.name).toEqual('Jean-Luc Picard');
      });
    nodegate.configure({});
  });
});
