---
layout: content
title: Modifiers - Filter
---

# filter(paths)

Filter the container's body to keep only the properties listed on the `paths` argument array.

_Arguments_

| Argument | Type                       | Description                                        |
| :------- | :------------------------- | :------------------------------------------------- |
| paths    | **string** or **[string]** | **Required.** Paths or path to filter on the body. |

_Example_

```js
const workflow = [
  filter(['firstname', 'lastname']),
];
```
