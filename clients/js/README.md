# portboy

This is the JavaScript client for the [Portboy](https://hex.pm/packages/portboy) Elixir library.

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
iex(1)> Portboy.run_exit({"/usr/bin/js", ["./clients/js/out/example.js"]}, "add", %{x: 1, y: 2})

{:ok, 3}
```
