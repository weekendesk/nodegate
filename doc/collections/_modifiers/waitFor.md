---
layout: content
title: Modifiers - WaitFor
---

# waitFor(method, url, test)

Execute a request until the `test` argument function returns `true`.
The test function will receive two arguments: a simplified response, and the container of the route.

_Arguments_

| Argument   | Type         | Description                                             |
| :--------- | :----------- | :------------------------------------------------------ |
| method     | **string**   | Method of the request.                                  |
| url        | **string**   | URL to call.                                            |
| test       | **function** | Function to execute on each request to test the result. |

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
