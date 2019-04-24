/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { extractFromRequest } = require('./container');

const executeChunk = async (chunk, originalContainer, req) => {
  let container = originalContainer;
  for (let i = 0; i < chunk.length; i += 1) {
    if (Array.isArray(chunk[i])) {
      // eslint-disable-next-line no-await-in-loop
      container = await executeChunk(chunk[i], container, req);
    } else {
      // eslint-disable-next-line no-await-in-loop
      container = await chunk[i](container, req, executeChunk);
    }
  }
  return container;
};

const execute = (route, beforeEach = []) => async (req, res) => {
  let container = extractFromRequest(req);
  container = await executeChunk(beforeEach, container, req);
  container = await executeChunk(route.pipeline, container, req);
  res.status(container.statusCode).send(container.body);
};

module.exports = { execute };
