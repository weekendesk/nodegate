---
layout: documentation
title: Workers - ExecuteIf
---

# ExecuteIf

> Execute a workflow if a condition is met.

## executeIf(condition, workflow)

Execute a workflow if a condition is true.

### Arguments

| Argument     | Type         | Description                                             |
| :----------- | :----------- | :------------------------------------------------------ |
| condition    | **function** | **Required.** Condition needed to execute the workflow. |
| workflow     | **array**    | **Required.** Workflow to execute.                      |
| elseWorkflow | **array**    | Workflow to execute if the condition fails.             |

 - The `condition` function receive two arguments: `container` and `request`. It must return either
   `true` or `false`,
 - The `workflow` is simply an array of workers,
 - The `elseWorkflow` is an array of workers to execute if the condition fails.

## Examples

In this example, we only want to fetch some data from our API if the weather is sunny:

```js
gateway.route({
  method: 'get',
  path: '/:username',
  workflow: [
    aggregate('get', 'https://myapi.com/weather'),
    executeIf(({ body }) => body.weather === 'sun', [
      aggregate('get', 'https://myapi.com/activities'),
    ]),
  ],
});
```

The response of the request can be, if sunny:

```json
{
  "weather": "sun",
  "activities": [
    "football",
    "kayak"
  ]
}
```

But, if the weather is not sunny:

```json
{
  "weather": "rain"
}
```
