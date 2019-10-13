/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { omit } = require('lodash');

module.exports = (paths) => (container) => {
  container.body = omit(container.body, paths);
};
