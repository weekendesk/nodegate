---
layout: documentation
title: Getting started
---

# Getting started

## Installation

Assuming you have already installed [Node.js](https://nodejs.org){:target="_blank"}, create a
directory and init your application:

```bash
$ mkdir mygateway
$ cd mygateway
```

Use the `npm init` command to create a `package.json` file for your application:

```bash
$ npm init
```

This command promps you for a number of things. Simply hit RETURN to accept the defaults for most of
them. Leave `index.js` as the entry point of your application.

```bash
$ entry point: (index.js)
```

Now install **Nodegate** and save it in the dependencies list.

```bash
$ npm install nodegate --save
```

<div class="tip" markdown="1">
See the [npm documentation](https://docs.npmjs.com/cli/npm){:target="_blank"} for the full list of
commands available with npm.
</div>

## The main concept

The concept of **Nodegate** is simple: you create a `gateway` with `routes` defined executing
`workflows` composed of `workers`.
Here is an exemple of a gateway responding, with only one request, user and gist data from the
[GitHub API](https://developer.github.com/v3){:target="_blank"}:

```js
const nodegate = require('nodegate');
const { aggregate } = require('nodegate/workers');
const gateway = nodegate();

gateway.route({
  method: 'get',
  path: '/:user',
  workflow: [
    aggregate('get', '/users/{params.user}'),
    aggregate('get', '/users/{params.user}/gists', { target: 'gists' }),
  ],
});

gateway.listen(8080);
```

### How does it work?

When a request is handled by **Nodegate**, a `container` is created, this container is automatically
filled with different kind of data like the `body` of the request. At the end of the workflow, this
container `body` will be sent as the response.

_This means a route without workflow will simply respond with the body of the request._

To fulfill the role of microservice orchestrator, Nodegate is shipped with dozens of workers you can
configure into workflows to execute all the needed operations before responding. The workflows
executes the configured workers **synchronously**.

<div class="tip" markdown="1">
Workflows can embed other workflows but will still be executed synchronously. The worker
`executeAsynchronously` allow to execute two workflows aynchronously.
</div>
