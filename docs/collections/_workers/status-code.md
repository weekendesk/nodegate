---
layout: documentation
title: Workers - StatusCode
---

# StatusCode

> Change the response status code.

## statusCode(code)

Set the status code of the response of the route. Note that another worker called after this one can
also modify the status code.

### Arguments

| Argument | Type        | Description                  |
| :------- | :---------- | :--------------------------- |
| code     | **integer** | Status code of the response. |

### Example

If you call this route, the reponse will be `418 I'm a teapot`.

```js
gateway.route({
  method: 'get',
  path: '/hello',
  workflow: [
    statusCode(418),
  ],
});
```
