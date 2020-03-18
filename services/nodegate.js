/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const request = require('request');
const { execute } = require('../entities/route');
const { getConfiguration } = require('./configuration');

const buildExpressApp = () => {
  const app = express();
  const configuration = getConfiguration();

  if (configuration.useCors) {
    app.use(cors());
  }
  app.use(bodyParser.json({
    limit: configuration.payloadSizeLimit || '1mb',
  }));

  app.use((_, res, next) => {
    res.setHeader('x-powered-by', configuration.poweredBy);
    next();
  });

  return app;
};

const toArray = (value) => {
  if (!Array.isArray(value)) {
    return [value];
  }
  return value;
};

const nodegate = () => {
  const expressApp = buildExpressApp();
  const beforeEach = [];
  const app = (req, res, next) => {
    expressApp.handle(req, res, next);
  };

  app.beforeEach = (workers) => {
    toArray(workers).forEach((worker) => beforeEach.push(worker));
  };

  app.passthrough = (routes) => {
    toArray(routes).forEach((route) => {
      expressApp[route.method.toLowerCase()](route.path, (req, res) => {
        request[route.method.toLowerCase()](route.target, {
          ...(req.headers && { headers: req.headers }),
          ...(req.body && { form: req.body }),
        }).pipe(res);
      });
    });
  };

  app.route = (routes) => {
    toArray(routes).forEach((route) => {
      expressApp[route.method.toLowerCase()](
        route.path,
        execute(route, beforeEach),
      );
    });
  };

  app.use = (middlewares) => {
    toArray(middlewares).forEach((middleware) => {
      expressApp.use(middleware);
    });
  };

  app.expressApp = expressApp;
  app.listen = expressApp.listen;

  return app;
};

module.exports = nodegate;
