/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

class WorkflowError extends Error {
  constructor(message, response = null) {
    super(message);
    this.response = response;
    this.container = null;
    Error.captureStackTrace(this, this.constructor);
  }

  setContainer(container) {
    this.container = { ...container };
    if (this.response && this.response.statusCode) {
      this.container.statusCode = this.response.statusCode;
    }
  }
}

module.exports = WorkflowError;
