/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const deepmerge = require('deepmerge');

const defaultConfiguration = {
  express: {
    useCors: true,
    poweredBy: 'nodegate',
  },
  request: {
    json: true,
    resolveWithFullResponse: true,
  },
  workers: {
    waitFor: {
      delay: 300,
      tentatives: 10,
    },
  },
};

let configuration = defaultConfiguration;

const configure = (options) => {
  configuration = deepmerge(
    defaultConfiguration,
    options,
  );
};

const getConfiguration = () => configuration;

module.exports = {
  configure,
  getConfiguration,
};
