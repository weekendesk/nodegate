/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { merge } = require('lodash');

module.exports = (headers) => (container) => {
  merge(container.headers, headers);
};
