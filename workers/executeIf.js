/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = (condition, workflow) => async (container, request, executeChunk) => {
  if (condition(container, request)) await executeChunk(workflow, container, request);
};
