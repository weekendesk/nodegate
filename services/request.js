/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { get, merge } = require('lodash');
const { getConfiguration } = require('./configuration');

const project = (container, value) => {
  if (typeof value === 'object' && !Array.isArray(value)) {
    Object.keys(value).forEach((key) => {
      value[key] = project(container, value[key]);
    });
    return value;
  }
  if (typeof value === 'string') {
    return get(container, value);
  }
  throw new TypeError('Invalid projection, must be an object or a string');
};

const validateArguments = (container, method, url, options) => {
  if (typeof container !== 'object' || Array.isArray(container)) {
    throw new TypeError('Invalid argument: "container", must be an object');
  }
  if (typeof method !== 'string') {
    throw new TypeError('Invalid argument: "method", must be a string');
  }
  if (typeof url !== 'string' && typeof url !== 'function') {
    throw new TypeError('Invalid argument: "url", must be an string or a function');
  }
  if (typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Invalid argument: "options", must be an object');
  }
};

const projectKey = (key, requestOptions, container, options) => {
  if (options[key] === null) {
    requestOptions[key] = null;
  } else if (!options[key]) {
    requestOptions[key] = container[key] || null;
  } else {
    requestOptions[key] = project(container, { ...options[key] });
  }
};

const mergeConfiguration = (requestOptions, configuration) => {
  if (!configuration.headers) {
    return;
  }

  if (typeof requestOptions.headers === 'object' && requestOptions.headers !== null) {
    merge(requestOptions.headers, configuration.headers);
  } else {
    requestOptions.headers = configuration.headers;
  }
};

const request = (container, method, url, options = {}) => {
  validateArguments(container, method, url, options);

  const { request: requestConfiguration, ...configuration } = getConfiguration();
  const requestOptions = {
    ...requestConfiguration,
    ...configuration,
    ...options,
    method,
  };
  const uri = typeof url === 'function' ? url(container) : url;

  projectKey('headers', requestOptions, container, options);
  if (['get', 'head'].includes(method)) {
    requestOptions.body = null;
  } else {
    projectKey('body', requestOptions, container, options);
  }

  mergeConfiguration(requestOptions, configuration);
  if (requestOptions.body) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }
  return fetch(uri, requestOptions);
};

module.exports = request;
