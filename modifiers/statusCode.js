/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { fromJS } = require('immutable');

module.exports = value => (container) => {
  const containerMap = fromJS(container);
  return containerMap.set('statusCode', value).toJS();
};
