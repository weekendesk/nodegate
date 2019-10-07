---
layout: content
title: Modifiers - MergeHeaders
---

# mergeHeaders(headers)

Merge the headers parameter into the container headers.

_Arguments_

| Argument  | Type       | Description                                 |
| :-------- | :--------- | :------------------------------------------ |
| headers   | **object** | Object to merge into the headers container. |

_Example_

```js
const workflow = [
  mergeHeaders({ data: 'value' }),
];
```
