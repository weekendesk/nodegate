---
layout: content
title: Workers - Remove
---

# filter(paths)

Remove the properties listed on the `paths` argument array from the container's body

_Arguments_

| Argument | Type                       | Description                                          |
| :------- | :------------------------- | :--------------------------------------------------- |
| paths    | **string** or **[string]** | **Required.** Paths or path to remove from the body. |

_Example_

```js
const workflow = [
  remove('secret'),
];
```
