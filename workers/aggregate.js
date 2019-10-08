/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { merge, set } = require('lodash');
const WorkflowError = require('../entities/WorkflowError');
const request = require('../services/request');
const urlBuilder = require('../services/urlBuilder');

module.exports = (method, url, path) => {
  const buildedUrl = urlBuilder(url);
  return async (container) => {
    try {
      const { body, statusCode } = await request(container)[method](buildedUrl);
      if (typeof body !== 'object' && !path) {
        return merge(cloneDeep(container), { statusCode });
      }
      if (path) {
        return merge(container, { statusCode, body: set({}, path, body) });
      }
      return merge(container, { statusCode, body });
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
