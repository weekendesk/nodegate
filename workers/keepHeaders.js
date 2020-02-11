/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = (headers) => {
  if (!Array.isArray(headers)) {
    throw new Error('The headers of must be an array of keys');
  }
  const lowerToOriginalCase = {};
  headers.forEach((header) => {
    lowerToOriginalCase[header.toLowerCase()] = header;
  });
  const lowerCaseHeaders = Object.keys(lowerToOriginalCase);
  return (container, request) => {
    Object.keys(request.headers).forEach((header) => {
      if (lowerCaseHeaders.includes(header.toLowerCase())) {
        const originalCase = lowerToOriginalCase[header.toLowerCase()];
        container.headers[originalCase] = request.headers[header];
      }
    });
  };
};
