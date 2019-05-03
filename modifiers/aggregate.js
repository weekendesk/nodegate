/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { cloneDeep, merge, set } = require('lodash');
const PipelineError = require('../entities/PipelineError');
const request = require('../services/request');
const urlBuilder = require('../services/urlBuilder');

module.exports = (method, url, path) => {
  const buildedUrl = urlBuilder(url);
  return async (container) => {
    try {
      const { body, statusCode } = await request(container)[method](buildedUrl);
      if (path) {
        return merge(cloneDeep(container), { statusCode, body: set({}, path, body) });
      }
      return merge(cloneDeep(container), { statusCode, body });
    } catch (err) {
      const error = new PipelineError(err, err.response);
      error.setContainer({
        ...container,
        errorBody: err.response.body,
      });
      throw error;
    }
  };
};
