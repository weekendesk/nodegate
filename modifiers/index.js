/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const aggregate = require('./aggregate');
const filter = require('./filter');
const forwardedHost = require('./forwardedHost');
const mergeBody = require('./mergeBody');
const project = require('./project');
const mergeHeaders = require('./mergeHeaders');
const routeMatch = require('./routeMatch');
const statusCode = require('./statusCode');
const waitFor = require('./waitFor');

module.exports = {
  aggregate,
  filter,
  forwardedHost,
  mergeBody,
  project,
  mergeHeaders,
  routeMatch,
  statusCode,
  waitFor,
};
