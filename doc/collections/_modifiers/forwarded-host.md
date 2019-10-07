---
layout: content
title: Modifiers - Forwarded Host
---

# forwardedHost()

Add the property `X-Forwarded-Host` to the container headers, with the value of the original request header `host`.

_Example_

```js
const workflow = [
  forwardedHost(),
];
```
