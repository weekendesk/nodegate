---
layout: content
title: Modifiers - Project
---

# project(projections)

Create a new body by projecting value paths from the current one to the new one.

_Arguments_

| Argument     | Type       | Description                             |
| :----------- | :--------- | :-------------------------------------- |
| projections  | **array**  | **required** Projection rules to apply. |

_Example_

```js
const workflow = [
  project([['user.name', 'username']]),
];
```
