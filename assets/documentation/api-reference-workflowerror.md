![nodegate](../images/logo-documentation.png)

---

# [Documentation](README.md) > [API reference](api-reference.md) > WorkflowError

The class WorkflowError allows workers to return a contextualized error to the workflow executor.
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

| Argument   | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `message`  | `string` | **Required.** Error explanation. |
| `response` | `object` | Last request response.           |

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

| Argument    | Type     | Description                     |
| :---------- | :------- | :------------------------------ |
| `container` | `object` | **Required.** Container to set. |

_Example_

```js
const error = new WorkflowError('Invalid request');
error.setContainer({
  statusCode: 200,
  body: {
    reason: 'Missing parameter: param',
  }
});
```
