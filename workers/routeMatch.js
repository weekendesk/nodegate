/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = (regex, workflow) => (container, request, execute) => {
  if (request.route.path.match(regex)) {
    return execute(workflow, container, request);
  }
  return container;
};
