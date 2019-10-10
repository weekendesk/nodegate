![nodegate](../images/logo-documentation.png)

---

# [Documentation](README.md) > [API reference](api-reference.md) > Workers

All workers can be accessed from the top level function of **nodegate** or by direclty importing the
workers path:

```js
const nodegate = require('nodegate');
const { aggregate } = nodegate;

// or

const { aggregate } = require('nodegate/workers');
```

Here is the complete list of all the bundled workers:

 - [aggregate(method, url, [property])](#aggregatemethod-url-property)
 - [filter(properties)](#filterproperties)
 - [forwardedHost()](#forwardedhost)
 - [mergeBody(body)](#mergebodybody)
 - [mergeHeaders(headers)](#mergeheadersheaders)
 - [waitFor(method, url, test)](#waitformethod-url-test)
 - [routeMatch(regex, workflow)](#routematchregex-workflow)
 - [statusCode(code)](#statuscodecode)

## aggregate(method, url, [property])

Execute a request with the contents of the container and aggregate the result to it. If `property` is
set, the result will be aggregated into the defined property name on the container.

_Arguments_

| Argument | Type     | Description                                 |
| :------- | :------- | :------------------------------------------ |
| `method` | `string` | **Required.** Method of the request.        |
| `url`    | `string` | **Required.** URL to call.                  |
| `path`   | `string` | Path of the property to set the result.     |

_Example_

```js
const workflow = [
  aggregate('get', 'https://api.github.com/users/shudrum'),
];
```

## filter(paths)

Filter the container's body to keep only the properties listed on the `properties` argument array.

_Arguments_

| Argument | Type           | Description                                        |
| :------- | :------------- | :------------------------------------------------- |
| `paths`  | `string|array` | **Required.** Paths or path to filter on the body. |

_Example_

```js
const workflow = [
  filter(['firstname', 'lastname']),
];
```

## forwardedHost()

Add the property `X-Forwarded-Host` to the container headers, with the value of the original request
header `host`.

_Example_

```js
const workflow = [
  forwardedHost(),
];
```

## mergeBody(body)

Merge the body parameter into the container body.

_Arguments_

| Argument | Type     | Description                              |
| :------- | :------- | :--------------------------------------- |
| `body`   | `object` | Object to merge into the body container. |

_Example_

```js
const workflow = [
  mergeBody({ data: 'value' }),
];
```

## mergeHeaders(headers)

Merge the headers parameter into the container headers.

_Arguments_

| Argument    | Type     | Description                                 |
| :---------- | :------- | :------------------------------------------ |
| `headers`   | `object` | Object to merge into the headers container. |

_Example_

```js
const workflow = [
  mergeHeaders({ data: 'value' }),
];
```

## statusCode(code)

Set the status code of the response of the route. Note that another worker called after this one
can modify the status code.

_Arguments_

| Argument | Type      | Description                  |
| :------- | :-------- | :--------------------------- |
| `code`   | `integer` | Status code of the response. |

_Example_

```js
const workflow = [
  statusCode(201),
];
```

## routeMatch(regex, workflow)

Execute the `workflow` argument if the path of the current route matches the regex.
Mainly useful for the `beforeEach()` workflow.

_Arguments_

| Argument   | Type    | Description                                               |
| :--------- | :------ | :-------------------------------------------------------- |
| `regex`    | `regex` | Regular expression to test against the path of the route. |
| `workflow` | `array` | Workflow to execute if the path matches.                  |

_Example_

```js
const workflow = [
  routeMatch(/\/user/, [
    // workflow
  ]),
];
```

## waitFor(method, url, test)

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
const workflow = [
  waitFor(
    'get',
    'https://api.github.com/users/shudrum',
    response => response.statusCode === 200,
  );
];
```

```js
const workflow = [
  waitFor(
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

---

**[Next: WorkflowError](api-reference-workflowerror.md)**
