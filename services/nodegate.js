/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const { executor } = require('../entities/pipeline');
const { getConfiguration } = require('../services/configuration');

const buildExpressApp = () => {
  const app = express();
  const configuration = getConfiguration().express;

  if (configuration.useCors) {
    app.use(cors());
  }
  app.use(bodyParser.json());

  app.use((_, res, next) => {
    res.setHeader('x-powered-by', configuration.poweredBy);
    next();
  });

  return app;
};

const route = expressApp => (settings) => {
  expressApp[settings.method.toLowerCase()](
    settings.path,
    executor(settings.pipeline),
  );
};

const nodegate = () => {
  const expressApp = buildExpressApp();
  const app = (req, res, next) => {
    expressApp.handle(req, res, next);
  };

  // TODO: app.passthrough = (route) => {};
  // TODO: app.beforeEach = () => {};

  app.route = route(expressApp);

  app.listen = expressApp.listen;

  return app;
};

module.exports = nodegate;
