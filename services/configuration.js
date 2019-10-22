/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const deepmerge = require('deepmerge');

const defaultConfiguration = {
  useCors: true,
  poweredBy: 'nodegate',
  workers: {
    waitFor: {
      delay: 300,
      tentatives: 10,
    },
  },
  request: {
    json: true,
    resolveWithFullResponse: true,
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
