---
layout: content
title: Modifiers - StatusCode
---

# statusCode(code)

Set the status code of the response of the route.
Note that another modifier called after this one can modify the status code.

_Arguments_

| Argument | Type        | Description                  |
| :------- | :---------- | :--------------------------- |
| code     | **integer** | Status code of the response. |

_Example_

```js
const workflow = [
  statusCode(201),
];
```
