/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { cloneDeep, get, set } = require('lodash');

module.exports = (projections) => (container) => {
  const body = {};
  projections.forEach((projection) => {
    set(body, projection[1], get(container.body, projection[0]));
  });
  return {
    ...cloneDeep(container),
    body,
  };
};
