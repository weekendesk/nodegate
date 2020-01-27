---
layout: documentation
title: Error management
---

# Error management

> This page explain the Nodegate behavior in case of error.

Better error management can be achieved with a callback property named `onError`.
This callback will receive a [WorkflowError](/api-reference-pipelineerror.html) argument, with the
following contents:

 - The error message,
 - If applicable: the last response received by a request,
 - The container.

In case of error, the `statusCode` will be set to 500.

## Examples

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

<div class="tip" markdown="1">
This callback can be useful to log the errors from Nodegate.
</div>
