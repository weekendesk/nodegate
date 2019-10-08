![nodegate](../images/logo-documentation.png)

---

# [Documentation](README.md) > [API reference](api-reference.md) > Gateway

The `gateway` is, by convention, the resulting object when calling the top level `nodegate()`
function. It contains the methods you need to configure and start your gateway.

```js
const nodegate = require('nodegate');
const gateway = nodegate();

gateway.route({
  method: 'get',
  path: '/gateway-route',
  workflow: [...],
});

gateway.listen(8080);
```

## Methods

### route(route)

Add one or more routes to the gateway.

```js
gateway.route({
  method: 'get',
  path: '/gateway-route',
  workflow: [...],
});
```

_Arguments_

| Argument | Type                   | Description                                     |
| :------- | :--------------------- | :---------------------------------------------- |
| `route`  | `object` or `[object]` | Route or array of routes to add to the gateway. |

### beforeEach(worker)

Add one or more workers to execute before each request.

```js
gateway.beforeEach(forwardedHost());

// or

gateway.beforeEach([
  forwardedHost(),
  aggregate('get', 'https://api.github.com/users/shudrum'),
]);
```

_Arguments_

| Argument   | Type                       | Description                                                    |
| :--------- | :------------------------- | :------------------------------------------------------------- |
| `worker` | `function` or `[function]` | Worker or array of workers to execute before all requests. |

---

**[Next: Routes](api-reference-routes.md)**
