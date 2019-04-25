/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = (regex, pipeline) => (container, request, execute) => {
  if (request.route.path.match(regex)) {
    return execute(pipeline, container, request);
  }
  return container;
};
