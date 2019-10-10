/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { extractFromRequest } = require('./container');
const WorkflowError = require('./WorkflowError');

const executeChunk = async (chunk, container, req) => {
  try {
    for (let i = 0; i < chunk.length; i += 1) {
      if (Array.isArray(chunk[i])) {
        // eslint-disable-next-line no-await-in-loop
        await executeChunk(chunk[i], container, req);
      } else {
        // eslint-disable-next-line no-await-in-loop
        await chunk[i](container, req, executeChunk);
      }
    }
  } catch (err) {
    let error = err;
    if (!(error instanceof WorkflowError)) {
      error = new WorkflowError(err.message);
      error.setContainer({ ...container, statusCode: 500 });
    }
    if (!error.container) {
      error.setContainer(container);
    }
    throw error;
  }
};

const execute = (route, beforeEach = []) => async (req, res) => {
  const container = extractFromRequest(req);
  try {
    await executeChunk(beforeEach, container, req);
    await executeChunk(route.workflow, container, req);
    res.status(container.statusCode).send(container.body);
  } catch (err) {
    if (route.onError) {
      route.onError(err);
    }
    res.status(err.container.statusCode).send(err.container.errorBody);
  }
};

module.exports = { execute };
