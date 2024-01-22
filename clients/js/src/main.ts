import { ZodSchema, z } from "zod";

type PBFunction = {
    function: Function,
    schema?: ZodSchema
}

export function register(
    functions: PBFunction[],
    registry?: Map<string, PBFunction>
): Map<string, PBFunction>{
    if (functions.length < 1) {
        throw new Error('Functions array must contain at least one function.');
    }

    if (registry === undefined) {
        registry = new Map<string, PBFunction>();
    }

    functions.forEach(
        (f: PBFunction) => {
            registry?.set(f.function.name, f)
        }
    )

    return registry;
}

const inputSchema = z.object({
    name: z.string(),
    arguments: z.any()
}).strict()

export function run(registry: Map<string, PBFunction>): void {
    process.stdin.on("data", jsonData => {
        let out;
        try {
            const raw_string = jsonData.toString();
            const raw_data = JSON.parse(raw_string);
            const data = inputSchema.parse(raw_data)
            const pbfn = registry.get(data.name)

            if (!pbfn) {
                throw new Error(`Function ${data.name} not found in the registry.`);
            }

            if (pbfn?.schema) {
                pbfn?.schema.parse(data.arguments)
            }

            const result = pbfn?.function.apply(null, Object.values(data.arguments))
            out = JSON.stringify({ok: result})
        } catch (e: any) {
            out = JSON.stringify({error: e.message})
        }

        process.stdout.write(out);
    })

    process.stdin.resume()
}

export { z } from "zod";
