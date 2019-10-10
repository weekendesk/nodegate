/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { get, set } = require('lodash');

module.exports = (projections) => (container) => {
  projections.forEach((projection) => {
    set(container.body, projection[1], get(container.body, projection[0]));
  });
};
