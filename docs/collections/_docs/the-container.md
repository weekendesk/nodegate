---
layout: documentation
title: The container
---

# The container

> Explanations about the data set of the container.

The container is a **mutable** object created by Nodegate for each request. It contains all the data
needed to handle the request:

 - the `body` of the request,
 - the `query` of the request,
 - the `params` of the URL,
 - the `headers` to sent when performing requests,
 - the `statuscode` of the response.

The concept of Nodegate is around the container is simple: every worker can use the data inside it
and can update everything inside. At the end of the workflow, the body on the container will be
send with the response.

## Example

We want to create a route allowing to insert a user to a database with this request:

```bash
$ curl -X POST \
  http://localhost:8080/users \
  -H 'Content-Type: application/json' \
  -d '{
    "firstname": "Julien",
    "lastname": "Martin"
  }'
```

If we create a simple route without any workers in our workflow:

```js
gateway.route({
  method: 'post',
  path: '/users',
  workflow: [],
});
```

Nodegate will create a container containing only the body of the request in this case:

```json
{
  "firstname": "Julien",
  "lastname": "Martin"
}
```

The workflow is empty, it means that the reponse body will be exactly the same as the request body.

Now let's use the [Filter](/workers/filter.html) modifier:

```js
gateway.route({
  method: 'post',
  path: '/users',
  workflow: [
    filter(['firstname']),
  ],
});
```

This filter will remove all keys other than the ones listed on the list from the body. The resulting
updated container will be:

```json
{
  "firstname": "Julien",
}
```

And this container will be send as the response.

<div class="tip" markdown="1">
The container is mutable for asynchronous purposes. If you create custom workers, avoid to set a new
object for the body to avoid unwanted behaviors.
</div>
