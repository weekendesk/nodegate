---
layout: documentation
title: Workers - Filter
---

# Filter

> Allow to keep only the defined container's keys.

## filter(paths)

Filter the container's body to keep only the keys listed on the `paths` argument array.

### Arguments

| Argument | Type                       | Description                                        |
| :------- | :------------------------- | :------------------------------------------------- |
| paths    | **string** or **[string]** | **Required.** Paths or path to filter on the body. |

### Example

If the container's body currently contains those data:

```json
{
  "username": "shudrum",
  "birthdate": "1982-12-28",
  "firstname": "Julien",
  "lastname": "Martin"
}
```

You can filter values simply by calling the filter worker:

```js
const workflow = [
  filter(['firstname', 'lastname']),
];
```

The resulting container's body will be:

```json
{
  "firstname": "Julien",
  "lastname": "Martin"
}
```
