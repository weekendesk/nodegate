/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { merge } = require('lodash');
const WorkflowError = require('../entities/WorkflowError');
const request = require('../services/request');
const urlBuilder = require('../services/urlBuilder');

module.exports = (method, url, path) => {
  const buildedUrl = urlBuilder(url);
  return async (container) => {
    try {
      const { body, statusCode } = await request(container)[method](buildedUrl);
      container.statusCode = statusCode;
      if (!path && typeof body !== 'object') {
        return;
      }
      if (path && !container.body[path]) {
        container.body[path] = body;
        return;
      }
      if (path) {
        merge(container.body[path], body);
        return;
      }
      merge(container.body, body);
    } catch (err) {
      const error = new WorkflowError(err, err.response);
      error.setContainer({
        ...container,
        ...(
          err.response && err.response.body
            ? { errorBody: err.response.body }
            : null
        ),
      });
      throw error;
    }
  };
};
