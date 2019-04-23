![nodegate](../images/logo-documentation.png)

# [Documentation](README.md) > API

The API of **nodegate** is really simple to handle. The plugin is a function returning the gateway,
the routes are simple objects, pipelines are arrays and modifier pure functions.

Everything is detailled bellow:

  - [nodegate()](#nodegate)
  - [Gateway](#gateway)
  - [Routes](#routes)
  - [Container](#container)
  - [Modifiers](#modifiers-1)

## nodegate()

The plugin by itself is a javascript function returning the gateway.

```js
const nodegate = require('nodegate');
const gateway = nodegate();
```

### Properties

#### modifiers

This object contains all the built-in modifiers shipped with nodegate.

```js
const nodegate = require('nodegate');
const { aggregate } = nodegate.modifiers;
// or
const aggregate = nodegate.modifiers.aggregate;
```

### Methods

#### configure([options])

Set the global configuration for **nodegate**, but also for Express and Request.

```js
const nodegate = require('nodegate');

nodegate.configure({
  useCors: false,
});
```

If `configure` is called without `options`, the configuration will be reseted.

_Configuration properties_

| Property          | Type      | Description                                                   | Default |
| :---------------- | :-------- | :------------------------------------------------------------ | :------ |
| `express`         | `object`  | An object containing the express configuration.               |         |
| `express.useCors` | `boolean` | Express will use the CORS middleware with the default values. | `true`  |

## Gateway

The `gateway` is by convention, the resulting object when calling the top level `nodegate()`
function. It contains the methods you need to configure and start your gateway.

```js
const nodegate = require('nodegate');
const gateway = nodegate();

gateway.route({
  method: 'get',
  path: '/gateway-route',
  pipeline: [...],
});

gateway.listen(8080);
```

### Methods

#### route(route)

Add one or more route to the gateway.

```js
gateway.route({
  method: 'get',
  path: '/gateway-route',
  pipeline: [...],
});
```

_Arguments_

| Argument | Type                   | Description                                     |
| :------- | :--------------------- | :---------------------------------------------- |
| `route`  | `object` or `[object]` | Route or array of routes to add to the gateway. |

## Routes

Routes are object defining the behavior of nodegate for a specific path and method.

_Properties_

| Argument   | Type     | Description                                                                             |
| :--------- | :------- | :-------------------------------------------------------------------------------------- |
| `method`   | `string` | Method of the route (`get`, `post`, `patch`, …).                                        |
| `path`     | `string` | Path of the route, the path can be written on the Express way, for example: `/user/:id` |
| `pipeline` | `array`  | List of the modifiers to apply to the container.                                        |

The pipelines are the list of modifiers to execute **synchronously** to modify the container.

Each modifier of the pipeline will be called with two arguments:
 - The container, with the update of the previous modifier
 - The original requests received by nodegate. (The Express request).

## Container

For each http call, nodegate will start to execute a pipeline of different modifiers. This container
will be used for each request done by nodegate and for the response of the route.

The container contains the headers, body, parameters and query. By default everything is extracted
from the request except for the headers.

For example this request:

```bash
$ curl -X POST http://localhost/users \
    --header "Content-Type: application/json" \
    --data '{"firstname":"Shudrum"}'
```

Will initialize the container to:

```json
{
  "headers": {},
  "body": {
    "firstname": "Shudrum"
  },
  "params": {},
  "query": {}
}
```

The principle of nodegate is to compose the container with each modifier.

**At the end of the pipeline, nodegate will, by default, answer 200 with the container body.**

## Modifiers

All modifiers can be accessed from the top level function of **nodegate** or by direclty import the
modifiers path:

```js
const nodegate = require('nodegate');
const { aggregate } = nodegate;

// Or

const { aggregate } = require('nodegate/modifiers');
```

Here is the complete list of all the bundled modifiers:

 - [aggregate(method, url, [property])](#aggregatemethod-url-property)
 - [filter(properties)](#filterproperties)
 - [forwardedhost()](#forwardedhost)
 - [waitfor(method, url, test)](#waitformethod-url-test)

### aggregate(method, url, [property])

Execute a request with the content of the container and aggregate the result to it. If `property` is
set, the result will be aggregated to the defined property name on the container.

_Arguments_

| Argument   | Type     | Description                                 |
| :--------- | :------- | :------------------------------------------ |
| `method`   | `string` | Method of the request.                      |
| `url`      | `string` | URL to call.                                |
| `property` | `string` | Aggregate the result to that property name. |

_Example_

```js
const pipeline = [
  aggregate('get', 'https://api.github.com/users/shudrum'),
];
```

### filter(properties)

Filter the container's body to keep only the properties listed on the `properties` argument array.

_Arguments_

| Argument       | Type    | Description                                  |
| :------------- | :------ | :------------------------------------------- |
| `properties`   | `array` | Array containing all the properties to keep. |

_Example_

```js
const pipeline = [
  filter(['firstname', 'lastname']),
];
```

### forwardedhost()

Add the the container headers the property `X-Forwarded-Host` with the value of the original request
header `host`.

_Example_

```js
const pipeline = [
  forwardedhost(),
];
```

### waitfor(method, url, test)

Execute a request until the `test` argument function returns `true`. The test function will receive
two arguments: A simplified response, and the container of the route.

_Arguments_

| Argument   | Type       | Description                                             |
| :--------- | :--------- | :------------------------------------------------------ |
| `method`   | `string`   | Method of the request.                                  |
| `url`      | `string`   | URL to call.                                            |
| `test`     | `function` | Function to execute on each request to test the result. |

_Examples_

```js
const pipeline = [
  waitfor(
    'get',
    'https://api.github.com/users/shudrum',
    response => response.statusCode === 200,
  );
];
```

```js
const pipeline = [
  waitfor(
    'get',
    'https://api.github.com/users/shudrum',
    (response, body) => response.user.firstname === body.user.firstname,
  ),
];
```

_Default configuration_

```json
{
  "delay": 300,
  "tentatives": 10,
}
```
