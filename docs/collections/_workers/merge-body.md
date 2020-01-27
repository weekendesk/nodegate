---
layout: documentation
title: Workers - MergeBody
---

# MergeBody

> Merge data into the container's body.

## mergeBody(body)

Merge an object into the container's body.

### Arguments

| Argument | Type       | Description                              |
| :------- | :--------- | :--------------------------------------- |
| body     | **object** | Object to merge into the body container. |

### Example

If the container's body currently contains those data:

```json
{
  "username": "shudrum",
}
```

You can add values with the `mergeBody` worker like that:

```js
const workflow = [
  mergeBody({ firstname: 'Julien' }),
];
```

The resulting container's body will be:

```json
{
  "username": "shudrum",
  "firstname": "Julien"
}
```

<div class="tip" markdown="1">
This worker can be useful on some cases, but generally speaking, you sould rethink twice before using it.
</div>
