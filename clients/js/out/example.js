"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
const zod_1 = require("zod");
function add(x, y) {
    return x + y;
}
const add_schema = zod_1.z.object({
    x: zod_1.z.number(),
    y: zod_1.z.number()
}).strict();
const registry = (0, main_1.register)([
    { function: add, schema: add_schema }
]);
(0, main_1.run)(registry);
// Run this in IEX
// Portboy.run_exit({"/usr/bin/js", ["./clients/js/out/example.js"]}, "add", %{x: 1, y: 2})
