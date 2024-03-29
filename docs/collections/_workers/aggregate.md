---
layout: documentation
title: Workers - Aggregate
---

# Aggregate

> Aggregate a request response into the container's body.

## aggregate(method, url, [options])

Execute a request with, by default, the `container`'s `headers` and `body` the contents of the
container and aggregate the response to the `container`'s body. Existing keys of the `container`'s
body will be overwrited by the reponse ones.

### Arguments

| Argument | Type       | Description                                 |
| :------- | :--------- | :------------------------------------------ |
| method   | **string** | **Required.** Method of the request.        |
| url      | **string** | **Required.** URL to call.                  |
| options  | **object** | Options for the request.                    |

The third argument `options` is an object accepting these keys:

 - `failStatusCodes`: Array of generic status codes which will break the workflow, starting the
 worklows `onError` option. So, in case another status code different than 4xx/5xx needs to be treated as an error, it's necessary to establish this property. The default value is `[400, 500]`. Be aware that this functionality only works in the next cases:
    - If original request does provide an error body, but an specific code is supplied. For instance, `{ failStatusCode: [302] }` will only understand that `302` is an error.
    - If original request doesn't provide an error body, the code supplied will be taken into account as a range of errors. For instance, `{ failStatusCode: [300] }` will understand that all the status codes in a range of `3xx` are an error.
 <!-- TODO: Include a comment about body and failStatusCode -->
 - `path`: [object path](https://github.com/mariocasciaro/object-path){:target="_blank"} like
 destination for the response of the request. Like the `container`'s body, existing keys will be
 overwritted.
 - `body`: object describing the body to send with the request, the values of each key must be an
 [object path](https://github.com/mariocasciaro/object-path){:target="_blank"} from the `container`.
 - `headers`: same usage as the body, but for the headers.
 - `errorOptions`: It's an object that will provide custom information to our response in case of failure.

## Examples

Let's assume a fictionnal API `https://myapi.com/:username` responding with some data for a user:

```json
{
  "username": "shudrum",
  "birthdate": "1982-12-28"
}
```

You can create a simple bridge like this, the response of the gateway will be exactly the same as
the API:

```js
gateway.route({
  method: 'get',
  path: '/:username',
  workflow: [
    aggregate('get', 'https://myapi.com/{params.username}'),
  ],
});
```

Using two workers and the `path` option you can request two user on the sametime:

```js
gateway.route({
  method: 'get',
  path: '/:user1/:user2',
  workflow: [
    aggregate('get', 'https://myapi.com/{params.user1}', {
      target: 'user1',
    }),
    aggregate('get', 'https://myapi.com/{params.user2}', {
      target: 'user2',
    }),
  ],
});
```

The reponse of a request matching this route will be like this one:

```json
{
  "user1": {
    "username": "shudrum",
    "birthdate": "1982-12-28"
  },
  "user2": {
    "username": "anotherprofile",
    "birthdate": "1992-06-30"
  },
}
```

### Custom errors

You can set a custom message for different errors based on their status code when they're triggered by a request,

```js
gateway.route({
  method: 'get',
  path: '/:username',
  workflow: [
    aggregate('get', `https://myapi.com/priceChecking?amount=xxx`, {
      id: 'priceChecking',
      errorOptions: {
        messages: {
          400: 'Custom and detailed message for this aggregate request',
          418: 'This is not a regular teapot error message anymore 🫖',
        }
      },
    }),
  ],
});
```

A `metaInfo` field will be always added by default to response body with information about the aggregate function that threw the error, including the service url which failed together with the rest of options that were passed as a parameter in the aggregate function:

```json
{
    "metaInfo": {
        "url": "https://myapi.com/priceChecking?amount=xxx",
        "id": "priceChecking"
    },
    "error": "Custom and detailed message for this aggregate request"
}
```

Notice that's possible to get rid of any metadata adding the property `includeMetaInfo` set to `false`.