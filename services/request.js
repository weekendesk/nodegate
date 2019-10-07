/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const requestNative = require('request-promise-native');
const { getConfiguration } = require('./configuration');

const defaultOptions = () => getConfiguration().request;

const getHeaders = (container, options) => ({
  ...((defaultOptions() && defaultOptions().headers) || {}),
  ...((container && container.headers) || {}),
  ...((options && options.headers) || {}),
});

const doRequest = (container, method, url, options) => {
  const parameters = {
    ...defaultOptions(),
    ...options,
    headers: getHeaders(container, options),
    method,
    url: (typeof url === 'function' && url(container)) || url,
    body: (container && container.body) || {},
  };

  return requestNative(parameters);
};

const request = (container) => ({
  get: (url, options) => doRequest(container, 'get', url, options),
  post: (url, options) => doRequest(container, 'post', url, options),
  patch: (url, options) => doRequest(container, 'patch', url, options),
  put: (url, options) => doRequest(container, 'put', url, options),
  delete: (url, options) => doRequest(container, 'delete', url, options),
});

request.get = (url, options) => doRequest(null, 'get', url, options);
request.post = (url, options) => doRequest(null, 'post', url, options);
request.patch = (url, options) => doRequest(null, 'patch', url, options);
request.put = (url, options) => doRequest(null, 'put', url, options);
request.delete = (url, options) => doRequest(null, 'delete', url, options);

module.exports = request;
