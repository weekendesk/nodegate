![nodegate](assets/images/logo-readme.png)

The easy plugin to programmatically manage a JSON API Gateway. Builded on top of
[Express](url-express) & [Request](url-request).

[![CircleCI][circleci-badge]][circleci-url]
[![Dependencies status][david-badge]][david-url]
[![Coverage status][coveralls-badge]][coveralls-url]
[![Version][version-badge]][version-url]

```js
const nodegate = require('nodegate');
const gate = nodegate();
const { aggregate } = nodegate.modifiers;

gate.route({
  method: 'get',
  path: '/user/:user',
  pipeline: [
    aggregate('get', 'https://api.github.com/users/{params.user}'),
    aggregate('get', 'https://api.github.com/users/{params.user}/gists'),
  ],
});

gate.listen(8080);
```

---

## Usage

![Nodegate usage](assets/images/schema-readme.png)

This plugin help you to solve the well known problem of [API management][url-wiki-api-management].
Some people are doing this by themselves, others by using complex tools or services, but even with
this kind of systems you will have to program some mechanics. **Nodegate** help you to
programmatically configure, develop and run your API gateway, in the simple way.

### Philosophy

The concept of **nodegate** is simple:

 - You declare the gateway routes,
 - Each route have a pipeline,
 - Each pipeline contain one or more modifier,
 - For each call, a data container will pass through every modifier before the response.

![Nodegate philosohpy](assets/images/philosophy-readme.png)

_And yes, there is more!_

A bunch of modifiers are bundled with this plugin.
I hope the community will soon create tons of usefull plugins around **nodegate**!

## Documentation

[The complete documentation can be found here](assets/documentation/README.md)

## License

Copyright (c) Weekendesk SAS.

[MIT](LICENSE)

[circleci-badge]: https://circleci.com/gh/weekendesk/nodegate.svg?style=shield
[circleci-url]: https://circleci.com/gh/weekendesk/nodegate
[david-badge]: https://david-dm.org/weekendesk/nodegate/status.svg
[david-url]: https://david-dm.org/weekendesk/nodegate
[coveralls-badge]: https://coveralls.io/repos/github/weekendesk/nodegate/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/weekendesk/nodegate?branch=master
[version-badge]: https://badge.fury.io/js/nodegate.svg
[version-url]: https://badge.fury.io/js/nodegate
[url-express]: https://expressjs.com/
[url-request]: https://github.com/request/request
[url-wiki-api-management]: https://en.wikipedia.org/wiki/API_management
