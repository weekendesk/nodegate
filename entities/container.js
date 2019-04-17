/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const extractFromRequest = request => ({
  headers: {},
  body: request.body || {},
  params: request.params || {},
});

const getEmpty = () => ({
  headers: {},
  body: {},
  params: {},
});

module.exports = {
  extractFromRequest,
  getEmpty,
};
