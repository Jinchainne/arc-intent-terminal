import fs from "node:fs/promises";
import path from "node:path";

const typesDir = path.join(process.cwd(), ".next", "types");
const cacheLifePath = path.join(typesDir, "cache-life.d.ts");

await fs.mkdir(typesDir, { recursive: true });
await fs.writeFile(cacheLifePath, "export {};\n", "utf8");
