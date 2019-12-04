---
layout: documentation
title: Workflow error
---

# WorkflowError

> The WorkflowError is a class representing an error during a workflow.

The class `WorkflowError` allows workers to return a contextualized error to the workflow executor.
This error extends the default Node.js `Error` object.

## Reference

### container

The `container` attribute contains the container values before the error.

### response

The `response` attribute contains, if applicable, the response for the last executed request by
Nodegate.

### constructor(message, [response])

Constructor of the `WorkflowError`. The arguments are:

 - `message`: **required** string explaining the error,
 - `response`: object containing the last request's response made by Nodegate.

Example:

```js
new WorkflowError('Invalid request', {
  statusCode: 500,
  body: {
    reason: 'Missing parameter: param',
  },
});
```

### setContainer(container)

This method set the last state of the container to the error, the only argument is the container to
set. Example:

```js
const error = new WorkflowError('Invalid request');
error.setContainer({
  statusCode: 400,
  body: {
    reason: 'Missing parameter: param',
  }
});
```
