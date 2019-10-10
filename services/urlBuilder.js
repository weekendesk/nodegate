/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const at = require('lodash/at');

const getVariables = (url) => {
  const regExp = /({([a-zA-Z0-9.[\]]+)})/gm;
  const matches = [];
  let match;
  do {
    match = regExp.exec(url);
    if (match) {
      matches.push(match[2]);
    }
  } while (match !== null);
  return matches;
};

const parseUrl = (url) => {
  const details = {
    parts: [url],
    variables: getVariables(url),
  };
  details.variables.forEach((variable) => {
    const part = details.parts.pop();
    details.parts = details.parts.concat(
      part.split(`{${variable}}`),
    );
  });
  details.parts = details.parts.filter((entry) => !!entry);
  return details;
};

const getValue = (container, path) => {
  const value = at(container, path)[0];
  if (value === undefined) {
    throw new Error(`Missing value for {${path}}`);
  }
  return value;
};

const mergeUrl = (container, parsedUrl) => {
  let url = '';
  parsedUrl.parts.forEach((part, id) => {
    url += part;
    if (parsedUrl.variables[id]) {
      url += getValue(container, parsedUrl.variables[id]);
    }
  });
  return url;
};

module.exports = (url) => {
  const parsedUrl = parseUrl(url);
  if (parsedUrl.variables.length === 0) {
    return url;
  }
  return (container) => mergeUrl(container, parsedUrl);
};
