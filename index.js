/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { initLogger } = require('wed-nodejs-logger');
const workers = require('./workers');
const { configure } = require('./services/configuration');
const nodegate = require('./services/nodegate');

initLogger(process.env.LOG_LEVEL || 'WARN');

module.exports = nodegate;
module.exports.configure = configure;
module.exports.workers = workers;
