/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { fromJS } = require('immutable');

module.exports = () => (container, request) => {
  const containerMap = fromJS(container);
  return containerMap.setIn(['headers', 'X-Forwarded-Host'], request.headers.host).toJS();
};
