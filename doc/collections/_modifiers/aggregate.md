---
layout: content
title: Modifiers - Aggregate
---

# Aggregate

## aggregate(method, url, [path])

Execute a request with the contents of the container and aggregate the result to it.
If `path` is set, the result will be aggregated into the defined property path name on the container.

_Arguments_

| Argument | Type       | Description                                 |
| :------- | :--------- | :------------------------------------------ |
| method   | **string** | **Required.** Method of the request.        |
| url      | **string** | **Required.** URL to call.                  |
| path     | **string** | Path of the property to set the result.     |

_Example_

```js
const workflow = [
  aggregate('get', 'https://api.github.com/users/shudrum'),
];
```
