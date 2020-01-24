---
layout: documentation
title: Workers - RouteMatch
---

# RouteMatch

> Execute a workflow if the route match a regular expression.

## routeMatch(regex, workflow)

Execute the `workflow` argument if the path of the current route matches the regex.

<div class="tip" markdown="1">
This worker if often useful for the `beforeEach()` workflow.
</div>

### Arguments

| Argument   | Type      | Description                                               |
| :--------- | :-------- | :-------------------------------------------------------- |
| regex      | **regex** | Regular expression to test against the path of the route. |
| workflow   | **array** | Workflow to execute if the path matches.                  |

### Example

You can for example configure a route like that:

```js
gateway.route({
  method: 'get',
  path: '/list/*',
  workflow: [
    routeMatch(/\/users/, [
      mergeBody({ message: "Hello users" }),
    ]),
  ],
});
```

The `mergeBody` worker will be called if you call the gateway like that: `http://localhost/list/users`,
but will not if you call this route: `http://localhost/list/weekends`.
