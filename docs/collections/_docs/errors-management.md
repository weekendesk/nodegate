---
layout: documentation
title: Error management
---

## Error management

Better error management can be achieved with a callback property named `onError`.
This callback will receive a [WorkflowError](api-reference-pipelineerror.md) argument, with the
following contents:

 - The error message,
 - If applicable, the last response received by Nodegate,
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

# Errors

The class `WorkflowError` allows workers to return a contextualized error to the workflow executor.
This error extends the default Node.js `Error` object.

## Properties

### container

Container state before the error.

### response

If applicable: the response for the last executed request.

## Methods

### constructor(message, [response])

Constructor of the `WorkflowError`.

_Arguments_

| Argument | Type       | Description                      |
| :------- | :--------- | :------------------------------- |
| message  | **string** | **Required.** Error explanation. |
| response | **object** | Last request response.           |

_Example_

```js
new WorkflowError('Invalid request', {
  statusCode: 500,
  body: {
    reason: 'Missing parameter: param',
  },
});
```

### setContainer(container)

Set the last state of the container to the error.

_Arguments_

| Argument  | Type       | Description                     |
| :-------- | :--------- | :------------------------------ |
| container | **object** | **Required.** Container to set. |

_Example_

```js
const error = new WorkflowError('Invalid request');
error.setContainer({
  statusCode: 400,
  body: {
    reason: 'Missing parameter: param',
  }
});
```
