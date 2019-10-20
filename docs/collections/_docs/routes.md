---
layout: documentation
title: Routes
---

# Routes

Routes are objects defining the behavior of nodegate for a specific path and method.

_Properties_

| Argument | Type         | Description                                                                                        |
| :------- | :----------- | :------------------------------------------------------------------------------------------------- |
| method   | **string**   | **Required.** Method of the route (`get`, `post`, `patch`, …).                                     |
| path     | **string**   | **Required.** Path of the route, the path can be written the Express way, for example: `/user/:id` |
| workflow | **array**    | **Required.** List of the workers to apply to the container.                                       |
| onError  | **function** | Callback to execute in case of error. See [Error handling](#error-handling)                        |

The pipelines are lists of workers to execute **synchronously** to modify the container.

Each worker of the workflow will be called with two arguments:
 - The container, with the update of the previous worker,
 - The original request received by nodegate. (The Express request).

## Error handling

Better error management can be achieved with a callback property named `onError`.
This callback will receive a [WorkflowError](api-reference-pipelineerror.md) argument, with the
following contents:

 - The error message,
 - If applicable, the last response received by **nodegate**,
 - The container.

In case of error, the `statusCode` will be set to 500.

_Examples_

To answer a specific body with the error:

```js
gateway.route({
  method: 'get',
  path: '/gateway-route',
  workflow: [...],
  onError: (error) => {
    error.container.body = {
      reason: 'An unknow error occurred.',
    };
  };
});
```

To define a specific error code:

```js
gateway.route({
  method: 'get',
  path: '/gateway-route',
  workflow: [...],
  onError: (error) => {
    error.container.statusCode = 503;
  };
});
```
