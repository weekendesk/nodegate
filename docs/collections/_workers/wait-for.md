---
layout: documentation
title: Workers - WaitFor
---

# WaitFor

> Wait for a specific request response to continue the workflow.

## waitFor(method, url, test)

Execute a request until the `test` argument function returns `true`.
The test function will receive two arguments:
 - a simplified response of the request, 
 - the container.

<div class="tip" markdown="1">
This worker if generaly used when you are waiting for the existance of an entity after a 202 status code.
</div>

### Arguments

| Argument   | Type         | Description                                             |
| :--------- | :----------- | :------------------------------------------------------ |
| method     | **string**   | Method of the request.                                  |
| url        | **string**   | URL to call.                                            |
| test       | **function** | Function to execute on each request to test the result. |

### Examples

This workflow will wait for a 200 status code response:

```js
const workflow = [
  waitFor(
    'get',
    'https://api.github.com/users/shudrum',
    response => response.statusCode === 200,
  ),
  // ...
];
```

This workflow will wait for a response containing the same user firstname as the container's body:

```js
const workflow = [
  waitFor(
    'get',
    'https://api.github.com/users/shudrum',
    (response, body) => response.user.firstname === body.user.firstname,
  ),
];
```

_The default configuration is:_

```json
{
  "delay": 300,
  "tentatives": 10,
}
```
