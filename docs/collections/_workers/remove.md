---
layout: documentation
title: Workers - Remove
---

# Remove

> Allow to remove only the defined container's keys.

## remove(paths)

Remove the keys listed on the `paths` argument array from the container's body.

### Arguments

| Argument | Type                       | Description                                          |
| :------- | :------------------------- | :--------------------------------------------------- |
| paths    | **string** or **[string]** | **Required.** Paths or path to remove from the body. |


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

You can remove values simply by calling the `remove` worker:

```js
const workflow = [
  remove(['firstname', 'lastname']),
];
```

The resulting container's body will be:

```json
{
  "username": "shudrum",
  "birthdate": "1982-12-28"
}
```
