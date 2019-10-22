---
layout: documentation
title: Initialization
---

# Initialization

> This page focus on the initialization and the configuration of the gateway

The plugin by itself is a javascript function returning the gateway, it also contains one property:
`workers`, and one function: `configure`.

## nodegate()

Creating the gateway only require two lines of code:

```js
const nodegate = require('nodegate');
const gateway = nodegate();
```

## workers

This property is an object containing all the built-in workers shipped with nodegate:

```js
const nodegate = require('nodegate');
const { aggregate } = nodegate.workers;
// or
const aggregate = nodegate.workers.aggregate;
```

There is different way for importing workers, for more information, see the
[workers documentation](/docs/workers.html).

## configure(options)

This function allow you to configure Nodegate, each call of this function reset the previous ones.

```js
const nodegate = require('nodegate');

nodegate.configure({
  useCors: false,
});
```

The argument `options` is an object, all the parameters are optionnals:

 - `payloadSizeLimit`: maximum size of the payload authorized by the gateway, defaults to `1mb`.
 - `useCors`: boolean allowing cross origin request, defaults to `true`.
 - `headers`: object containing key / value pairs to inject on all requests made by Nodegate,
 defaults to `{}`.

<div class="tip" markdown="1">
The configuration **cannot** be updated after the creation of the gateway.
</div>
