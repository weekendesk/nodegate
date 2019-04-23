![nodegate](../images/logo-documentation.png)

---

# [Documentation](README.md) > [API reference](api-reference.md) > Gateway

The `gateway` is by convention, the resulting object when calling the top level `nodegate()`
function. It contains the methods you need to configure and start your gateway.

```js
const nodegate = require('nodegate');
const gateway = nodegate();

gateway.route({
  method: 'get',
  path: '/gateway-route',
  pipeline: [...],
});

gateway.listen(8080);
```

## Methods

### route(route)

Add one or more route to the gateway.

```js
gateway.route({
  method: 'get',
  path: '/gateway-route',
  pipeline: [...],
});
```

_Arguments_

| Argument | Type                   | Description                                     |
| :------- | :--------------------- | :---------------------------------------------- |
| `route`  | `object` or `[object]` | Route or array of routes to add to the gateway. |

---

**[Next: Routes](api-reference-routes.md)**
