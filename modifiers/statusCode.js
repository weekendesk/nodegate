/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { cloneDeep } = require('lodash');

module.exports = (statusCode) => (container) => ({
  ...cloneDeep(container),
  statusCode,
});
