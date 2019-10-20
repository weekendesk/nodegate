/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { get, merge } = require('lodash');

const project = (container, value) => {
  if (typeof value === 'object') {
    Object.keys(value).forEach((key) => {
      value[key] = project(container, value[key]);
    });
    return value;
  }
  if (typeof value === 'string') {
    return get(container, value);
  }
  throw new TypeError('Bad projection configuration');
};

module.exports = (projections) => (container) => {
  if (typeof projections !== 'object') {
    throw new TypeError('Bad projection configuration');
  }
  const projectedValues = project(container, projections);
  Object.keys(container.body).forEach((key) => {
    delete container.body[key];
  });
  merge(container.body, projectedValues);
};
