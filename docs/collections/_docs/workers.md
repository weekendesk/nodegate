---
layout: documentation
title: Workers
---

# Workers

> Overview of the workers structure and usage.

All workers can be accessed from the top level function of Nodegate or by direclty importing
the workers path. [Click here to see the complete list of workers.](workers)

```js
const nodegate = require('nodegate');
const { aggregate } = nodegate;
// or
const { aggregate } = require('nodegate/workers');
```

## Worker anatomy

Workers bundled with Nodegate are
[closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures){:target="_blank"}, the
first call allow you to configure the behavior of the worker, the second one will be called by
Nodegate to execute actions and/or modify the `container`.

Let's see the filter worker in details:

```js
module.exports = (paths) => (container) => {
  container.body = pick(container.body, paths);
};
```

The first call of the worker is the configuration: you can define the paths to filter from the
container. The second call is made by Nodegate to execute it and, for this worker, only set on the
body the defined paths values.

<div class="tip" markdown="1">
On some cases you will be able to just add a simple function to a workflow allowing you to do some
operations.
</div>