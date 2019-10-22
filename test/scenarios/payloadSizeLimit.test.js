const request = require('supertest');
const nodegate = require('../../services/nodegate');
const { configure } = require('../../services/configuration');

describe('Payload size limitation', () => {
  it('should be possible to limit the size of the body', async () => {
    configure({ payloadSizeLimit: '10o' });
    const gate = nodegate();
    gate.route({
      method: 'post',
      path: '/',
      workflow: [],
    });
    await request(gate).post('/').send({
      title: 'This document is too heavy to be hamdled',
    }).expect(413);
  });
});
