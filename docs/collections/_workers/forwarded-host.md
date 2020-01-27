---
layout: documentation
title: Workers - ForwardedHost
---

# ForwardedHost

> Automatically add the forwarder host header.

## forwardedHost()

Add the property `X-Forwarded-Host` to the container's headers, with the value of the original request header `host`.

### Example

This simple workflow:

```js
const workflow = [
  forwardedHost(),
];
```

Will automacitally update the container's headers, resulting like:

```json
{
  "X-Forwarded-Host": "http://127.0.0.1",
}
```
