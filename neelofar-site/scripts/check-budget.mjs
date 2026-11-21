// Runs after every build (npm "postbuild", also on Vercel): fails the build
// -- so nothing is deployed -- if the JavaScript or the served images grow
// past these limits. Raise a limit here on purpose, never by accident.
import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";

const root = path.resolve(import.meta.dirname, "..");
const LIMITS = {
  totalJsGzipKB: 400, // all JavaScript chunks together, gzipped
  largestJsGzipKB: 150, // the biggest single chunk, gzipped
  imageCopyKB: 250, // each small WebP copy in public/_v (what phones load)
  coverKB: 300, // each special-issue cover
};

async function* walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const problems = [];
let total = 0;
let largest = { kb: 0, file: "" };
for await (const f of walk(path.join(root, ".next", "static"))) {
  if (!f.endsWith(".js")) continue;
  const kb = zlib.gzipSync(await fs.readFile(f)).length / 1024;
  total += kb;
  if (kb > largest.kb) largest = { kb, file: path.basename(f) };
}
if (total > LIMITS.totalJsGzipKB) problems.push(`JS total ${total.toFixed(0)} KB > ${LIMITS.totalJsGzipKB} KB`);
if (largest.kb > LIMITS.largestJsGzipKB)
  problems.push(`JS chunk ${largest.file} ${largest.kb.toFixed(0)} KB > ${LIMITS.largestJsGzipKB} KB`);

for (const [dir, limit] of [
  [path.join(root, "public", "_v"), LIMITS.imageCopyKB],
  [path.join(root, "public", "images", "covers"), LIMITS.coverKB],
]) {
  for await (const f of walk(dir)) {
    const kb = (await fs.stat(f)).size / 1024;
    if (kb > limit) problems.push(`${path.relative(root, f)} ${kb.toFixed(0)} KB > ${limit} KB`);
  }
}

console.log(`size budget: JS ${total.toFixed(0)} KB gzipped total, largest chunk ${largest.kb.toFixed(0)} KB`);
if (problems.length) {
  console.error("SIZE BUDGET EXCEEDED:\n  " + problems.join("\n  "));
  process.exit(1);
}
