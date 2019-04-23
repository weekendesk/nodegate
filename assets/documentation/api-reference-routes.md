![nodegate](../images/logo-documentation.png)

---

# [Documentation](README.md) > [API reference](api-reference.md) > Routes

Routes are object defining the behavior of nodegate for a specific path and method.

_Properties_

| Argument   | Type     | Description                                                                             |
| :--------- | :------- | :-------------------------------------------------------------------------------------- |
| `method`   | `string` | Method of the route (`get`, `post`, `patch`, …).                                        |
| `path`     | `string` | Path of the route, the path can be written on the Express way, for example: `/user/:id` |
| `pipeline` | `array`  | List of the modifiers to apply to the container.                                        |

The pipelines are the list of modifiers to execute **synchronously** to modify the container.

Each modifier of the pipeline will be called with two arguments:
 - The container, with the update of the previous modifier
 - The original requests received by nodegate. (The Express request).

---

**[Next: Modifiers](api-reference-modifiers.md)**
