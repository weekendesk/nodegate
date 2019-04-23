![nodegate](../images/logo-documentation.png)

---

# [Documentation](README.md) > [API reference](api-reference.md) > nodegate()

The plugin by itself is a javascript function returning the gateway.

```js
const nodegate = require('nodegate');
const gateway = nodegate();
```

## Properties

### modifiers

This object contains all the built-in modifiers shipped with nodegate.

```js
const nodegate = require('nodegate');
const { aggregate } = nodegate.modifiers;

// or

const aggregate = nodegate.modifiers.aggregate;
```

## Methods

### configure([options])

Set the global configuration for **nodegate**, but also for Express and Request.

```js
const nodegate = require('nodegate');

nodegate.configure({
  useCors: false,
});
```

If `configure` is called without `options`, the configuration will be reseted.

_Configuration properties_

| Property          | Type      | Description                                                   | Default |
| :---------------- | :-------- | :------------------------------------------------------------ | :------ |
| `express`         | `object`  | An object containing the express configuration.               |         |
| `express.useCors` | `boolean` | Express will use the CORS middleware with the default values. | `true`  |

---

**[Next: Gateway](api-reference-gateway.md)**
