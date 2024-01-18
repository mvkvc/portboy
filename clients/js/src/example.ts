import { register, run } from "./main";
import { z } from "zod";

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

// Run this in IEX
// Portboy.run_exit({"/usr/bin/js", ["./clients/js/out/example.js"]}, "add", %{x: 1, y: 2})
