# portboy/clients/js

This is the JavaScript client for the Portboy Elixir library: https://hex.pm/packages/portboy.

## Example

```ts
import { z, register, run } from "portboy";

function add(x: number, y: number) {
    return x + y
}

const add_schema = z.object({
    x: z.number(),
    y: z.number()
}).strict()

const registry = register([
    {function: add, schema: add_schema}
])

run(registry);
```
```elixir
Portboy.run_exit({"/usr/bin/js", ["./clients/js/out/example.js"]}, "add", %{x: 1, y: 2})
```
