![nodegate](assets/images/logo-readme.png)

The easy plugin to programmatically manage a JSON API Gateway. Builded on top of [Express](https://expressjs.com/) & [Request](https://github.com/request/request).

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

## Usage

![Nodegate usage](assets/images/schema-readme.png)

This plugin help you to solve the well known problem of [API management][wiki-api-management].
Some people are doing this by themselves, others by using complex tools or services, but
even with this kind of systems you will have to program some mechanics.
**Nodegate** help you to programmatically configure, develop and run your API gateway, in the simple way.

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

## Table of content

- [Installation](#installation)
- [Hello world!](#hello-world)
- [API](#api)
  - [Nodegate](#nodegate)
  - [Routes](#routes)
  - [Modifiers](#modifiers)
  - [Pipelines](#pipelines)
- [Create a plugin](#create-a-plugin)
- [License](#license)

---

## Installation

You know the drill:

```bash
$ npm install nodegate
```

## Hello world!

Displaying "Hello world!" is a nonsense for this kind of plugin.
We gather the weather data from a plugin API: [MetaWeather](https://www.metaweather.com/).

**We will create a route allowing us to fetch the weather for any city in the world.**

Let's check the [API documentation](https://www.metaweather.com/api/) first:

The route `/api/location/search/?query=(query)` allow us to fetch metadata about a city,
containing the `woeid` attribute needed to fetch the weather of the city with the route
`/api/location/(woeid)`.

**Two API calls are needed, perfect example!**

After installing nodegate, let's create a file `index.js`. We will import nodegate and initializing it.
We will also need the aggregator modifier, let's import it also.

```js
const nodegate = require('nodegate');

const gate = nodegate();
const { aggregate } = nodegate.modifiers;
```

Now we will create our first route, `GET`, with the name of the city on the path. The route
object need three attributes: the method, the path, and the pipeline. The pipeline will then
be processes synchronously, using on each step a *container* generated from the request, and
containing the parameters and the body of the request.

```js
gate.route({
  method: 'get',
  path: '/weather/:city',
  pipeline: [
  ],
});
```

Now we have to set the pipeline of our route. The process is simple: we need to fetch the `woeid` from
the first route of the API, then to fetch the weather from the second one. On this example, we will
return all the collected data by using the `aggregate` modifier two times.

```js
gate.route({
  method: 'get',
  path: '/weather/:city',
  pipeline: [
    aggregate('get', 'https://www.metaweather.com/api/location/search/?query={params.city}', 'search'),
    aggregate('get', 'https://www.metaweather.com/api/location/{body.search.0.woeid}'),
  ],
});
```

**Note that all the data contained on the container are accessible on the urls.**

We finally just have to listen a port:

```js
gate.listen(8080);
```

And to start our server by using your terminal:

```bash
$ node index.js
```

**That's it!** Open your brower and try it out by typing on the url:
http://localhost:8080/weather/paris

You should have a JSON with all the data we wanted!

[You can find this complete example here.](assets/examples/hello-world)

## License

[MIT](LICENSE)

[circleci-badge]: https://circleci.com/gh/weekendesk/nodegate.svg?style=shield
[circleci-url]: https://circleci.com/gh/weekendesk/nodegate
[david-badge]: https://david-dm.org/weekendesk/nodegate/status.svg
[david-url]: https://david-dm.org/weekendesk/nodegate
[coveralls-badge]: https://coveralls.io/repos/github/weekendesk/nodegate/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/weekendesk/nodegate?branch=master
[version-badge]: https://badge.fury.io/js/nodegate.svg
[version-url]: https://badge.fury.io/js/nodegate
[wiki-api-management]: https://en.wikipedia.org/wiki/API_management
