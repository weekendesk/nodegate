---
layout: documentation
title: Workers - MergeHeaders
---

# MergeHeaders

> Merge data into the container's headers.

## mergeBody(headers)

Merge an object into the container's headers.

### Arguments

| Argument | Type       | Description                                 |
| :------- | :--------- | :------------------------------------------ |
| headers  | **object** | Object to merge into the headers container. |

### Example

If the container's headers currently contains those data:

```json
{
  "Content-Type": "application/json",
}
```

You can add values with the `mergeHeaders` worker like that:

```js
const workflow = [
  mergeBody({ 'gateway-id': '007' }),
];
```

The resulting container's headers will be:

```json
{
  "Content-Type": "application/json",
  "gateway-id": "007"
}
```

<div class="tip" markdown="1">
This worker can be useful on some cases, but generally speaking, you sould rethink twice before using it.
</div>
