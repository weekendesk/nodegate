/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const { execute } = require('../entities/pipeline');
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

const nodegate = () => {
  const expressApp = buildExpressApp();
  const beforeEach = [];
  const app = (req, res, next) => {
    expressApp.handle(req, res, next);
  };

  // TODO: app.passthrough = (route) => {};

  app.beforeEach = (modifiers) => {
    let modifiersToAdd = modifiers;
    if (!Array.isArray(modifiers)) {
      modifiersToAdd = [modifiers];
    }
    modifiersToAdd.forEach(modifier => beforeEach.push(modifier));
  };

  app.route = (routes) => {
    let routesToAdd = routes;
    if (!Array.isArray(routes)) {
      routesToAdd = [routes];
    }
    routesToAdd.forEach((route) => {
      expressApp[route.method.toLowerCase()](
        route.path,
        execute(route.pipeline, beforeEach),
      );
    });
  };

  app.listen = expressApp.listen;

  return app;
};

module.exports = nodegate;
