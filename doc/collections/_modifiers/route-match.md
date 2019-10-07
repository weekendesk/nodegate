---
layout: content
title: Modifiers - RouteMatch
---

# routeMatch(regex, workflow)

Execute the `workflow` argument if the path of the current route matches the regex.
Mainly useful for the `beforeEach()` workflow.

_Arguments_

| Argument   | Type      | Description                                               |
| :--------- | :-------- | :-------------------------------------------------------- |
| regex      | **regex** | Regular expression to test against the path of the route. |
| workflow   | **array** | Workflow to execute if the path matches.                  |

_Example_

```js
const workflow = [
  routeMatch(/\/user/, [
    // workflow
  ]),
];
```
