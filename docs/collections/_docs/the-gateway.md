---
layout: documentation
title: The gateway
---

# The gateway

> All needed to managing the routes are explained here.

The `gateway` is, by convention, the resulting object when calling the top level [nodegate()
function](/docs/initialization.html). It contains the methods you need to configure and start your gateway.

## route(route)

Add one or more routes to the gateway.

```js
gateway.route({
  method: 'get',
  path: '/gateway-route',
  workflow: [
    aggregate('post', 'https://api.github.com'),
    aggregate('get', '/repos/{body.username}/weekendesk/pulls'),
  ],
});
```

### Arguments

| Argument | Type                       | Description                                     |
| :------- | :------------------------- | :---------------------------------------------- |
| route    | **object** or **[object]** | Route or array of routes to add to the gateway. |

A `route` is represented by an object with the following parameters:

 - `method`: **required** string for the method (get, post, pull, ...).
 - `path`: **required** string for the path of the request.
 - `workflow`: **required** array defining the workflow to execute.
 - `onError`: optionnal function called in case of error, before stopping the workflow execution.

<div class="tip" markdown="1">
Route paths are managed by express, to see how works parameters or different kind of tips,
[see the express routing](https://expressjs.com/en/guide/routing.html){:target="_blank"}.
</div>

## beforeEach(worker)

Add one worker or a workflow to execute before each request.

```js
gateway.beforeEach(forwardedHost());
// or
gateway.beforeEach([
  forwardedHost(),
  aggregate('get', 'https://api.github.com/users/shudrum'),
]);
```

### Arguments

| Argument | Type                           | Description                                        |
| :------- | :----------------------------- | :------------------------------------------------- |
| worker   | **function** or **[function]** | Worker or workflow to execute before all requests. |

<div class="tip" markdown="1">
A workflow is nothing more than an array of workers.
</div>

## listen(port)

Start the Nodegate server.

```js
gateway.listen(8080);
```

### Arguments

| Argument | Type        | Description                      |
| :------- | :---------- | :------------------------------- |
| port     | **integer** | Port the gateway will listen to. |
