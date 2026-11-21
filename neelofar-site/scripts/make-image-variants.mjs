// Runs before every build (npm "prebuild", also on Vercel). For each photo in
// public/images and public/uploads it writes smaller WebP copies (480px and
// 960px wide) to public/_v/, and lists them -- with each photo's own size --
// in app/lib/image-variants.json. Components use that list to give <img> a
// srcset (phones download the small copy) and width/height.
// Originals are never changed. Photos added later through /admin get their
// copies on the next deploy; until then they simply load the original.
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const pub = path.join(root, "public");
const outDir = path.join(pub, "_v");
const manifestFile = path.join(root, "app", "lib", "image-variants.json");
const WIDTHS = [480, 960];
const EXT = /\.(jpe?g|png|webp)$/i;

async function* walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (EXT.test(e.name)) yield p;
  }
}

const manifest = {};
let made = 0;
const started = Date.now();
for (const dir of ["images", "uploads"]) {
  for await (const file of walk(path.join(pub, dir))) {
    const url = "/" + path.relative(pub, file).split(path.sep).join("/");
    let meta;
    try {
      meta = await sharp(file).metadata();
    } catch {
      continue; // not a readable image -- leave it alone
    }
    // Account for phone photos stored sideways (EXIF orientation 5-8).
    const sideways = (meta.orientation ?? 1) >= 5;
    const w = sideways ? meta.height : meta.width;
    const h = sideways ? meta.width : meta.height;
    const variants = [];
    for (const vw of WIDTHS) {
      if (vw >= w) continue; // never upscale
      const rel = url.replace(/^\//, "").replace(EXT, `-${vw}.webp`);
      const out = path.join(outDir, rel);
      const fresh = await fs.stat(out).then((s) => s.mtimeMs >= (meta.mtimeMs ?? 0)).catch(() => false);
      if (!fresh) {
        await fs.mkdir(path.dirname(out), { recursive: true });
        await sharp(file).rotate().resize({ width: vw }).webp({ quality: 74 }).toFile(out);
        made++;
      }
      variants.push(vw);
    }
    manifest[url] = { w, h, v: variants };
  }
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await fs.writeFile(manifestFile, JSON.stringify(sorted, null, 1) + "\n");
console.log(
  `image variants: ${Object.keys(sorted).length} photos, ${made} new files, ${((Date.now() - started) / 1000).toFixed(1)}s`
);
