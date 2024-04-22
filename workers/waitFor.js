/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { getConfiguration } = require('../services/configuration');
const request = require('../services/request');
const urlBuilder = require('../services/urlBuilder');

const timeout = (duration) => new Promise((resolve) => {
  setTimeout(resolve, duration);
});

const tryRequest = async (container, method, url, test, configuration, tentatives = 0) => {
  const { statusCode, headers, body } = await request(container, method, url);
  if (!test({ statusCode, headers, body }, container)) {
    if (tentatives < configuration.tentatives) {
      await timeout(configuration.delay);
      return tryRequest(container, method, url, test, configuration, tentatives + 1);
    }
    throw new Error(`Wait for ${url(container)} failed`);
  }
  return Promise.resolve(container);
};

module.exports = (method, url, test) => {
  const buildedUrl = urlBuilder(url);
  const configuration = getConfiguration().workers.waitFor;
  return async (container) => tryRequest(container, method, buildedUrl, test, configuration);
};
