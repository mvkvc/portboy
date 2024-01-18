"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.register = void 0;
const zod_1 = require("zod");
function register(functions, registry) {
    if (functions.length < 1) {
        throw new Error('Functions array must contain at least one function.');
    }
    if (registry === undefined) {
        registry = new Map();
    }
    functions.forEach((f) => {
        registry === null || registry === void 0 ? void 0 : registry.set(f.function.name, f);
    });
    return registry;
}
exports.register = register;
const inputSchema = zod_1.z.object({
    name: zod_1.z.string(),
    arguments: zod_1.z.any()
}).strict();
function run(registry) {
    process.stdin.on("data", jsonData => {
        let out;
        try {
            const raw_string = jsonData.toString();
            const raw_data = JSON.parse(raw_string);
            const data = inputSchema.parse(raw_data);
            const pbfn = registry.get(data.name);
            if (pbfn === null || pbfn === void 0 ? void 0 : pbfn.schema) {
                pbfn === null || pbfn === void 0 ? void 0 : pbfn.schema.parse(data.arguments);
            }
            const result = pbfn === null || pbfn === void 0 ? void 0 : pbfn.function.apply(null, Object.values(data.arguments));
            out = JSON.stringify({ ok: result });
        }
        catch (e) {
            out = JSON.stringify({ error: e });
        }
        process.stdout.write(out);
    });
    process.stdin.resume();
}
exports.run = run;
