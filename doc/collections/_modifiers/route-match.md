---
layout: content
title: Modifiers - RouteMatch
---

# routeMatch(regex, pipeline)

Execute the `pipeline` argument if the path of the current route matches the regex.
Mainly useful for the `beforeEach()` pipeline.

_Arguments_

| Argument   | Type      | Description                                               |
| :--------- | :-------- | :-------------------------------------------------------- |
| regex      | **regex** | Regular expression to test against the path of the route. |
| pipeline   | **array** | Pipeline to execute if the path matches.                  |

_Example_

```js
const pipeline = [
  routeMatch(/\/user/, [
    // pipeline
  ]),
];
```
