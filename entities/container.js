/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const extractFromRequest = (request) => ({
  headers: {},
  body: request.body || {},
  errorBody: null,
  params: request.params || {},
  query: request.query || {},
  statusCode: 200,
});

const getEmpty = () => extractFromRequest({});

module.exports = {
  extractFromRequest,
  getEmpty,
};
