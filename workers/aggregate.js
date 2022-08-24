/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { assign } = require('lodash');
const WorkflowError = require('../entities/WorkflowError');
const request = require('../services/request');
const urlBuilder = require('../services/urlBuilder');

const setBodyToContainer = (body, container, options) => {
  if (!options.path && typeof body !== 'object') {
    return;
  }
  if (options.path && !container.body[options.path]) {
    container.body[options.path] = body;
    return;
  }
  if (options.path) {
    assign(container.body[options.path], body);
    return;
  }
  assign(container.body, body);
};

module.exports = (method, url, options = {}) => {
  const buildedUrl = urlBuilder(url);
  const failStatusCodes = options.failStatusCodes || [400, 500];
  return async (container) => {
    try {
      const { body, statusCode } = await request(
        container,
        method,
        buildedUrl,
        options,
      );
      container.statusCode = statusCode;
      setBodyToContainer(body, container, options);
    } catch (err) {
      const body = err.response && err.response.body;
      const statusCode = err.response ? err.response.statusCode : 500;

      if (body && !failStatusCodes.includes(parseInt(`${`${statusCode}[0]`}00`, 10))) {
        setBodyToContainer(body, container, options);
        container.statusCode = statusCode;
        return;
      }

      const error = new WorkflowError(err, err.response);
      error.setContainer(container);
      if (body) {
        container.errorBody = body;
      }
      container.statusCode = statusCode;

      throw error;
    }
  };
};
