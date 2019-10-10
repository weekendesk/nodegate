---
layout: documentation
title: nodegate()
---

# nodegate()

The plugin by itself is a javascript function returning the gateway.

```js
const nodegate = require('nodegate');
const gateway = nodegate();
```

## Properties

### workers

This object contains all the built-in workers shipped with nodegate.

```js
const nodegate = require('nodegate');
const { aggregate } = nodegate.workers;
// or
const aggregate = nodegate.workers.aggregate;
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

If `configure` is called without `options`, the configuration will be reset.

_Configuration properties_

| Property        | Type      | Description                                                     | Default |
| :-------------- | :-------- | :-------------------------------------------------------------- | :------ |
| express         | **object**  | An object containing the express configuration.               |         |
| express.useCors | **boolean** | Express will use the CORS middleware with the default values. | `true`  |
