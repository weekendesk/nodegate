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

function isJsonContentType(contentType) {
  return typeof contentType === 'string'
    && (contentType.includes('application/json') || contentType.includes('+json'));
}

module.exports = (method, url, options = {}) => {
  const buildedUrl = urlBuilder(url);
  const failStatusCodes = options.failStatusCodes || [400, 500];
  return async (container) => {
    try {
      const response = await request(
        container,
        method,
        buildedUrl,
        options,
      );
      container.statusCode = response.status;
      if (response.headers.get('content-type') && !isJsonContentType(response.headers.get('content-type'))) {
        const text = await response.text();
        setBodyToContainer(
          container.headers['content-type'] === 'application/json' ? JSON.parse(text) : text,
          container,
          options,
        );
        if (!response.ok) {
          throw new WorkflowError('Fetch error', { text, statusCode: response.status });
        }
        return;
      }
      let body;
      if (response.headers.get('content-type')) {
        body = await response.json();
        setBodyToContainer(body, container, options);
      }
      if (!response.ok) {
        throw new WorkflowError('Fetch error', { body, statusCode: response.status });
      }
    } catch (err) {
      const body = err.response && err.response.body;
      const statusCode = err.response ? err.response.statusCode : 500;

      const isValidStatus = !failStatusCodes.includes(Math.floor(statusCode / 100) * 100)
        && !failStatusCodes.includes(statusCode);

      if (body && isValidStatus) {
        setBodyToContainer(body, container, options);
        container.statusCode = statusCode;
        return;
      }

      const error = new WorkflowError(err, err.response);
      error.setContainer(container);
      const {
        errorOptions:
        {
          includeMetaInfo = true,
          messages = {},
        } = {},
        ...restOptions
      } = options;
      const errorMessage = messages[statusCode];
      container.errorBody = {
        ...includeMetaInfo && {
          metaInfo: {
            url,
            ...restOptions,
          },
        },
        ...body,
        ...errorMessage && { message: errorMessage },
      };
      container.statusCode = statusCode;
      throw error;
    }
  };
};
