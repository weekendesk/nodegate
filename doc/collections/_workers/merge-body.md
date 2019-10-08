---
layout: content
title: Workers - MergeBody
---

# mergeBody(body)

Merge the body parameter into the container body.

_Arguments_

| Argument | Type       | Description                              |
| :------- | :--------- | :--------------------------------------- |
| body     | **object** | Object to merge into the body container. |

_Example_

```js
const workflow = [
  mergeBody({ data: 'value' }),
];
```
