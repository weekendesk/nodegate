---
layout: documentation
title: Workers - KeepHeaders
---

# KeepHeaders

> Automatically add needed headers of the request to the container.

## keepHeaders(headers)

Add all the headers listed on the container's headers if they exists.

The headers are always fetched from the original request.

### Arguments

| Argument | Type         | Description                             |
| :------- | :----------- | :-------------------------------------- |
| headers  | **[string]** | **Required.** List of headers to fetch. |

The headers are case insensitive.

<div class="tip" markdown="1">
Even if the headers keys are case insentive, they will be added on the container following the case
specified on the headers argument.
</div>

### Example

```js
const workflow = [
  keepHeaders(['Authorization']),
];
```

Will automacitally update the container's headers, taking into consideration the original requests
received the authorization header:

```json
{
  "Authorization": "Bearer …",
}
```
