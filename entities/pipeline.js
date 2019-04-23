/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { extractFromRequest } = require('./container');

const execute = (pipeline, beforeEach = []) => async (req, res) => {
  let container = extractFromRequest(req);
  for (let i = 0; i < beforeEach.length; i += 1) {
    container = await beforeEach[i](container, req); // eslint-disable-line no-await-in-loop
  }
  for (let i = 0; i < pipeline.length; i += 1) {
    container = await pipeline[i](container, req); // eslint-disable-line no-await-in-loop
  }
  res.send(container.body);
};

module.exports = { execute };
